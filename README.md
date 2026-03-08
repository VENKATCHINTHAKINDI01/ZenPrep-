<div align="center">

<img src="public/logo.png" alt="ZenPrep Logo" width="120" height="120" />

# ZenPrep 🧘

**BY:VENKAT CHINTHAKINDI**

### *Prepare Calmly. Perform Confidently.*

**AI-powered multilingual mock interview platform built for India 🇮🇳**  
Practice real voice interviews in your native language. Get honest AI feedback. Land your dream job.

<br/>

![Next.js](https://img.shields.io/badge/Next.js_16-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Groq](https://img.shields.io/badge/Groq_AI-F55036?style=for-the-badge&logo=groq&logoColor=white)

</div>

---

## 📌 Table of Contents

- [What is ZenPrep?](#-what-is-zenprep)
- [Key Features](#-key-features)
- [Tech Stack](#️-tech-stack)
- [How It Works](#-how-it-works)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Firebase Setup](#-firebase-setup)
- [API Routes](#-api-routes)
- [Supported Languages](#-supported-languages)
- [Interview Domains](#️-interview-domains)
- [Feedback System](#-feedback-system)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Credits](#-credits)

---

## 🎯 What is ZenPrep?

ZenPrep is the only open-source mock interview platform that lets Indian job seekers **practice voice interviews in their native language** and receive detailed, AI-generated feedback.

Most interview tools are English-only, text-based, and give generic tips. ZenPrep is different:

| Feature | Other Platforms | ZenPrep |
|---|---|---|
| Language Support | English only | **11 Indian languages** |
| Interview Mode | Text-based | **Voice — AI speaks & listens** |
| Feedback Engine | Generic tips | **6-dimension AI scoring** |
| Upskilling Resources | None | **AI-curated per weak area** |
| Domain Coverage | Generic | **11 specialized domains** |
| Score Visualization | Simple number | **Interactive radar chart** |

---

## ✨ Key Features

- 🗣️ **Real Voice Interviews** — AI speaks questions aloud, you answer with your mic
- 🌐 **11 Indian Languages** — Hindi, Tamil, Telugu, Bengali, Kannada, Malayalam, Marathi, Gujarati, Punjabi, Odia + English
- 🤖 **Powered by Groq LLaMA 3.3 70B** — Sub-second question generation and deep feedback analysis
- 🎙️ **Sarvam AI Voice Engine** — India's first multilingual voice AI (`bulbul:v2` TTS + `saarika:v2.5` STT)
- 📊 **6-Category Feedback** — Communication, Technical Knowledge, Problem Solving, Cultural Fit, Confidence, Depth
- 📚 **Upskilling Resources** — AI-curated YouTube, Coursera, and docs links for every weak area (score < 75)
- 🏢 **11 Interview Domains** — Full Stack, AI/ML, DevOps, Finance, HR, Data Science, Mobile, and more
- 📈 **Dashboard Analytics** — Track your average score, best performance, and top domain over time
- 🔐 **Secure Auth** — Firebase Email/Password with httpOnly session cookies

---

## 🛠️ Tech Stack

### Core
| Technology | Version | Role |
|---|---|---|
| [Next.js](https://nextjs.org) | 16.x | Full-stack framework (App Router + Turbopack) |
| [TypeScript](https://typescriptlang.org) | 5.x | Type-safe development |
| [React](https://react.dev) | 19.x | UI components |
| [Tailwind CSS](https://tailwindcss.com) | 4.x | Utility-first styling |

### AI & Voice
| Service | Model | Purpose |
|---|---|---|
| [Groq AI](https://groq.com) | `llama-3.3-70b-versatile` | Question generation + Feedback analysis |
| [Sarvam AI](https://sarvam.ai) | `bulbul:v2` | Text-to-Speech (AI speaks questions) |
| [Sarvam AI](https://sarvam.ai) | `saarika:v2.5` | Speech-to-Text (records your answers) |
| [Vercel AI SDK](https://sdk.vercel.ai) | `ai` + `@ai-sdk/groq` | Unified LLM interface |

### Backend & Database
| Technology | Purpose |
|---|---|
| [Firebase Auth](https://firebase.google.com) | Email/password authentication |
| [Firestore](https://firebase.google.com) | NoSQL database for interviews + feedback |
| [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations) | Direct DB mutations without REST overhead |
| [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers) | Secure server-side proxy for AI APIs |

### Frontend Libraries
| Library | Version | Purpose |
|---|---|---|
| [Recharts](https://recharts.org) | 2.12.0 | Radar chart for score visualization |
| [React Hook Form](https://react-hook-form.com) | 7.54.2 | Form state management |
| [Zod](https://zod.dev) | 3.24.2 | Schema validation for forms + AI responses |
| [Sonner](https://sonner.emilkowal.ski) | 2.0.1 | Toast notifications |
| [dayjs](https://day.js.org) | 1.11.13 | Date formatting |
| [lucide-react](https://lucide.dev) | 0.482.0 | Icons |

---

## 🔄 How It Works

```
1. Setup    →  Choose language + domain + experience level
2. Generate →  Groq LLaMA creates N custom interview questions
3. Speak    →  AI reads each question aloud via Sarvam TTS
4. Record   →  Your mic records your answer via MediaRecorder API
5. Transcribe → Sarvam STT converts your audio to text
6. Repeat   →  Loop for all questions
7. Analyze  →  Groq analyzes full transcript → 6 scores + resources
8. Review   →  See radar chart, category breakdown, upskilling links
```

### Voice Interview Architecture

The `listen()` function uses a clever **Promise-from-outside** pattern:

```typescript
// listen() starts recording and returns a Promise
// The Promise only resolves when user clicks "Done Answering"
const transcript = await listen()  // waits here...

// User clicks "Done Answering" → stopListening() → mediaRecorder.stop()
// → onstop fires → STT API call → resolve(transcript)
// → listen() returns with the transcribed text
```

This lets the interview loop (`runInterview()`) use clean sequential `await` calls for each question, while actually waiting for the user to finish speaking.

---

## 📁 Project Structure

```
zenprep/
├── app/
│   ├── (auth)/                    # Route group — no "(auth)" in URL
│   │   ├── layout.tsx             # Redirects to / if already logged in
│   │   ├── sign-in/page.tsx       # /sign-in
│   │   └── sign-up/page.tsx       # /sign-up
│   ├── (root)/                    # Route group — protected pages
│   │   ├── layout.tsx             # Navbar + auth guard
│   │   ├── page.tsx               # / — Dashboard
│   │   └── interview/
│   │       ├── page.tsx           # /interview — Setup form
│   │       └── [id]/
│   │           ├── page.tsx       # /interview/:id — Live voice session
│   │           └── feedback/
│   │               └── page.tsx   # /interview/:id/feedback — Results
│   ├── api/
│   │   ├── sarvam/tts/route.ts    # POST /api/sarvam/tts
│   │   ├── sarvam/stt/route.ts    # POST /api/sarvam/stt
│   │   └── vapi/generate/route.ts # POST /api/vapi/generate
│   ├── globals.css                # Design system (dark theme)
│   └── layout.tsx                 # Root layout
├── components/
│   ├── Agent.tsx                  # ⭐ Core voice interview loop (650 lines)
│   ├── AuthForm.tsx               # Sign in / Sign up form
│   ├── InterviewCard.tsx          # Dashboard interview card
│   ├── DisplayTechIcons.tsx       # Tech stack icon renderer
│   ├── LanguagePicker.tsx         # 11 language pill buttons
│   ├── DomainPicker.tsx           # 11 domain selection grid
│   ├── ResourceCard.tsx           # Upskilling resource link card
│   ├── ScoreChart.tsx             # Recharts radar chart
│   └── ui/
│       ├── button.tsx             # shadcn Button component
│       ├── input.tsx              # shadcn Input component
│       └── label.tsx              # shadcn Label component
├── constants/
│   ├── index.ts                   # Zod feedback schema + config
│   ├── languages.ts               # 11 Indian language definitions
│   └── domains.ts                 # 11 interview domains + techstacks
├── firebase/
│   ├── admin.ts                   # Server-side Firebase Admin SDK
│   └── client.ts                  # Browser Firebase Client SDK
├── lib/
│   ├── utils.ts                   # cn() + getTechLogos()
│   ├── sarvam.ts                  # Voice SDK (TTS, STT, mic recording)
│   └── actions/
│       ├── auth.action.ts         # signIn, signUp, getCurrentUser
│       └── general.action.ts      # createFeedback, getInterviews, etc.
├── types/
│   └── index.d.ts                 # Global TypeScript types
├── public/                        # Static assets (logo, avatars, covers)
├── .env.example                   # Environment variable template
├── .gitignore
├── next.config.ts
├── package.json
└── tsconfig.json
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ ([download](https://nodejs.org))
- **npm** 8+ (comes with Node.js)
- **Git** ([download](https://git-scm.com))
- **Chrome** browser (best mic support)
- API keys for Firebase, Groq, and Sarvam AI

### 1. Clone the Repository

```bash
git clone https://github.com/VENKATCHINTHAKINDI01/ZenPrep-.git
cd ZenPrep-
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

```bash
cp .env.example .env.local
```

Then open `.env.local` and fill in all values (see [Environment Variables](#-environment-variables) below).

### 4. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in Chrome 🎉

---

## 🔑 Environment Variables

```env
# ── Firebase Client (NEXT_PUBLIC_ = safe for browser) ──────────
# Get from: Firebase Console → Project Settings → Your Apps → Web App
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=

# ── Firebase Admin (server-only, NEVER exposed to browser) ─────
# Get from: Firebase Console → Project Settings → Service Accounts → Generate Key
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=""   # Wrap in quotes — keep the \n characters!

# ── Groq AI ────────────────────────────────────────────────────
# Get from: https://console.groq.com/keys
GROQ_API_KEY=

# ── Sarvam AI ──────────────────────────────────────────────────
# Get from: https://dashboard.sarvam.ai
SARVAM_API_KEY=
```

> ⚠️ **Important:** `FIREBASE_PRIVATE_KEY` must be wrapped in double quotes and preserve the literal `\n` characters exactly as they appear in the downloaded JSON file.

---

## 🔥 Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com) → **Add Project**
2. Enable **Authentication** → Sign-in method → **Email/Password** → Enable
3. Enable **Firestore Database** → Start in **production mode** → Choose region (`asia-south1` for India)
4. Go to **Project Settings** → **General** → Your Apps → **Add Web App** → Copy config to `.env.local`
5. Go to **Project Settings** → **Service Accounts** → **Generate new private key** → Copy values to `.env.local`

### Required Firestore Indexes

Add these composite indexes in Firebase Console → Firestore → Indexes:

| Collection | Field 1 | Field 2 | Field 3 |
|---|---|---|---|
| `interviews` | `userId` ASC | `createdAt` DESC | — |
| `interviews` | `finalized` ASC | `userId` ASC | `createdAt` DESC |
| `feedback` | `interviewId` ASC | `userId` ASC | — |
| `feedback` | `userId` ASC | `createdAt` ASC | — |

> 💡 If you see a `FAILED_PRECONDITION` error in the console, it includes a direct link to create the missing index — just click it!

---

## 📡 API Routes

### `POST /api/sarvam/tts`
Converts text to speech. Keeps `SARVAM_API_KEY` server-side.

```typescript
// Request
{ text: string, languageCode: "hi-IN" | "ta-IN" | ... }

// Response
{ success: true, audioBase64: string, mimeType: "audio/wav" }
```

### `POST /api/sarvam/stt`
Converts recorded audio to text transcript.

```typescript
// Request (FormData)
FormData: { audio: File, languageCode: string }

// Response
{ success: true, transcript: string }
```

### `POST /api/vapi/generate`
Generates interview questions via Groq and saves to Firestore.

```typescript
// Request
{ type, role, level, techstack, amount, userid, language, domain }

// Response
{ success: true, interviewId: string }
```

---

## 🌐 Supported Languages

| Language | Code | Native Script |
|---|---|---|
| English (India) | `en-IN` | English |
| Hindi | `hi-IN` | हिन्दी |
| Tamil | `ta-IN` | தமிழ் |
| Telugu | `te-IN` | తెలుగు |
| Bengali | `bn-IN` | বাংলা |
| Kannada | `kn-IN` | ಕನ್ನಡ |
| Malayalam | `ml-IN` | മലയാളം |
| Marathi | `mr-IN` | मराठी |
| Gujarati | `gu-IN` | ગુજરાતી |
| Punjabi | `pa-IN` | ਪੰਜਾਬੀ |
| Odia | `or-IN` | ଓଡ଼ିଆ |

---

## 🏢 Interview Domains

| Domain | Default Tech Stack |
|---|---|
| 💻 Technical / DSA | Data Structures, Algorithms, System Design, LeetCode |
| 🌐 Full Stack Developer | React, Node.js, MongoDB, TypeScript, Next.js |
| ☕ Full Stack Java | Java, Spring Boot, React, MySQL, Docker |
| 🤖 AI / Machine Learning | Python, TensorFlow, PyTorch, Scikit-learn, MLOps |
| ☁️ DevOps / Cloud | AWS, Docker, Kubernetes, CI/CD, Terraform |
| 🤝 HR / Behavioral | Communication, Leadership, Problem Solving, Teamwork |
| 📊 Finance | Valuation, Financial Modeling, Excel, Accounting |
| 📣 Marketing | Digital Marketing, SEO, Analytics, Brand Strategy |
| 📈 Data Science | Python, SQL, Tableau, Statistics, Pandas |
| 📱 Mobile Development | React Native, Flutter, iOS, Android, Firebase |
| ✏️ Custom | User-defined |

---

## 📊 Feedback System

After every interview, Groq analyzes your full transcript and scores you across 6 dimensions:

| # | Category | What It Measures |
|---|---|---|
| 1 | **Communication Skills** | Clarity, articulation, structured answers |
| 2 | **Technical Knowledge** | Accuracy, concepts, framework understanding |
| 3 | **Problem Solving** | Approach, logic, edge case handling |
| 4 | **Cultural Fit** | Attitude, collaboration, values alignment |
| 5 | **Confidence and Clarity** | Directness, hesitation, assertiveness |
| 6 | **Depth of Knowledge** | Internals, tradeoffs, real-world examples |

### Score Thresholds

| Range | Meaning | Action |
|---|---|---|
| 75 – 100 | 🟢 Strong | Ready for interviews |
| 50 – 74 | 🟡 Average | Needs improvement |
| 0 – 49 | 🔴 Weak | Upskilling resources provided |

For every category below 75, the AI generates 2–3 curated learning resources (YouTube, Coursera, official docs, LeetCode) tailored to that specific weakness.

---

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project** → Import your repo
3. Add all environment variables in Vercel Dashboard → Settings → Environment Variables
4. Click **Deploy** — live in ~2 minutes ✅

### Build Locally

```bash
npm run build
npm start
```

---

## 🔧 Troubleshooting

| Error | Cause | Fix |
|---|---|---|
| `FAILED_PRECONDITION: requires an index` | Missing Firestore index | Click the URL in the error → Create Index |
| `Cannot use undefined as Firestore value` | `userId` is null/undefined | Add auth guard in layout.tsx |
| `saarika:v2 deprecated` | Old STT model name | Use `saarika:v2.5` in STT route |
| `AI_UnsupportedModelVersionError` | Old AI SDK version | `npm install ai@latest @ai-sdk/groq@latest` |
| `json_schema not supported` | Groq structured output | Use `generateText()` + `JSON.parse()` |
| `src refspec main does not match any` | No git commit yet | Run `git add . && git commit -m "init"` first |
| Port already in use | Old Next.js process | `pkill -f "next" && npm run dev` |

---

## 📦 Database Schema

### `interviews` collection
```typescript
{
  id: string,              // Firestore auto-ID
  userId: string,          // Firebase Auth UID
  role: string,            // "Frontend Developer"
  type: "technical" | "behavioral" | "mixed",
  level: "intern" | "junior" | "mid" | "senior" | "lead",
  techstack: string[],     // ["React", "Node.js"]
  questions: string[],     // AI-generated questions
  finalized: boolean,      // available for others to take
  language: string,        // "hi-IN"
  domain: string,          // "fullstack"
  createdAt: string        // ISO timestamp
}
```

### `feedback` collection
```typescript
{
  id: string,
  interviewId: string,
  userId: string,
  totalScore: number,      // 0-100
  categoryScores: [{       // 6 categories
    name: string,
    score: number,
    comment: string
  }],
  strengths: string[],
  areasForImprovement: string[],
  finalAssessment: string,
  upskillResources: [{
    topic: string,
    title: string,
    url: string,
    platform: string,
    type: "free" | "paid",
    difficulty: "Beginner" | "Intermediate" | "Advanced"
  }],
  createdAt: string
}
```

---

## 🙏 Credits

| Resource | Credit |
|---|---|
| Base Project Inspiration | [adrianhajdin/PrepWise](https://github.com/adrianhajdin) |
| Voice AI | [Sarvam AI](https://sarvam.ai) — India's multilingual voice AI |
| LLM Provider | [Groq](https://groq.com) — Ultra-fast inference |
| LLM Model | [Meta LLaMA 3.3 70B](https://llama.meta.com) |
| Framework | [Vercel / Next.js](https://nextjs.org) |
| UI Components | [shadcn/ui](https://ui.shadcn.com) |
| Tech Icons | [Devicon](https://devicon.dev) |
| Charts | [Recharts](https://recharts.org) |
| Database + Auth | [Google Firebase](https://firebase.google.com) |

---

<div align="center">

Built with ❤️ for India 🇮🇳

**ZenPrep** — *Prepare Calmly. Perform Confidently.*

**VENKAT CHINTHAKINDI**

</div>