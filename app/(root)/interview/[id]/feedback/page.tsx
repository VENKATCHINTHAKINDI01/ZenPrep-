import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import ResourceCard from "@/components/ResourceCard";
import ScoreChart from "@/components/ScoreChart";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { getLanguageName } from "@/constants/languages";
import {
  getFeedbackByInterviewId,
  getInterviewById,
} from "@/lib/actions/general.action";

const FeedbackPage = async ({ params }: RouteParams) => {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user?.id) redirect("/sign-in");

  const interview = await getInterviewById(id);
  if (!interview) redirect("/");

  const feedback = await getFeedbackByInterviewId({
    interviewId: id,
    userId: user?.id!,
  });
  if (!feedback) redirect("/");

  const languageName = getLanguageName(
    feedback.languageUsed || interview.language || "en-IN"
  );

  // Score color thresholds
  const scoreColor =
    feedback.totalScore >= 75
      ? "text-success-100"
      : feedback.totalScore >= 50
        ? "text-yellow-400"
        : "text-destructive-100";

  // Group upskill resources by topic for cleaner display
  const resourcesByTopic = (feedback.upskillResources || []).reduce(
    (acc, resource) => {
      if (!acc[resource.topic]) acc[resource.topic] = [];
      acc[resource.topic].push(resource);
      return acc;
    },
    {} as Record<string, UpskillResource[]>
  );

  return (
    <section className="section-feedback">
      {/* ── Header ── */}
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-4xl font-semibold">
          Interview Feedback —{" "}
          <span className="capitalize text-primary-200">{interview.role}</span>
        </h1>
        <p className="text-light-400 text-base">
          Here&apos;s your detailed performance breakdown
        </p>
      </div>

      {/* ── Score Summary Row ── */}
      <div className="flex flex-row flex-wrap justify-center gap-6">
        {/* Overall Score */}
        <div className="flex items-center gap-2">
          <Image src="/star.svg" width={22} height={22} alt="score" />
          <p>
            Overall Score:{" "}
            <span className={`font-bold text-xl ${scoreColor}`}>
              {feedback.totalScore}
            </span>
            <span className="text-light-400">/100</span>
          </p>
        </div>

        {/* Date */}
        <div className="flex items-center gap-2">
          <Image src="/calendar.svg" width={22} height={22} alt="date" />
          <p className="text-light-400">
            {dayjs(feedback.createdAt).format("MMM D, YYYY h:mm A")}
          </p>
        </div>

        {/* Language badge */}
        <div className="language-badge">
          🇮🇳 {languageName}
        </div>
      </div>

      <hr className="border-border" />

      {/* ── Final Assessment ── */}
      <div className="flex flex-col gap-3">
        <h2>Overall Assessment</h2>
        <p className="text-light-100 leading-relaxed">
          {feedback.finalAssessment}
        </p>
      </div>

      {/* ── Radar Chart + Category Scores ── */}
      <div className="flex flex-col gap-6">
        <h2>Performance Breakdown</h2>

        {/* Radar chart — visual overview */}
        <div className="card-border w-full">
          <div className="card p-6">
            <ScoreChart categoryScores={feedback.categoryScores} />
          </div>
        </div>

        {/* Detailed category cards */}
        <div className="flex flex-col gap-4">
          {feedback.categoryScores?.map((category, index) => {
            const catColor =
              category.score >= 75
                ? "text-success-100"
                : category.score >= 50
                  ? "text-yellow-400"
                  : "text-destructive-100";

            const barWidth = `${category.score}%`;

            return (
              <div key={index} className="card-border">
                <div className="card p-5 flex flex-col gap-3">
                  {/* Category name + score */}
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-white">
                      {index + 1}. {category.name}
                    </p>
                    <span className={`font-bold text-lg ${catColor}`}>
                      {category.score}/100
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-1.5 bg-dark-300 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary-200 rounded-full transition-all duration-500"
                      style={{ width: barWidth }}
                    />
                  </div>

                  {/* Comment */}
                  <p className="text-light-100 text-sm leading-relaxed">
                    {category.comment}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Strengths ── */}
      <div className="flex flex-col gap-3">
        <h2 className="text-success-100">✅ Strengths</h2>
        <ul className="flex flex-col gap-2">
          {feedback.strengths?.map((strength, index) => (
            <li key={index} className="flex items-start gap-2 text-light-100">
              <span className="text-success-100 mt-1">•</span>
              {strength}
            </li>
          ))}
        </ul>
      </div>

      {/* ── Areas for Improvement ── */}
      <div className="flex flex-col gap-3">
        <h2 className="text-destructive-100">📈 Areas for Improvement</h2>
        <ul className="flex flex-col gap-2">
          {feedback.areasForImprovement?.map((area, index) => (
            <li key={index} className="flex items-start gap-2 text-light-100">
              <span className="text-destructive-100 mt-1">•</span>
              {area}
            </li>
          ))}
        </ul>
      </div>

      {/* ── Upskilling Resources (NEW) ── */}
      {feedback.upskillResources && feedback.upskillResources.length > 0 && (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <h2>🚀 Recommended Learning Resources</h2>
            <p className="text-light-400 text-base">
              Curated by AI based on your weak areas. Focus on these to
              improve your score next time.
            </p>
          </div>

          {/* Resources grouped by topic */}
          {Object.entries(resourcesByTopic).map(([topic, resources]) => (
            <div key={topic} className="flex flex-col gap-3">
              {/* Topic header */}
              <div className="flex items-center gap-2">
                <div className="h-px flex-1 bg-border" />
                <span className="text-sm font-semibold text-primary-200 px-3">
                  {topic}
                </span>
                <div className="h-px flex-1 bg-border" />
              </div>

              {/* Resource cards grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {resources.map((resource, idx) => (
                  <ResourceCard key={idx} resource={resource} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <hr className="border-border" />

      {/* ── Action Buttons ── */}
      <div className="buttons">
        <Button className="btn-secondary flex-1" asChild>
          <Link href="/">← Back to Dashboard</Link>
        </Button>

        <Button className="btn-primary flex-1" asChild>
          <Link href={`/interview/${id}`}>🔄 Retake Interview</Link>
        </Button>
      </div>
    </section>
  );
};

export default FeedbackPage;
