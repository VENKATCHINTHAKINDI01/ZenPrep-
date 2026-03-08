// ─────────────────────────────────────────────
// ZenPrep — Sarvam AI SDK Wrapper
// Replaces lib/vapi.sdk.ts from the original
// Handles: STT (Speech-to-Text) + TTS (Text-to-Speech)
// Sarvam AI docs: https://docs.sarvam.ai
// ─────────────────────────────────────────────

import axios from "axios";

// ── Sarvam AI base URL ──
const SARVAM_BASE_URL = "https://api.sarvam.ai";

// ── Axios instance with auth header pre-configured ──
// Every Sarvam API call needs the API key in the header
const sarvamClient = axios.create({
  baseURL: SARVAM_BASE_URL,
  headers: {
    "api-subscription-key": process.env.SARVAM_API_KEY,
    "Content-Type": "application/json",
  },
});

// ─────────────────────────────────────────────
// TEXT-TO-SPEECH (TTS)
// Converts AI interviewer text → spoken audio
// Model: bulbul:v2 (Sarvam's best Indian voice model)
// ─────────────────────────────────────────────
export async function textToSpeech(
  request: SarvamTTSRequest
): Promise<SarvamTTSResponse> {
  const { text, languageCode, speakerGender = "female" } = request;

  // Sarvam TTS has a 500 char limit per call
  // We chunk longer text automatically
  const chunks = chunkText(text, 500);
  const audioChunks: string[] = [];

  for (const chunk of chunks) {
    const response = await sarvamClient.post("/text-to-speech", {
      inputs: [chunk],
      target_language_code: languageCode,
      speaker: "anushka",        // Sarvam's primary Indian voice
      pitch: 0,                   // 0 = natural pitch
      pace: 1.0,                  // 1.0 = normal speed
      loudness: 1.5,              // slight boost for clarity
      speech_sample_rate: 8000,   // 8kHz — good for voice calls
      enable_preprocessing: true, // handles numbers, dates etc.
      model: "bulbul:v2",         // best Sarvam TTS model
    });

    // Sarvam returns base64 encoded WAV audio
    if (response.data?.audios?.[0]) {
      audioChunks.push(response.data.audios[0]);
    }
  }

  // If multiple chunks, return the first (for short texts this is always 1)
  return {
    audioBase64: audioChunks[0] || "",
    mimeType: "audio/wav",
  };
}

// ─────────────────────────────────────────────
// SPEECH-TO-TEXT (STT)
// Converts user's spoken answer → text transcript
// Model: saarika:v2.5 (Sarvam's multilingual STT model)
// ─────────────────────────────────────────────
export async function speechToText(
  audioBlob: Blob,
  languageCode: SarvamLanguageCode
): Promise<SarvamSTTResponse> {
  // STT requires multipart/form-data (not JSON)
  // because we're sending a binary audio file
  const formData = new FormData();

  // Convert blob to File object with proper name
  const audioFile = new File([audioBlob], "recording.wav", {
    type: "audio/wav",
  });

  formData.append("file", audioFile);
  formData.append("model", "saarika:v2.5");
  formData.append("language_code", languageCode);
  formData.append("with_timestamps", "false");
  formData.append("with_disfluencies", "false"); // remove "uh", "um" etc.

  const response = await axios.post(
    `${SARVAM_BASE_URL}/speech-to-text`,
    formData,
    {
      headers: {
        "api-subscription-key": process.env.SARVAM_API_KEY,
        // Note: DO NOT set Content-Type here
        // axios sets it automatically with correct boundary for FormData
      },
    }
  );

  return {
    transcript: response.data?.transcript || "",
    confidence: response.data?.confidence,
    languageCode,
  };
}

// ─────────────────────────────────────────────
// TRANSLATION
// Translates text between Indian languages
// Used for mixed-language (Hinglish) handling
// ─────────────────────────────────────────────
export async function translateText(
  text: string,
  sourceLanguage: SarvamLanguageCode,
  targetLanguage: SarvamLanguageCode = "en-IN"
): Promise<string> {
  // No translation needed if same language
  if (sourceLanguage === targetLanguage) return text;

  const response = await sarvamClient.post("/translate", {
    input: text,
    source_language_code: sourceLanguage,
    target_language_code: targetLanguage,
    speaker_gender: "Female",
    mode: "formal",
    model: "mayura:v1",           // Sarvam's translation model
    enable_preprocessing: false,
  });

  return response.data?.translated_text || text;
}

// ─────────────────────────────────────────────
// AUDIO UTILITIES
// ─────────────────────────────────────────────

// Convert base64 audio string → playable Audio object in browser
export function base64ToAudio(base64: string): HTMLAudioElement {
  const audio = new Audio(`data:audio/wav;base64,${base64}`);
  return audio;
}

// Play base64 audio and return a promise that resolves when done
export function playAudio(base64: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const audio = base64ToAudio(base64);
    audio.onended = () => resolve();
    audio.onerror = (e) => reject(e);
    audio.play().catch(reject);
  });
}

// ─────────────────────────────────────────────
// MICROPHONE UTILITIES
// ─────────────────────────────────────────────

// Start recording from user's microphone
// Returns MediaRecorder instance + audio chunks array
export async function startRecording(): Promise<{
  mediaRecorder: MediaRecorder;
  audioChunks: Blob[];
}> {
  // Request microphone permission from browser
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: {
      channelCount: 1,        // mono audio (Sarvam requirement)
      sampleRate: 16000,      // 16kHz sample rate
      echoCancellation: true, // reduce echo
      noiseSuppression: true, // reduce background noise
    },
  });

  const audioChunks: Blob[] = [];

  // Use webm/opus if supported, fallback to default
  const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
    ? "audio/webm;codecs=opus"
    : "audio/webm";

  const mediaRecorder = new MediaRecorder(stream, { mimeType });

  // Collect audio data as it becomes available
  mediaRecorder.ondataavailable = (event) => {
    if (event.data.size > 0) {
      audioChunks.push(event.data);
    }
  };

  mediaRecorder.start(100); // collect data every 100ms

  return { mediaRecorder, audioChunks };
}

// Stop recording and return the audio as a single Blob
export function stopRecording(
  mediaRecorder: MediaRecorder,
  audioChunks: Blob[]
): Promise<Blob> {
  return new Promise((resolve) => {
    mediaRecorder.onstop = () => {
      // Merge all audio chunks into one blob
      const audioBlob = new Blob(audioChunks, {
        type: mediaRecorder.mimeType,
      });
      // Stop all microphone tracks (releases mic permission indicator)
      mediaRecorder.stream.getTracks().forEach((track) => track.stop());
      resolve(audioBlob);
    };
    mediaRecorder.stop();
  });
}

// ─────────────────────────────────────────────
// HELPER FUNCTIONS
// ─────────────────────────────────────────────

// Split long text into chunks of maxLength characters
// Tries to split at sentence boundaries (. ! ?)
function chunkText(text: string, maxLength: number): string[] {
  if (text.length <= maxLength) return [text];

  const chunks: string[] = [];
  let remaining = text;

  while (remaining.length > maxLength) {
    // Find last sentence boundary within limit
    const slice = remaining.slice(0, maxLength);
    const lastPeriod = Math.max(
      slice.lastIndexOf(". "),
      slice.lastIndexOf("! "),
      slice.lastIndexOf("? ")
    );

    const cutAt = lastPeriod > 0 ? lastPeriod + 1 : maxLength;
    chunks.push(remaining.slice(0, cutAt).trim());
    remaining = remaining.slice(cutAt).trim();
  }

  if (remaining.length > 0) chunks.push(remaining);
  return chunks;
}