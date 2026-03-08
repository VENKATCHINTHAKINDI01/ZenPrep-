"use client";

import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { createFeedback } from "@/lib/actions/general.action";
import { playAudio, startRecording, stopRecording } from "@/lib/sarvam";
import { INTERVIEWER_CONFIG } from "@/constants";
import LanguagePicker from "@/components/LanguagePicker";
import DomainPicker from "@/components/DomainPicker";
import { getDomainTechstack } from "@/constants/domains";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────
type CallStatus = "inactive" | "connecting" | "active" | "finished";

type TranscriptEntry = {
  role: "user" | "assistant";
  content: string;
};

type InterviewConfig = {
  role: string;
  level: string;
  type: string;
  domain: string;
  techstack: string;
  amount: number;
  language: SarvamLanguageCode;
};

// ─────────────────────────────────────────────
// AGENT COMPONENT
// ─────────────────────────────────────────────
const Agent = ({
  userName,
  userId,
  interviewId,
  feedbackId,
  type,
  questions = [],
  language: initialLanguage = "en-IN",
  domain: initialDomain = "technical",
  profileImage,
}: AgentProps) => {
  const router = useRouter();

  // ── Core state ──
  const [callStatus, setCallStatus] = useState<CallStatus>("inactive");
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false); // AI is speaking
  const [isListening, setIsListening] = useState(false); // User is speaking
  const [questionIndex, setQuestionIndex] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  // ── Generate mode state ──
  const [selectedLanguage, setSelectedLanguage] =
    useState<SarvamLanguageCode>(initialLanguage);
  const [selectedDomain, setSelectedDomain] = useState(initialDomain);
  const [config, setConfig] = useState<InterviewConfig>({
    role: "",
    level: "junior",
    type: "technical",
    domain: initialDomain,
    techstack: getDomainTechstack(initialDomain).join(", "),
    amount: 5,
    language: initialLanguage,
  });

  // ── Refs (don't cause re-renders) ──
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const isInterviewActive = useRef(false);

  // ─────────────────────────────────────────────
  // SPEAK — AI speaks text via Sarvam TTS
  // ─────────────────────────────────────────────
  const speak = useCallback(
    async (text: string, lang: SarvamLanguageCode = selectedLanguage) => {
      setIsSpeaking(true);
      setCurrentMessage(text);

      try {
        // Call our TTS API route (keeps API key server-side)
        const response = await fetch("/api/sarvam/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, languageCode: lang }),
        });

        const data = await response.json();

        if (data.success && data.audioBase64) {
          await playAudio(data.audioBase64);
        }
      } catch (error) {
        console.error("TTS error:", error);
      } finally {
        setIsSpeaking(false);
        setCurrentMessage("");
      }
    },
    [selectedLanguage]
  );

  // ─────────────────────────────────────────────
  // LISTEN — Record user's answer via mic
  // ─────────────────────────────────────────────
  const listen = useCallback(async (): Promise<string> => {
    setIsListening(true);

    try {
      const { mediaRecorder, audioChunks } = await startRecording();
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = audioChunks;

      // Wait for user to click "Done Answering"
      // This promise resolves when stopListening() is called
      return await new Promise((resolve) => {
        mediaRecorderRef.current!.onstop = async () => {
          const audioBlob = new Blob(audioChunks, {
            type: mediaRecorder.mimeType,
          });

          // Send audio to STT API route
          const formData = new FormData();
          formData.append(
            "audio",
            new File([audioBlob], "answer.webm", { type: audioBlob.type })
          );
          formData.append("languageCode", selectedLanguage);

          try {
            const response = await fetch("/api/sarvam/stt", {
              method: "POST",
              body: formData,
            });

            const data = await response.json();
            resolve(data.transcript || "");
          } catch {
            resolve("");
          }
        };
      });
    } finally {
      setIsListening(false);
    }
  }, [selectedLanguage]);

  // ─────────────────────────────────────────────
  // STOP LISTENING — User clicks "Done Answering"
  // ─────────────────────────────────────────────
  const stopListening = useCallback(() => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
      // Release mic tracks
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((t) => t.stop());
    }
    setIsListening(false);
  }, []);

  // ─────────────────────────────────────────────
  // RUN INTERVIEW — Main interview loop
  // Asks questions one by one, records answers
  // ─────────────────────────────────────────────
  const runInterview = useCallback(
    async (interviewQuestions: string[]) => {
      isInterviewActive.current = true;

      // Speak the first message in selected language
      const firstMsg =
        INTERVIEWER_CONFIG.firstMessage[selectedLanguage] ||
        INTERVIEWER_CONFIG.firstMessage["en-IN"];

      await speak(firstMsg);

      // Loop through all questions
      for (let i = 0; i < interviewQuestions.length; i++) {
        if (!isInterviewActive.current) break;

        setQuestionIndex(i);
        const question = interviewQuestions[i];

        // Add question to transcript
        setTranscript((prev) => [
          ...prev,
          { role: "assistant", content: question },
        ]);

        // AI speaks the question
        await speak(question);

        // Wait for user answer
        const answer = await listen();

        if (answer && isInterviewActive.current) {
          // Add answer to transcript
          setTranscript((prev) => [
            ...prev,
            { role: "user", content: answer },
          ]);
        }
      }

      if (isInterviewActive.current) {
        // Speak closing message
        const closingMessages: Record<string, string> = {
          "en-IN":
            "Thank you for your time today. That concludes our interview. ZenPrep will now generate your detailed feedback. Best of luck!",
          "hi-IN":
            "आज के लिए आपका धन्यवाद। हमारा इंटरव्यू यहीं समाप्त होता है। ZenPrep अब आपकी विस्तृत प्रतिक्रिया तैयार करेगा।",
          "ta-IN":
            "இன்று உங்கள் நேரத்திற்கு நன்றி. நேர்காணல் இப்போது முடிந்தது. ZenPrep இப்போது உங்கள் கருத்துக்களை உருவாக்கும்.",
          "te-IN":
            "ఈరోజు మీ సమయానికి ధన్యవాదాలు. మన ఇంటర్వ్యూ ఇక్కడితో ముగిసింది. ZenPrep ఇప్పుడు మీ వివరణాత్మక అభిప్రాయాన్ని రూపొందిస్తుంది.",
        };

        const closing =
          closingMessages[selectedLanguage] || closingMessages["en-IN"];
        await speak(closing);

        setCallStatus("finished");
      }
    },
    [speak, listen, selectedLanguage]
  );

  // ─────────────────────────────────────────────
  // START INTERVIEW (type = "interview")
  // ─────────────────────────────────────────────
  const handleStartInterview = useCallback(async () => {
    if (!questions.length) {
      toast.error("No questions found for this interview");
      return;
    }

    setCallStatus("connecting");

    // Small delay so UI shows "connecting" state
    await new Promise((r) => setTimeout(r, 800));

    setCallStatus("active");
    setTranscript([]);
    setQuestionIndex(0);

    await runInterview(questions);
  }, [questions, runInterview]);

  // ─────────────────────────────────────────────
  // GENERATE INTERVIEW (type = "generate")
  // Collects config → calls API → creates interview
  // ─────────────────────────────────────────────
  const handleGenerateInterview = useCallback(async () => {
    if (!config.role.trim()) {
      toast.error("Please enter a job role");
      return;
    }

    setCallStatus("connecting");

    try {
      const response = await fetch("/api/vapi/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: config.type,
          role: config.role,
          level: config.level,
          techstack: config.techstack,
          amount: config.amount,
          userid: userId,
          language: selectedLanguage,
          domain: selectedDomain,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Interview created! Redirecting...");
        router.push("/");
      } else {
        toast.error("Failed to create interview. Please try again.");
        setCallStatus("inactive");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      setCallStatus("inactive");
    }
  }, [config, selectedLanguage, selectedDomain, userId, router]);

  // ─────────────────────────────────────────────
  // END INTERVIEW
  // ─────────────────────────────────────────────
  const handleEndInterview = useCallback(() => {
    isInterviewActive.current = false;
    stopListening();
    setCallStatus("finished");
  }, [stopListening]);

  // ─────────────────────────────────────────────
  // SAVE FEEDBACK — runs when callStatus → "finished"
  // ─────────────────────────────────────────────
  useEffect(() => {
    const saveFeedback = async () => {
      if (
        callStatus !== "finished" ||
        type !== "interview" ||
        !interviewId ||
        !userId ||
        isSaving ||
        transcript.length === 0
      )
        return;

      setIsSaving(true);

      try {
        const result = await createFeedback({
          interviewId,
          userId,
          transcript,
          feedbackId,
          language: initialLanguage,
        });

        if (result.success) {
          toast.success("Feedback generated! Redirecting...");
          router.push(`/interview/${interviewId}/feedback`);
        } else {
          toast.error("Failed to save feedback. Please try again.");
        }
      } catch (error) {
        toast.error("Something went wrong saving feedback.");
      } finally {
        setIsSaving(false);
      }
    };

    saveFeedback();
  }, [callStatus]);

  // ─────────────────────────────────────────────
  // DOMAIN CHANGE — auto-fill techstack
  // ─────────────────────────────────────────────
  const handleDomainChange = (domainId: string, techstack: string[]) => {
    setSelectedDomain(domainId);
    setConfig((prev) => ({
      ...prev,
      domain: domainId,
      techstack: techstack.join(", "),
    }));
  };

  // ─────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────
  const isActive = callStatus === "active";
  const isInactive = callStatus === "inactive";
  const isConnecting = callStatus === "connecting";
  const isFinished = callStatus === "finished";

  // ── GENERATE MODE UI ──
  if (type === "generate") {
    return (
      <div className="flex flex-col gap-8 w-full max-w-3xl">
        {/* Language Picker */}
        <LanguagePicker
          selected={selectedLanguage}
          onSelect={setSelectedLanguage}
        />

        {/* Domain Picker */}
        <DomainPicker
          selected={selectedDomain}
          onSelect={handleDomainChange}
        />

        {/* Interview Config Form */}
        <div className="card-border w-full">
          <div className="card p-6 flex flex-col gap-5">
            <h3 className="text-white">Interview Details</h3>

            {/* Job Role */}
            <div className="flex flex-col gap-1.5">
              <label className="text-light-400 text-sm">Job Role *</label>
              <input
                type="text"
                placeholder="e.g. Frontend Developer, Data Scientist"
                value={config.role}
                onChange={(e) =>
                  setConfig((p) => ({ ...p, role: e.target.value }))
                }
                className="bg-dark-200 rounded-full min-h-12 px-5 text-white placeholder:text-light-600 border border-input focus:outline-none focus:border-primary-200/50 transition-colors"
              />
            </div>

            {/* Row: Level + Type */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-light-400 text-sm">
                  Experience Level
                </label>
                <select
                  value={config.level}
                  onChange={(e) =>
                    setConfig((p) => ({ ...p, level: e.target.value }))
                  }
                  className="bg-dark-200 rounded-full min-h-12 px-5 text-white border border-input focus:outline-none focus:border-primary-200/50 transition-colors cursor-pointer"
                >
                  <option value="intern">Intern</option>
                  <option value="junior">Junior (0–2 yrs)</option>
                  <option value="mid">Mid Level (2–5 yrs)</option>
                  <option value="senior">Senior (5+ yrs)</option>
                  <option value="lead">Tech Lead / Manager</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-light-400 text-sm">
                  Interview Focus
                </label>
                <select
                  value={config.type}
                  onChange={(e) =>
                    setConfig((p) => ({ ...p, type: e.target.value }))
                  }
                  className="bg-dark-200 rounded-full min-h-12 px-5 text-white border border-input focus:outline-none focus:border-primary-200/50 transition-colors cursor-pointer"
                >
                  <option value="technical">Technical</option>
                  <option value="behavioral">Behavioral</option>
                  <option value="mixed">Mixed</option>
                </select>
              </div>
            </div>

            {/* Tech Stack */}
            <div className="flex flex-col gap-1.5">
              <label className="text-light-400 text-sm">
                Tech Stack / Topics
              </label>
              <input
                type="text"
                placeholder="e.g. React, Node.js, MongoDB"
                value={config.techstack}
                onChange={(e) =>
                  setConfig((p) => ({ ...p, techstack: e.target.value }))
                }
                className="bg-dark-200 rounded-full min-h-12 px-5 text-white placeholder:text-light-600 border border-input focus:outline-none focus:border-primary-200/50 transition-colors"
              />
              <p className="text-light-600 text-xs px-2">
                Comma-separated. Auto-filled from domain selection above.
              </p>
            </div>

            {/* Number of questions */}
            <div className="flex flex-col gap-1.5">
              <label className="text-light-400 text-sm">
                Number of Questions:{" "}
                <span className="text-primary-200 font-bold">
                  {config.amount}
                </span>
              </label>
              <input
                type="range"
                min={3}
                max={10}
                value={config.amount}
                onChange={(e) =>
                  setConfig((p) => ({
                    ...p,
                    amount: parseInt(e.target.value),
                  }))
                }
                className="w-full accent-[#cac5fe] cursor-pointer"
              />
              <div className="flex justify-between text-light-600 text-xs px-1">
                <span>3 (Quick)</span>
                <span>10 (Full)</span>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerateInterview}
              disabled={isConnecting || !config.role.trim()}
              className="btn-primary w-full flex items-center justify-center min-h-12 text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {isConnecting ? (
                <span className="flex items-center gap-2">
                  <span className="size-4 border-2 border-dark-100/30 border-t-dark-100 rounded-full animate-spin" />
                  Generating Interview...
                </span>
              ) : (
                "✨ Generate Interview"
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── INTERVIEW MODE UI ──
  return (
    <div className="flex flex-col gap-8 w-full">
      {/* ── Call View: AI card + User card ── */}
      <div className="call-view">
        {/* AI Interviewer Card */}
        <div className="card-interviewer">
          <div className="avatar">
            {/* Ping animation when AI is speaking */}
            {isSpeaking && (
              <span className="animate-speak" />
            )}
            <Image
              src= "/ai-avatar-2.png"
              alt="AI Interviewer"
              width={65}
              height={65}
              className="z-10"
            />
          </div>
          <h3>ZenPrep AI</h3>

          {/* Question progress */}
          {isActive && (
            <p className="text-light-600 text-xs mt-1">
              Question {questionIndex + 1} of {questions.length}
            </p>
          )}

          {/* Speaking / listening status */}
          <p className="text-light-400 text-sm mt-2">
            {isConnecting && "Connecting..."}
            {isActive && isSpeaking && "Speaking..."}
            {isActive && isListening && "Listening to you..."}
            {isActive && !isSpeaking && !isListening && "Ready"}
            {isFinished && "Interview Complete"}
          </p>
        </div>

        {/* User Card */}
        <div className="card-border">
          <div className="card-content">
            <div className="avatar">
              {/* Pulse animation when user is speaking */}
              {isListening && (
                <span className="animate-speak" />
              )}
              <Image
                src={profileImage || "/user-avatar.png"}
                alt={userName}
                width={65}
                height={65}
                className="z-10 rounded-full object-cover size-[65px]"
              />
            </div>
            <h3>{userName}</h3>
            <p className="text-light-400 text-sm mt-2">
              {isListening ? "🎙️ Recording..." : "You"}
            </p>
          </div>
        </div>
      </div>

      {/* ── Live Transcript Display ── */}
      {currentMessage && (
        <div className="transcript-border">
          <div className="transcript">
            <p>{currentMessage}</p>
          </div>
        </div>
      )}

      {/* ── Last answer display ── */}
      {transcript.length > 0 && !currentMessage && (
        <div className="transcript-border">
          <div className="transcript">
            <p className="text-light-400 text-sm">
              Last:{" "}
              <span className="text-white">
                {transcript[transcript.length - 1].content.slice(0, 120)}
                {transcript[transcript.length - 1].content.length > 120
                  ? "..."
                  : ""}
              </span>
            </p>
          </div>
        </div>
      )}

      {/* ── Controls ── */}
      <div className="flex items-center justify-center gap-4 flex-wrap">
        {/* Start button */}
        {isInactive && (
          <button
            onClick={handleStartInterview}
            className="btn-call"
          >
            Start Interview
          </button>
        )}

        {/* Active controls */}
        {isActive && (
          <>
            {/* Done Answering — stops mic recording */}
            {isListening && (
              <button
                onClick={stopListening}
                className="btn-primary"
              >
                ✓ Done Answering
              </button>
            )}

            {/* End interview early */}
            <button
              onClick={handleEndInterview}
              className="btn-disconnect"
            >
              End Interview
            </button>
          </>
        )}

        {/* Saving feedback state */}
        {(isFinished || isSaving) && (
          <div className="flex items-center gap-2 text-light-400">
            <span className="size-4 border-2 border-primary-200/30 border-t-primary-200 rounded-full animate-spin" />
            <span>
              {isSaving ? "Generating feedback..." : "Finishing up..."}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Agent;
