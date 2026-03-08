import { z } from "zod";
export * from "./languages";
export * from "./domains";

export const mappings: Record<string, string> = {
  "react.js": "react", reactjs: "react", react: "react",
  "next.js": "nextjs", nextjs: "nextjs", next: "nextjs",
  "vue.js": "vuejs", vuejs: "vuejs", vue: "vuejs",
  "express.js": "express", expressjs: "express", express: "express",
  "node.js": "nodejs", nodejs: "nodejs", node: "nodejs",
  "angular.js": "angular", angularjs: "angular", angular: "angular",
  nestjs: "nestjs", nuxt: "nuxt", "nuxt.js": "nuxt",
  typescript: "typescript", ts: "typescript",
  javascript: "javascript", js: "javascript",
  python: "python", java: "java", go: "go", rust: "rust",
  kotlin: "kotlin", swift: "swift", php: "php", ruby: "ruby",
  mongodb: "mongodb", mongo: "mongodb", mysql: "mysql",
  postgresql: "postgresql", postgres: "postgresql",
  sqlite: "sqlite", redis: "redis", firebase: "firebase", prisma: "prisma",
  docker: "docker", kubernetes: "kubernetes", aws: "aws",
  azure: "azure", gcp: "gcp", vercel: "vercel",
  html5: "html5", html: "html5", css3: "css3", css: "css3",
  sass: "sass", tailwindcss: "tailwindcss", tailwind: "tailwindcss",
  bootstrap: "bootstrap", jquery: "jquery",
  git: "git", github: "github", gitlab: "gitlab",
  jest: "jest", cypress: "cypress", graphql: "graphql",
  redux: "redux", figma: "figma", webpack: "webpack",
  tensorflow: "tensorflow", pytorch: "pytorch", pandas: "pandas",
};

export const INTERVIEWER_CONFIG = {
  name: "ZenPrep AI Interviewer",
  firstMessage: {
    "en-IN": "Hello! Welcome to your ZenPrep interview. I am your AI interviewer today. Let us begin when you are ready.",
    "hi-IN": "नमस्ते! ZenPrep इंटरव्यू में आपका स्वागत है। मैं आज आपका AI इंटरव्यूअर हूं। जब आप तैयार हों तो हम शुरू करें।",
    "ta-IN": "வணக்கம்! ZenPrep நேர்காணலுக்கு வரவேற்கிறோம். நான் இன்று உங்கள் AI நேர்காணலாளர்.",
    "te-IN": "నమస్కారం! ZenPrep ఇంటర్వ్యూకి స్వాగతం. నేను ఈరోజు మీ AI ఇంటర్వ్యూవర్.",
    "bn-IN": "নমস্কার! ZenPrep সাক্ষাৎকারে আপনাকে স্বাগতম। আমি আজ আপনার AI সাক্ষাৎকারকারী।",
    "kn-IN": "ನಮಸ್ಕಾರ! ZenPrep ಸಂದರ್ಶನಕ್ಕೆ ಸ್ವಾಗತ. ನಾನು ಇಂದು ನಿಮ್ಮ AI ಸಂದರ್ಶಕ.",
    "ml-IN": "നമസ്കാരം! ZenPrep ഇന്റർവ്യൂവിലേക്ക് സ്വാഗതം. ഞാൻ ഇന്ന് നിങ്ങളുടെ AI ഇന്റർവ്യൂവർ ആണ്.",
    "mr-IN": "नमस्कार! ZenPrep मुलाखतीमध्ये आपले स्वागत आहे. मी आज तुमचा AI मुलाखतकार आहे.",
    "gu-IN": "નમસ્તે! ZenPrep ઇન્ટરવ્યૂમાં આપનું સ્વાગત છે. હું આજે આપનો AI ઇન્ટરવ્યૂઅર છું.",
    "pa-IN": "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ZenPrep ਇੰਟਰਵਿਊ ਵਿੱਚ ਤੁਹਾਡਾ ਸੁਆਗਤ ਹੈ। ਮੈਂ ਅੱਜ ਤੁਹਾਡਾ AI ਇੰਟਰਵਿਊਅਰ ਹਾਂ।",
    "or-IN": "ନମସ୍କାର! ZenPrep ସାକ୍ଷାତ୍କାରରେ ଆପଣଙ୍କୁ ସ୍ୱାଗତ। ମୁଁ ଆଜି ଆପଣଙ୍କ AI ସାକ୍ଷାତ୍କାରକ।",
  },
  systemPrompt: `You are a professional AI job interviewer for ZenPrep conducting a real-time voice interview.
Follow the structured question flow: {{questions}}
Ask one question at a time. Keep responses short and conversational.
Be professional, warm, and encouraging.
Conduct the interview in the same language the candidate speaks.
When all questions are done, thank the candidate and close the interview politely.`,
};

export const feedbackSchema = z.object({
  totalScore: z.number().min(0).max(100),
  categoryScores: z.tuple([
    z.object({ name: z.literal("Communication Skills"), score: z.number().min(0).max(100), comment: z.string() }),
    z.object({ name: z.literal("Technical Knowledge"), score: z.number().min(0).max(100), comment: z.string() }),
    z.object({ name: z.literal("Problem Solving"), score: z.number().min(0).max(100), comment: z.string() }),
    z.object({ name: z.literal("Cultural Fit"), score: z.number().min(0).max(100), comment: z.string() }),
    z.object({ name: z.literal("Confidence and Clarity"), score: z.number().min(0).max(100), comment: z.string() }),
    z.object({ name: z.literal("Depth of Knowledge"), score: z.number().min(0).max(100), comment: z.string() }),
  ]),
  strengths: z.array(z.string()),
  areasForImprovement: z.array(z.string()),
  finalAssessment: z.string(),
  upskillResources: z.array(z.object({
    topic: z.string(),
    title: z.string(),
    url: z.string(),
    platform: z.string(),
    type: z.enum(["free", "paid"]),
    difficulty: z.enum(["Beginner", "Intermediate", "Advanced"]),
    description: z.string().optional(),
  })),
});

export const interviewCovers = [
  "/adobe.png", "/amazon.png", "/facebook.png", "/hostinger.png",
  "/pinterest.png", "/quora.png", "/reddit.png", "/skype.png",
  "/spotify.png", "/telegram.png", "/tiktok.png", "/yahoo.png",
];

export const dummyInterviews: Interview[] = [
  {
    id: "1", userId: "user1", role: "Frontend Developer",
    type: "Technical", techstack: ["React", "TypeScript", "Next.js"],
    level: "Junior", questions: ["What is React?"],
    finalized: true, createdAt: "2024-03-15T10:00:00Z",
    language: "en-IN", domain: "fullstack",
  },
];
