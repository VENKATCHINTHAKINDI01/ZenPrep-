import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import InterviewCard from "@/components/InterviewCard";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { redirect } from "next/navigation";
import {
  getInterviewsByUserId,
  getLatestInterviews,
  getUserInterviewStats,
} from "@/lib/actions/general.action";

const Dashboard = async () => {
  const user = await getCurrentUser();
  if (!user?.id) redirect("/sign-in");

  const [userInterviews, allInterviews, stats] = await Promise.all([
    getInterviewsByUserId(user.id),
    getLatestInterviews({ userId: user.id }),
    getUserInterviewStats(user.id),
  ]);

  const hasPastInterviews = (userInterviews?.length ?? 0) > 0;
  const hasAvailableInterviews = (allInterviews?.length ?? 0) > 0;

  return (
    <>
      <section className="card-cta">
        <div className="flex flex-col gap-6 max-w-lg">
          <h2>
            Prepare Calmly.{" "}
            <span className="text-primary-200">Perform Confidently.</span>
          </h2>
          <p className="text-light-100 text-lg">
            Practice interviews in your language — Hindi, Tamil, Telugu, and
            more Indian languages. Get AI-powered feedback and curated
            learning resources.
          </p>
          <Button asChild className="btn-primary max-sm:w-full">
            <Link href="/interview">✨ Start New Interview</Link>
          </Button>
        </div>
        <Image
          src="/robot.png"
          alt="ZenPrep AI"
          width={380}
          height={380}
          className="max-sm:hidden"
        />
      </section>

      {stats && (
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card-border">
            <div className="card p-5 flex flex-col gap-1">
              <p className="text-light-600 text-xs font-medium uppercase tracking-wide">Total Interviews</p>
              <p className="text-3xl font-bold text-white">{stats.totalInterviews}</p>
            </div>
          </div>
          <div className="card-border">
            <div className="card p-5 flex flex-col gap-1">
              <p className="text-light-600 text-xs font-medium uppercase tracking-wide">Avg Score</p>
              <p className="text-3xl font-bold text-primary-200">{stats.averageScore}<span className="text-lg text-light-400">/100</span></p>
            </div>
          </div>
          <div className="card-border">
            <div className="card p-5 flex flex-col gap-1">
              <p className="text-light-600 text-xs font-medium uppercase tracking-wide">Best Score</p>
              <p className="text-3xl font-bold text-success-100">{stats.bestScore}<span className="text-lg text-light-400">/100</span></p>
            </div>
          </div>
          <div className="card-border">
            <div className="card p-5 flex flex-col gap-1">
              <p className="text-light-600 text-xs font-medium uppercase tracking-wide">Top Domain</p>
              <p className="text-xl font-bold text-white capitalize">{stats.mostPracticedDomain.replace("-", " ")}</p>
            </div>
          </div>
        </section>
      )}

      <section className="flex flex-col gap-6">
        <h2>Your Interviews</h2>
        <div className="interviews-section">
          {hasPastInterviews ? (
            userInterviews?.map((interview) => (
              <InterviewCard
                key={interview.id}
                userId={user.id}
                interviewId={interview.id}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                createdAt={interview.createdAt}
                language={interview.language}
                domain={interview.domain}
              />
            ))
          ) : (
            <div className="flex flex-col items-center gap-4 py-12 text-center">
              <p className="text-light-400 text-lg">You haven&apos;t taken any interviews yet.</p>
              <Button asChild className="btn-primary">
                <Link href="/interview">Take Your First Interview</Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <h2>Available Interviews</h2>
        <div className="interviews-section">
          {hasAvailableInterviews ? (
            allInterviews?.map((interview) => (
              <InterviewCard
                key={interview.id}
                userId={user.id}
                interviewId={interview.id}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                createdAt={interview.createdAt}
                language={interview.language}
                domain={interview.domain}
              />
            ))
          ) : (
            <p className="text-light-400">No interviews available right now. Create one above!</p>
          )}
        </div>
      </section>
    </>
  );
};

export default Dashboard;
