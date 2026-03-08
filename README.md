ZenPrep
Prepare Calmly. Perform Confidently.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
AI-Powered Multilingual Mock Interview Platform
Complete Technical Documentation & Developer Guide
  Framework: Next.js 16  |  Language: TypeScript  |  Version: 1.0.0  


1. Project Overview
ZenPrep is an AI-powered multilingual mock interview platform built specifically for Indian job seekers. It enables candidates to practice job interviews in their native Indian language using real-time voice interaction, and receive detailed AI-generated feedback with personalized upskilling resources.

🎯  Key Differentiator: ZenPrep is the only open-source interview prep platform supporting 11 Indian languages with voice-based AI interaction and structured feedback.

1.1 What Makes ZenPrep Different
Feature	Traditional Platforms	ZenPrep
Language Support	English only	11 Indian languages
Interview Mode	Text-based	Voice + Text (AI-powered)
Feedback Engine	Generic tips	6-dimension AI scoring
Upskilling Resources	Not provided	AI-curated per weak area
Voice Engine	None	Sarvam AI (Indian voices)
Score Visualization	Simple score	Radar chart breakdown
Domain Coverage	Generic	11 specialized domains
Dashboard Stats	None	Avg score, trends, top domain

1.2 Supported Indian Languages
Language	Code	Native Script	Voice Model
English (India)	en-IN	English	bulbul:v2
Hindi	hi-IN	हिन्दी	bulbul:v2
Tamil	ta-IN	தமிழ்	bulbul:v2
Telugu	te-IN	తెలుగు	bulbul:v2
Bengali	bn-IN	বাংলা	bulbul:v2
Kannada	kn-IN	ಕನ್ನಡ	bulbul:v2
Malayalam	ml-IN	മലയാളം	bulbul:v2
Marathi	mr-IN	मराठी	bulbul:v2
Gujarati	gu-IN	ગુજરાતી	bulbul:v2
Punjabi	pa-IN	ਪੰਜਾਬੀ	bulbul:v2
Odia	or-IN	ଓଡ଼ିଆ	bulbul:v2



2. Technology Stack
2.1 Core Framework & Language
Technology	Version	Role	Why Chosen
Next.js	16.1.6	Full-stack React framework	App Router, Server Actions, API Routes, Turbopack
TypeScript	5.x	Type-safe JavaScript	Compile-time safety, better DX, interface contracts
React	19.x	UI component library	Hooks, Suspense, Server Components
Node.js	24.x	JavaScript runtime	Required by Next.js, async I/O for API calls

2.2 Styling
Library	Purpose	Key Classes Used
Tailwind CSS v4	Utility-first CSS framework	Dark mode, responsive grid, animations
tailwind-merge	Merge conflicting Tailwind classes	Used in cn() utility function
clsx	Conditional class names	Dynamic class binding in components
class-variance-authority	Component variant system	Button variants (primary, secondary, ghost)
tailwindcss-animate	Animation utilities	Card entrance, pulse, spin animations

