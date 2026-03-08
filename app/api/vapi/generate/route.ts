import { generateText } from "ai";
import { createGroq } from "@ai-sdk/groq";
import { NextRequest, NextResponse } from "next/server";
import { getLanguageName } from "@/constants/languages";
import { db } from "@/firebase/admin";

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { type, role, level, techstack, amount, userid, language, domain } =
      await request.json();

    const languageName = getLanguageName(language);

    const { text: questions } = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      prompt: `You are preparing questions for a job interview to be conducted via voice in ${languageName}.
Generate exactly ${amount} interview questions for a ${level} ${role} position.
Focus: ${type} interview covering ${techstack}.
Domain: ${domain}

Rules:
- Questions must be clear and suitable for voice conversation
- No abbreviations, symbols, or special characters
- Each question on a new line
- No numbering, bullets, or prefixes
- Questions should be appropriate for ${level} level
- If the language is not English, write questions in ${languageName}

Return ONLY the questions, one per line, nothing else.`,
    });

    const questionList = questions
      .split("\n")
      .map((q: string) => q.trim())
      .filter((q: string) => q.length > 10)
      .slice(0, amount);

    const interviewRef = await db.collection("interviews").add({
      role,
      type,
      level,
      techstack: techstack.split(",").map((t: string) => t.trim()),
      questions: questionList,
      userId: userid,
      finalized: true,
      createdAt: new Date().toISOString(),
      language: language || "en-IN",
      domain: domain || "technical",
    });

    return NextResponse.json({ success: true, interviewId: interviewRef.id });
  } catch (error) {
    console.error("Question generation error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
