"use server";

import { generateText } from "ai";
import { createGroq } from "@ai-sdk/groq";
import { db } from "@/firebase/admin";
import { feedbackSchema } from "@/constants";
import { getLanguageName } from "@/constants/languages";

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function createFeedback(params: CreateFeedbackParams) {
  const { interviewId, userId, transcript, feedbackId, language } = params;

  try {
    const formattedTranscript = transcript
      .map((entry) => `${entry.role === "assistant" ? "Interviewer" : "Candidate"}: ${entry.content}`)
      .join("\n");

    const languageName = getLanguageName(language || "en-IN");

    const { text } = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      prompt: `You are an expert interview coach. Analyze this interview transcript and provide detailed feedback.

Interview Language: ${languageName}
Transcript:
${formattedTranscript}

Return ONLY a valid JSON object with this exact structure, no other text:
{
  "totalScore": <number 0-100>,
  "categoryScores": [
    {"name": "Communication Skills", "score": <number>, "comment": "<string>"},
    {"name": "Technical Knowledge", "score": <number>, "comment": "<string>"},
    {"name": "Problem Solving", "score": <number>, "comment": "<string>"},
    {"name": "Cultural Fit", "score": <number>, "comment": "<string>"},
    {"name": "Confidence and Clarity", "score": <number>, "comment": "<string>"},
    {"name": "Depth of Knowledge", "score": <number>, "comment": "<string>"}
  ],
  "strengths": ["<string>", "<string>", "<string>"],
  "areasForImprovement": ["<string>", "<string>", "<string>"],
  "finalAssessment": "<string>",
  "upskillResources": [
    {
      "topic": "<weak area topic>",
      "title": "<resource title>",
      "url": "<real url>",
      "platform": "<YouTube|Coursera|Udemy|Docs|LeetCode>",
      "type": "<free|paid>",
      "difficulty": "<Beginner|Intermediate|Advanced>",
      "description": "<one line description>"
    }
  ]
}`,
    });

    // Parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found in response");
    const feedback = feedbackSchema.parse(JSON.parse(jsonMatch[0]));

    const totalScore = Math.round(
      feedback.categoryScores.reduce((sum, cat) => sum + cat.score, 0) /
        feedback.categoryScores.length
    );

    const feedbackData = {
      interviewId,
      userId,
      totalScore,
      categoryScores: feedback.categoryScores,
      strengths: feedback.strengths,
      areasForImprovement: feedback.areasForImprovement,
      finalAssessment: feedback.finalAssessment,
      upskillResources: feedback.upskillResources || [],
      languageUsed: language || "en-IN",
      createdAt: new Date().toISOString(),
    };

    let feedbackRef;
    if (feedbackId) {
      feedbackRef = db.collection("feedback").doc(feedbackId);
      await feedbackRef.set(feedbackData);
    } else {
      feedbackRef = await db.collection("feedback").add(feedbackData);
    }

    return { success: true, feedbackId: feedbackRef.id };
  } catch (error) {
    console.error("Feedback generation error:", error);
    return { success: false };
  }
}

export async function getInterviewById(id: string) {
  try {
    const interview = await db.collection("interviews").doc(id).get();
    if (!interview.exists) return null;
    return { id: interview.id, ...interview.data() } as Interview;
  } catch (error) {
    console.error("Error fetching interview:", error);
    return null;
  }
}

export async function getFeedbackByInterviewId(params: GetFeedbackByInterviewIdParams) {
  const { interviewId, userId } = params;
  try {
    const feedback = await db
      .collection("feedback")
      .where("interviewId", "==", interviewId)
      .where("userId", "==", userId)
      .limit(1)
      .get();
    if (feedback.empty) return null;
    const doc = feedback.docs[0];
    return { id: doc.id, ...doc.data() } as Feedback;
  } catch (error) {
    console.error("Error fetching feedback:", error);
    return null;
  }
}

export async function getLatestInterviews(params: GetLatestInterviewsParams) {
  const { userId, limit = 20 } = params;
  try {
    const interviews = await db
      .collection("interviews")
      .where("finalized", "==", true)
      .where("userId", "!=", userId)
      .orderBy("userId")
      .orderBy("createdAt", "desc")
      .limit(limit)
      .get();
    return interviews.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Interview[];
  } catch (error) {
    console.error("Error fetching latest interviews:", error);
    return [];
  }
}

export async function getInterviewsByUserId(userId: string) {
  try {
    const interviews = await db
      .collection("interviews")
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .get();
    return interviews.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Interview[];
  } catch (error) {
    console.error("Error fetching user interviews:", error);
    return [];
  }
}

export async function getFeedbackByUserId(userId: string) {
  try {
    const querySnapshot = await db
      .collection("feedback")
      .where("userId", "==", userId)
      .orderBy("createdAt", "asc")
      .get();
    if (querySnapshot.empty) return null;
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Feedback[];
  } catch (error) {
    console.error("Error fetching feedback:", error);
    return null;
  }
}

export async function getUserInterviewStats(userId: string) {
  try {
    const [interviews, feedbackList] = await Promise.all([
      getInterviewsByUserId(userId),
      getFeedbackByUserId(userId),
    ]);

    if (!interviews?.length) return null;

    const totalInterviews = interviews.length;
    const scores = feedbackList?.map((f) => f.totalScore) || [];
    const averageScore = scores.length
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : 0;
    const bestScore = scores.length ? Math.max(...scores) : 0;

    const domainCount = interviews.reduce((acc, interview) => {
      const domain = interview.domain || "technical";
      acc[domain] = (acc[domain] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostPracticedDomain = Object.entries(domainCount).sort(
      (a, b) => b[1] - a[1]
    )[0]?.[0] || "technical";

    return { totalInterviews, averageScore, bestScore, mostPracticedDomain };
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return null;
  }
}
