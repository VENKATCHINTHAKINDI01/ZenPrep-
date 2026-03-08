// ─────────────────────────────────────────────
// USER & AUTH TYPES
// ─────────────────────────────────────────────

interface User {
    name: string;
    email: string;
    id: string;
    preferredLanguage?: string; // e.g. "hindi", "tamil"
  }
  
  interface SignInParams {
    email: string;
    idToken: string;
  }
  
  interface SignUpParams {
    uid: string;
    name: string;
    email: string;
    password: string;
  }
  
  type FormType = "sign-in" | "sign-up";
  
  // ─────────────────────────────────────────────
  // INTERVIEW TYPES
  // ─────────────────────────────────────────────
  
  interface Interview {
    id: string;
    role: string;
    level: string;
    questions: string[];
    techstack: string[];
    createdAt: string;
    userId: string;
    type: string;
    finalized: boolean;
    language?: string;   // NEW: e.g. "hindi", "tamil", "english"
    domain?: string;     // NEW: e.g. "ai-ml", "fullstack-java", "finance"
    coverImage?: string;
  }
  
  interface InterviewCardProps {
    interviewId?: string;
    userId?: string;
    role: string;
    type: string;
    techstack: string[];
    createdAt?: string;
    language?: string;   // NEW: show language badge on card
    domain?: string;     // NEW: show domain badge on card
  }
  
  interface InterviewFormProps {
    interviewId: string;
    role: string;
    level: string;
    type: string;
    techstack: string[];
    amount: number;
  }
  
  interface GetLatestInterviewsParams {
    userId: string;
    limit?: number;
    language?: string;  // NEW: filter by language
    domain?: string;    // NEW: filter by domain
  }
  
  // ─────────────────────────────────────────────
  // FEEDBACK & RESOURCES TYPES
  // ─────────────────────────────────────────────
  
  interface UpskillResource {
    topic: string;       // e.g. "System Design"
    title: string;       // e.g. "System Design Primer"
    url: string;         // direct link
    platform: string;    // "YouTube" | "Coursera" | "Udemy" | "Docs" | "LeetCode" | "HackerRank" | "Blog"
    type: "free" | "paid";
    difficulty: "Beginner" | "Intermediate" | "Advanced";
    description?: string; // short one-liner about the resource
  }
  
  interface Feedback {
    id: string;
    interviewId: string;
    userId: string;
    totalScore: number;
    categoryScores: Array<{
      name: string;
      score: number;
      comment: string;
    }>;
    strengths: string[];
    areasForImprovement: string[];
    finalAssessment: string;
    createdAt: string;
    upskillResources?: UpskillResource[]; // NEW: AI-curated resources
    languageUsed?: string;                // NEW: language interview was in
  }
  
  interface CreateFeedbackParams {
    interviewId: string;
    userId: string;
    transcript: { role: string; content: string }[];
    feedbackId?: string;
    language?: string;   // NEW: pass interview language
  }
  
  interface GetFeedbackByInterviewIdParams {
    interviewId: string;
    userId: string;
  }
  
  // ─────────────────────────────────────────────
  // AGENT / COMPONENT TYPES
  // ─────────────────────────────────────────────
  
  interface AgentProps {
    userName: string;
    userId?: string;
    interviewId?: string;
    feedbackId?: string;
    type: "generate" | "interview";
    questions?: string[];
    language?: string;   // NEW: selected interview language
    domain?: string;     // NEW: selected domain
    profileImage?: string;
  }
  
  interface TechIconProps {
    techStack: string[];
  }
  
  // ─────────────────────────────────────────────
  // SARVAM AI TYPES (replaces vapi.d.ts)
  // ─────────────────────────────────────────────
  
  type SarvamLanguageCode =
    | "hi-IN"   // Hindi
    | "ta-IN"   // Tamil
    | "te-IN"   // Telugu
    | "bn-IN"   // Bengali
    | "kn-IN"   // Kannada
    | "ml-IN"   // Malayalam
    | "mr-IN"   // Marathi
    | "gu-IN"   // Gujarati
    | "pa-IN"   // Punjabi
    | "or-IN"   // Odia
    | "en-IN";  // English (Indian accent)
  
  interface SarvamSTTRequest {
    audioBlob: Blob;
    languageCode: SarvamLanguageCode;
  }
  
  interface SarvamSTTResponse {
    transcript: string;
    confidence?: number;
    languageCode: SarvamLanguageCode;
  }
  
  interface SarvamTTSRequest {
    text: string;
    languageCode: SarvamLanguageCode;
    speakerGender?: "male" | "female";
  }
  
  interface SarvamTTSResponse {
    audioBase64: string;
    mimeType: string;
  }
  
  // ─────────────────────────────────────────────
  // ROUTE TYPES
  // ─────────────────────────────────────────────
  
  interface RouteParams {
    params: Promise<Record<string, string>>;
    searchParams: Promise<Record<string, string>>;
  }
  
  // ─────────────────────────────────────────────
  // LANGUAGE & DOMAIN CONFIG TYPES
  // ─────────────────────────────────────────────
  
  interface LanguageOption {
    code: SarvamLanguageCode;
    name: string;          // English name: "Hindi"
    nativeName: string;    // Native: "हिन्दी"
    flag: string;          // emoji flag
  }
  
  interface DomainOption {
    id: string;            // "ai-ml"
    label: string;         // "AI / Machine Learning"
    icon: string;          // emoji
    techstack: string[];   // default tech suggestions
  }