import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import DisplayTechIcons from "@/components/DisplayTechIcons";
import { getFeedbackByInterviewId } from "@/lib/actions/general.action";
import { getRandomInterviewCover } from "@/lib/utils";
import { getLanguageName } from "@/constants/languages";
import { cn } from "@/lib/utils";

const InterviewCard = async ({
  interviewId, userId, role, type, techstack, createdAt, language, domain,
}: InterviewCardProps) => {
  const feedback = userId && interviewId
    ? await getFeedbackByInterviewId({ interviewId, userId })
    : null;

  const score = feedback?.totalScore ?? null;
  const scoreColor = score === null ? "text-light-400"
    : score >= 75 ? "text-success-100"
    : score >= 50 ? "text-yellow-400"
    : "text-destructive-100";

  const langName = getLanguageName(language || "en-IN");
  const cover = getRandomInterviewCover();

  return (
    <div className="card-border w-full max-w-sm">
      <div className="card-interview">
        <div>
          <div className="absolute top-0 right-0 w-fit px-4 py-2 rounded-bl-lg bg-dark-300">
            <p className="badge-text capitalize">{type}</p>
          </div>
          <Image src={cover} alt="cover" width={90} height={90} className="rounded-full object-fit size-[90px]" />
          <div className="mt-5 flex flex-col gap-2">
            <h3 className="capitalize">{role}</h3>
            <div className="flex flex-row gap-3 items-center">
              <div className="flex flex-row gap-2 items-center">
                <Image src="/calendar.svg" width={22} height={22} alt="date" />
                <p>{dayjs(createdAt).format("MMM D, YYYY")}</p>
              </div>
              <div className="flex flex-row gap-2 items-center">
                <Image src="/star.svg" width={22} height={22} alt="score" />
                <p className={cn("font-bold", scoreColor)}>
                  {score !== null ? `${score}/100` : "---"}
                </p>
              </div>
            </div>
            {language && (
              <span className="language-badge w-fit">
                🇮�� {langName}
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-row justify-between items-center">
          <DisplayTechIcons techstack={techstack} />
          <Button asChild className="btn-primary">
            <Link href={feedback
              ? `/interview/${interviewId}/feedback`
              : `/interview/${interviewId}`}>
              {feedback ? "View Feedback" : "Start Interview"}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InterviewCard;
