import Image from "next/image";
import { redirect } from "next/navigation";

import Agent from "@/components/Agent";
import DisplayTechIcons from "@/components/DisplayTechIcons";
import { getRandomInterviewCover } from "@/lib/utils";
import { getLanguageName } from "@/constants/languages";
import {
  getFeedbackByInterviewId,
  getInterviewById,
} from "@/lib/actions/general.action";
import { getCurrentUser } from "@/lib/actions/auth.action";

const InterviewSessionPage = async ({ params }: RouteParams) => {
  const { id } = await params;
  const user = await getCurrentUser();

  // Fetch the interview document
  const interview = await getInterviewById(id);
  if (!interview) redirect("/");

  // Check if feedback already exists (for retake scenario)
  const feedback = await getFeedbackByInterviewId({
    interviewId: id,
    userId: user?.id!,
  });

  const languageName = getLanguageName(interview.language || "en-IN");

  return (
    <div className="flex flex-col gap-6">
      {/* ── Interview Header ── */}
      <div className="flex flex-row gap-4 justify-between items-start">
        <div className="flex flex-row gap-4 items-center max-sm:flex-col max-sm:items-start">
          {/* Cover image + role */}
          <div className="flex flex-row gap-3 items-center">
            <Image
              src={getRandomInterviewCover()}
              alt="cover"
              width={44}
              height={44}
              className="rounded-full object-cover size-[44px]"
            />
            <h3 className="capitalize">{interview.role} Interview</h3>
          </div>

          <DisplayTechIcons techStack={interview.techstack} />
        </div>

        {/* Right side badges */}
        <div className="flex flex-col items-end gap-2">
          <span className="bg-dark-200 px-4 py-2 rounded-lg text-sm font-medium">
            {interview.type}
          </span>
          {/* Language badge — NEW */}
          <span className="language-badge">
            🇮🇳 {languageName}
          </span>
        </div>
      </div>

      {/* ── Interview Agent ── */}
      <Agent
        userName={user?.name!}
        userId={user?.id}
        interviewId={id}
        type="interview"
        questions={interview.questions}
        feedbackId={feedback?.id}
        language={(interview.language as SarvamLanguageCode) || "en-IN"}
        domain={interview.domain}
      />
    </div>
  );
};

export default InterviewSessionPage;
