// ─────────────────────────────────────────────
// ZenPrep — Indian Languages Configuration
// Sarvam AI supported language codes
// ─────────────────────────────────────────────

export const LANGUAGES: LanguageOption[] = [
    {
      code: "en-IN",
      name: "English",
      nativeName: "English (India)",
      flag: "🇮🇳",
    },
    {
      code: "hi-IN",
      name: "Hindi",
      nativeName: "हिन्दी",
      flag: "🇮🇳",
    },
    {
      code: "ta-IN",
      name: "Tamil",
      nativeName: "தமிழ்",
      flag: "🇮🇳",
    },
    {
      code: "te-IN",
      name: "Telugu",
      nativeName: "తెలుగు",
      flag: "🇮🇳",
    },
    {
      code: "bn-IN",
      name: "Bengali",
      nativeName: "বাংলা",
      flag: "🇮🇳",
    },
    {
      code: "kn-IN",
      name: "Kannada",
      nativeName: "ಕನ್ನಡ",
      flag: "🇮🇳",
    },
    {
      code: "ml-IN",
      name: "Malayalam",
      nativeName: "മലയാളം",
      flag: "🇮🇳",
    },
    {
      code: "mr-IN",
      name: "Marathi",
      nativeName: "मराठी",
      flag: "🇮🇳",
    },
    {
      code: "gu-IN",
      name: "Gujarati",
      nativeName: "ગુજરાતી",
      flag: "🇮🇳",
    },
    {
      code: "pa-IN",
      name: "Punjabi",
      nativeName: "ਪੰਜਾਬੀ",
      flag: "🇮🇳",
    },
    {
      code: "or-IN",
      name: "Odia",
      nativeName: "ଓଡ଼ିଆ",
      flag: "🇮🇳",
    },
  ];
  
  // ── Default language ──
  export const DEFAULT_LANGUAGE: SarvamLanguageCode = "en-IN";
  
  // ── Sarvam AI TTS speaker configurations per language ──
  // Each language has a recommended speaker name from Sarvam's bulbul:v2 model
  export const SARVAM_SPEAKERS: Record<SarvamLanguageCode, string> = {
    "en-IN": "anushka", // English Indian female voice
    "hi-IN": "anushka", // Hindi female voice
    "ta-IN": "anushka", // Tamil female voice
    "te-IN": "anushka", // Telugu female voice
    "bn-IN": "anushka", // Bengali female voice
    "kn-IN": "anushka", // Kannada female voice
    "ml-IN": "anushka", // Malayalam female voice
    "mr-IN": "anushka", // Marathi female voice
    "gu-IN": "anushka", // Gujarati female voice
    "pa-IN": "anushka", // Punjabi female voice
    "or-IN": "anushka", // Odia female voice
  };
  
  // ── Helper: get language name from code ──
  export const getLanguageName = (code: string): string => {
    const lang = LANGUAGES.find((l) => l.code === code);
    return lang?.name ?? "English";
  };
  
  // ── Helper: get native name from code ──
  export const getLanguageNativeName = (code: string): string => {
    const lang = LANGUAGES.find((l) => l.code === code);
    return lang?.nativeName ?? "English";
  };