2.3 AI & Voice Services
Service	SDK	Model	Purpose
Groq AI	@ai-sdk/groq	llama-3.3-70b-versatile	Interview question generation
Groq AI	@ai-sdk/groq	llama-3.3-70b-versatile	Feedback analysis (JSON parsing)
Sarvam AI	axios (REST)	bulbul:v2	Text-to-Speech (AI speaks questions)
Sarvam AI	axios (REST)	saarika:v2.5	Speech-to-Text (user's answers)
Vercel AI SDK	ai	—	Unified AI interface, generateText()

2.4 Backend & Database
Technology	Package	Purpose
Firebase Auth	firebase, firebase-admin	User authentication (email/password)
Firestore	firebase-admin	NoSQL database — interviews, feedback, users
Next.js Server Actions	Built-in	Server-side data mutations without API routes
Next.js API Routes	Built-in	Voice API proxy routes (TTS, STT, generate)
HTTP Cookies	next/headers	Session management (7-day httpOnly cookies)

2.5 Frontend Libraries
Library	Version	Purpose
Recharts	2.12.0	Radar chart for 6-category score visualization
React Hook Form	7.54.2	Form state management (sign in/sign up)
Zod	3.24.2	Schema validation (feedback schema, form validation)
@hookform/resolvers	4.1.3	Bridge between React Hook Form and Zod
Sonner	2.0.1	Toast notifications (success, error feedback)
dayjs	1.11.13	Date formatting on interview cards and feedback
lucide-react	0.482.0	Icon library
next-themes	0.4.6	Dark/light theme management

2.6 Radix UI Primitives
Primitive	Package	Used For
Label	@radix-ui/react-label	Accessible form labels in AuthForm
Slot	@radix-ui/react-slot	asChild prop pattern in Button component



3. System Architecture
3.1 High-Level Architecture
ZenPrep follows a full-stack Next.js architecture with server-side rendering for data fetching, client-side React for UI interactions, and API routes as secure proxies for third-party AI services.

The system has 5 main layers:
•Browser Layer — React components, voice recording via MediaRecorder API, audio playback
•Next.js App Router — Server Components for data, Client Components for interactivity
•Server Actions — Direct Firestore operations without REST API overhead
•API Routes — Secure proxies for Sarvam AI (keeps API keys server-side)
•External Services — Groq LLM, Sarvam AI Voice, Firebase Auth + Firestore

3.2 Data Flow — Interview Session
The complete interview flow from start to feedback:

Step	What Happens	Technology Used
1. Generate	User fills form → POST /api/vapi/generate → Groq generates N questions → saved to Firestore	Groq LLaMA, Firestore
2. Start	User clicks Start → Agent fetches questions → TTS speaks welcome message	Sarvam TTS bulbul:v2
3. Question	Agent speaks question → POST /api/sarvam/tts → base64 audio → browser plays	Sarvam TTS, Web Audio API
4. Record	User speaks → getUserMedia() → MediaRecorder records chunks → user clicks Done	Browser MediaRecorder API
5. Transcribe	Audio chunks → POST /api/sarvam/stt → FormData multipart → transcript text	Sarvam STT saarika:v2.5
6. Loop	Transcript saved to state → next question spoken → repeat for all questions	React state, useCallback
7. Feedback	All answers → createFeedback() → Groq analyzes → 6 scores + resources → Firestore	Groq LLaMA, Zod schema
8. Results	router.push() → feedback page → radar chart + category cards + resource links	Recharts, Next.js router

3.3 File Structure
zenprep/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Auth route group → /sign-in, /sign-up
│   ├── (root)/             # Protected route group → /, /interview
│   │   └── interview/
│   │       ├── page.tsx    # Interview setup form
│   │       └── [id]/
│   │           ├── page.tsx          # Live voice interview
│   │           └── feedback/page.tsx  # Score + resources
│   └── api/
│       ├── sarvam/tts/route.ts  # TTS proxy
│       ├── sarvam/stt/route.ts  # STT proxy
│       └── vapi/generate/route.ts # Question generation
├── components/             # React components (43 files total)
├── constants/              # Languages, domains, schemas
├── firebase/               # Admin + client SDK config
├── lib/
│   ├── sarvam.ts           # Voice SDK (TTS, STT, mic)
│   └── actions/            # Server actions
├── types/index.d.ts        # Global TypeScript types
└── public/                 # Static assets



4. Key Concepts Explained
4.1 Next.js App Router
ZenPrep uses Next.js 15+ App Router which introduces Server Components by default. This means components run on the server and send HTML to the browser — enabling direct database queries without a separate API layer.

Concept	How Used in ZenPrep	Benefit
Server Components	Dashboard, InterviewCard, FeedbackPage	Fetch Firestore data without exposing credentials
Client Components	Agent, AuthForm, LanguagePicker, DomainPicker	Browser APIs (mic, audio), event handlers
Server Actions	createFeedback, getInterviews, signIn/signUp	Direct DB mutations, no REST API needed
Route Groups	(auth) and (root) folders	Different layouts without affecting URLs
Dynamic Routes	[id] folder in interview/	Interview-specific pages /interview/abc123
API Routes	app/api/ folder	Server-side proxy for Sarvam AI keys

4.2 Voice Interview Architecture
The voice system uses three Web APIs together:

•getUserMedia() — requests microphone permission from the browser
•MediaRecorder API — records audio in webm/ogg format in 100ms chunks
•Web Audio API — plays TTS audio returned as base64-encoded WAV

The clever part is the Promise pattern in listen():
// listen() starts recording and returns a Promise
// The Promise only resolves when user clicks 'Done Answering'
// stopListening() → mediaRecorder.stop() → onstop fires → resolve(transcript)
This lets runInterview() use a simple await listen() as if it were synchronous, while actually waiting for the user to finish speaking.

4.3 Feedback Schema with Zod
The feedback structure is validated with Zod to ensure Groq's response matches exactly what the app expects:
feedbackSchema = z.object({
  totalScore: z.number().min(0).max(100),
  categoryScores: z.tuple([6 categories with name + score + comment]),
  strengths: z.array(z.string()),
  areasForImprovement: z.array(z.string()),
  finalAssessment: z.string(),
  upskillResources: z.array(topic, title, url, platform, type, difficulty)
})
Zod.parse() throws an error if Groq's JSON doesn't match — ensuring the feedback page never crashes from unexpected data shapes.

4.4 Firebase Security Pattern
ZenPrep uses a dual Firebase setup for security:

SDK	File	Used For	Security
Firebase Client	firebase/client.ts	Browser auth (createUser, signIn)	NEXT_PUBLIC_ vars — safe to expose
Firebase Admin	firebase/admin.ts	Server DB reads/writes	Private key — never sent to browser
The pattern: browser creates the user with Client SDK → gets ID token → sends to Server Action → Server Action verifies with Admin SDK → creates session cookie. The session cookie is httpOnly (not readable by JavaScript), preventing XSS attacks.

4.5 Sarvam AI Voice Engine
Sarvam AI is India's first multilingual voice AI. ZenPrep replaces the English-only Vapi SDK with Sarvam's REST API for three capabilities:

API	Endpoint	Model	Input → Output
Text-to-Speech	/text-to-speech	bulbul:v2	Text + language code → base64 WAV audio
Speech-to-Text	/speech-to-text	saarika:v2.5	Audio file (webm) → transcript text
Translation	/translate	mayura:v1	Text + source/target language → translated text
The TTS model supports 500 character chunks. Long questions are split at sentence boundaries before sending, then audio chunks are played sequentially.

4.6 Groq LLM Integration
ZenPrep uses Groq as the LLM provider because:
•Free tier with no daily quotas per project
•Sub-second inference (Groq's hardware acceleration)
•LLaMA 3.3 70B is comparable to GPT-4 for structured tasks

Two Groq calls are made during each interview session:
•Question Generation — generates N interview questions as plain text, one per line
•Feedback Analysis — analyzes full transcript, returns JSON with scores + resources
The feedback call uses a manual JSON parsing approach (regex + JSON.parse + Zod) instead of generateObject() because Groq's LLaMA models don't support the json_schema response format required by the Vercel AI SDK's structured output feature.



5. Component Reference
5.1 Core Components
Component	Type	Lines	Key Responsibility
Agent.tsx	Client	650	Full voice interview loop — TTS, STT, transcript, feedback
AuthForm.tsx	Client	132	Sign in / Sign up with Firebase + React Hook Form + Zod
InterviewCard.tsx	Server	~90	Dashboard card — score, language badge, techstack icons
DisplayTechIcons.tsx	Server	~45	Renders devicon SVGs for techstack array
LanguagePicker.tsx	Client	~50	11 language pill buttons, fires onSelect callback
DomainPicker.tsx	Client	~55	11 domain cards grid, auto-fills techstack on select
ResourceCard.tsx	Server	88	Upskilling resource link — platform icon, free/paid badge
ScoreChart.tsx	Client	77	Recharts RadarChart for 6 category scores

5.2 UI Primitives (shadcn-style)
Component	File	Based On
Button	components/ui/button.tsx	Radix Slot + class-variance-authority variants
Input	components/ui/input.tsx	Native HTML input with Tailwind styling
Label	components/ui/label.tsx	@radix-ui/react-label for accessibility

5.3 Page Components
Page	Route	Data Source	Key Features
Dashboard	/	Firestore (parallel fetch)	Stats cards, interview grids, CTA banner
Interview Setup	/interview	Client state	Language picker, domain picker, config form
Live Interview	/interview/[id]	Firestore interview doc	Agent component in interview mode
Feedback	/interview/[id]/feedback	Firestore feedback doc	Radar chart, category bars, resources
Sign In	/sign-in	Client (Firebase Auth)	Email/password form
Sign Up	/sign-up	Client (Firebase Auth)	Name + email + password form



6. API Routes
6.1 POST /api/sarvam/tts
Converts text to speech using Sarvam AI.
Field	Details
Method	POST
Request Body	{ text: string, languageCode: SarvamLanguageCode }
Response	{ success: true, audioBase64: string, mimeType: 'audio/wav' }
Model	bulbul:v2
Max Text	500 characters (longer text is chunked)
Security	SARVAM_API_KEY never exposed to browser

6.2 POST /api/sarvam/stt
Converts recorded audio to text transcript.
Field	Details
Method	POST
Request Body	FormData with audio (File) and languageCode (string)
Response	{ success: true, transcript: string, confidence: number }
Model	saarika:v2.5
Audio Format	webm/ogg from MediaRecorder API
Security	SARVAM_API_KEY never exposed to browser

6.3 POST /api/vapi/generate
Generates interview questions using Groq LLM and saves interview to Firestore.
Field	Details
Method	POST
Request Body	{ type, role, level, techstack, amount, userid, language, domain }
Response	{ success: true, interviewId: string }
Model	llama-3.3-70b-versatile via Groq
Side Effect	Creates interview document in Firestore interviews collection
Security	GROQ_API_KEY never exposed to browser



7. Database Schema (Firestore)
7.1 interviews Collection
Field	Type	Description
id	string (auto)	Firestore document ID
userId	string	Firebase Auth UID of creator
role	string	Job role e.g. 'Frontend Developer'
type	string	'technical' | 'behavioral' | 'mixed'
level	string	'intern' | 'junior' | 'mid' | 'senior' | 'lead'
techstack	string[]	Array of technologies e.g. ['React', 'Node.js']
questions	string[]	Generated interview questions
finalized	boolean	true = available for others to take
language	string	Sarvam language code e.g. 'hi-IN'
domain	string	Domain ID e.g. 'fullstack', 'ai-ml'
createdAt	string	ISO timestamp

7.2 feedback Collection
Field	Type	Description
id	string (auto)	Firestore document ID
interviewId	string	Reference to interviews document
userId	string	Firebase Auth UID
totalScore	number	Average of 6 category scores (0-100)
categoryScores	array	6 objects: { name, score, comment }
strengths	string[]	3-5 strength points from AI
areasForImprovement	string[]	3-5 improvement areas from AI
finalAssessment	string	Overall paragraph assessment
upskillResources	array	Resources for weak areas (score < 75)
languageUsed	string	Language code of the interview
createdAt	string	ISO timestamp

7.3 Required Firestore Indexes
Collection	Fields	Purpose
interviews	userId ASC, createdAt DESC	User's own interview history
interviews	finalized ASC, userId ASC, createdAt DESC	Available interviews for others
feedback	interviewId ASC, userId ASC	Get feedback for a specific interview
feedback	userId ASC, createdAt ASC	User's feedback history for charts



8. Complete Setup Guide
8.1 Prerequisites
Tool	Required Version	Installation
Node.js	18+	nodejs.org or via nvm
npm	8+	Comes with Node.js
Git	Any	git-scm.com
VS Code	Any	code.visualstudio.com
Chrome	Any	For microphone testing

8.2 API Keys Required
Service	URL	Free Tier	Key Name in .env
Firebase	console.firebase.google.com	Yes (Spark plan)	7 NEXT_PUBLIC_ + 3 admin vars
Groq AI	console.groq.com	Yes (generous)	GROQ_API_KEY
Sarvam AI	dashboard.sarvam.ai	Yes (free credits)	SARVAM_API_KEY

8.3 Installation Steps
Run these commands in your terminal:
# 1. Navigate to project folder
cd zenprep

# 2. Install all dependencies
npm install

# 3. Copy environment template
cp .env.example .env.local

# 4. Fill in API keys (open in VS Code)
code .env.local

# 5. Start development server
npm run dev

# App runs at http://localhost:3000

8.4 Environment Variables
Variable	Source	Required
NEXT_PUBLIC_FIREBASE_API_KEY	Firebase Console → Project Settings → Web App	Yes
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN	Firebase Console → Project Settings → Web App	Yes
NEXT_PUBLIC_FIREBASE_PROJECT_ID	Firebase Console → Project Settings → Web App	Yes
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET	Firebase Console → Project Settings → Web App	Yes
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID	Firebase Console → Project Settings → Web App	Yes
NEXT_PUBLIC_FIREBASE_APP_ID	Firebase Console → Project Settings → Web App	Yes
FIREBASE_PROJECT_ID	Service Account JSON → project_id	Yes
FIREBASE_CLIENT_EMAIL	Service Account JSON → client_email	Yes
FIREBASE_PRIVATE_KEY	Service Account JSON → private_key (in quotes)	Yes
GROQ_API_KEY	console.groq.com → API Keys	Yes
SARVAM_API_KEY	dashboard.sarvam.ai → API Keys	Yes



9. Interview Domains
Domain ID	Label	Icon	Default Techstack
technical	Technical / DSA	💻	Data Structures, Algorithms, System Design, LeetCode
fullstack	Full Stack Developer	🌐	React, Node.js, MongoDB, TypeScript, Next.js
fullstack-java	Full Stack Java	☕	Java, Spring Boot, React, MySQL, Docker
ai-ml	AI / Machine Learning	🤖	Python, TensorFlow, PyTorch, Scikit-learn, MLOps
devops	DevOps / Cloud	☁️	AWS, Docker, Kubernetes, CI/CD, Terraform
hr-behavioral	HR / Behavioral	🤝	Communication, Leadership, Problem Solving, Teamwork
finance	Finance	📊	Valuation, Financial Modeling, Excel, Accounting
marketing	Marketing	📣	Digital Marketing, SEO, Analytics, Brand Strategy
data-science	Data Science	📈	Python, SQL, Tableau, Statistics, Pandas
mobile	Mobile Development	📱	React Native, Flutter, iOS, Android, Firebase
custom	Custom / Other	✏️	User-defined



10. Feedback System
10.1 Six Evaluation Categories
#	Category	What It Measures
1	Communication Skills	Clarity, articulation, structured answers, vocabulary
2	Technical Knowledge	Accuracy of technical answers, concepts, frameworks
3	Problem Solving	Approach to problems, logical thinking, edge cases
4	Cultural Fit	Attitude, collaboration signals, company values alignment
5	Confidence and Clarity	Voice confidence, hesitation, directness of answers
6	Depth of Knowledge	Beyond surface answers — internals, tradeoffs, examples (NEW)

10.2 Score Thresholds
Score Range	Color	Meaning
75 – 100	Green	Strong performance — ready for interviews
50 – 74	Yellow	Average — needs improvement in this area
0 – 49	Red	Weak area — upskilling resources provided

10.3 Upskilling Resources
For every category scoring below 75, Groq generates 2-3 real, verified learning resources:
Resource Field	Values	Example
platform	YouTube, Coursera, Udemy, Docs, LeetCode, HackerRank, GitHub, Blog	YouTube
type	free | paid	free
difficulty	Beginner | Intermediate | Advanced	Intermediate
topic	The weak area being addressed	React Hooks
url	Real URL to resource	youtube.com/...



11. Common Issues & Solutions
Error	Cause	Solution
FAILED_PRECONDITION: requires an index	Firestore composite index missing	Click the URL in the error → Create Index in Firebase Console
quota exceeded (429)	Gemini/Groq free tier exhausted	Create new project for fresh quota or wait for reset
model not found (404)	Deprecated model name used	Check console.groq.com/docs/deprecations for current names
Cannot use undefined as Firestore value	userId is null/undefined	Check isAuthenticated() guard in layout and add ignoreUndefinedProperties: true
Port already in use	Previous Next.js process still running	pkill -f 'next' && sleep 2 && npm run dev
Export X doesn't exist in module	Empty file or wrong export name	Check file has content with cat filename.ts
saarika:v2 deprecated	Sarvam updated STT model	Replace saarika:v2 with saarika:v2.5 in STT route
AI_UnsupportedModelVersionError	AI SDK version mismatch	npm install ai@latest @ai-sdk/groq@latest
json_schema not supported	Groq model doesn't support structured output	Use generateText() + manual JSON.parse() instead of generateObject()



12. Deployment Guide (Vercel)
12.1 Steps
ZenPrep deploys to Vercel in minutes:

1.Push code to GitHub — git init && git add . && git commit -m 'init' && git push
2.Go to vercel.com → New Project → Import your GitHub repo
3.In Vercel dashboard → Settings → Environment Variables → add all 11 vars from .env.local
4.Click Deploy — live URL generated in ~2 minutes

12.2 Build Command
npm run build
Note: next.config.ts has typescript.ignoreBuildErrors: true to allow deployment with minor type issues.



13. Credits & Acknowledgements
Resource	Credit	URL
Base Project	adrianhajdin / PrepWise	github.com/adrianhajdin
Voice AI	Sarvam AI	sarvam.ai
LLM Provider	Groq	groq.com
LLM Model	Meta LLaMA 3.3 70B	llama.meta.com
Framework	Vercel / Next.js	nextjs.org
UI Components	shadcn/ui	ui.shadcn.com
Icons	Devicon	devicon.dev
Charts	Recharts	recharts.org
Auth + DB	Google Firebase	firebase.google.com


ZenPrep — Built with ❤️ for India 🇮🇳  |  Prepare Calmly. Perform Confidently.