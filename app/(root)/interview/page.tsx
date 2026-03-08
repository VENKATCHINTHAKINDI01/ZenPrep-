import { redirect } from "next/navigation";
import Agent from "@/components/Agent";
import { getCurrentUser } from "@/lib/actions/auth.action";

const InterviewPage = async () => {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  return (
    <section className="flex flex-col gap-8 max-w-3xl mx-auto w-full">
      <div className="flex flex-col gap-2">
        <h1>Create New Interview</h1>
        <p className="text-light-400">
          Configure your interview settings below and let AI generate
          personalized questions for you.
        </p>
      </div>

      <Agent
        type="generate"
        userName={user.name}
        userId={user.id}
        language={user.preferredLanguage || "en-IN"}
        domain="technical"
        profileImage={user.profileURL}
      />
    </section>
  );
};

export default InterviewPage;
