import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { interviewCovers, mappings } from "@/constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getTechLogos(techstack: string[]) {
  return techstack.map((tech) => {
    const normalized = tech.toLowerCase().replace(/\s/g, "");
    const mapped = mappings[normalized] || normalized;
    return {
      tech,
      url: `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${mapped}/${mapped}-original.svg`,
    };
  });
}

export function getRandomInterviewCover() {
  const index = Math.floor(Math.random() * interviewCovers.length);
  return `/covers${interviewCovers[index]}`;
}

export function getLanguageDisplayName(code: string): string {
  const names: Record<string, string> = {
    "en-IN": "English",
    "hi-IN": "Hindi",
    "ta-IN": "Tamil",
    "te-IN": "Telugu",
    "bn-IN": "Bengali",
    "kn-IN": "Kannada",
    "ml-IN": "Malayalam",
    "mr-IN": "Marathi",
    "gu-IN": "Gujarati",
    "pa-IN": "Punjabi",
    "or-IN": "Odia",
  };
  return names[code] || "English";
}

export function getLanguageFlag(code: string): string {
  return "🇮🇳";
}
