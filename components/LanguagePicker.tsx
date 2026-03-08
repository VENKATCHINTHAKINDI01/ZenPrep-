"use client";

import { LANGUAGES } from "@/constants/languages";
import { cn } from "@/lib/utils";

interface LanguagePickerProps {
  selected: SarvamLanguageCode;
  onSelect: (code: SarvamLanguageCode) => void;
}

const LanguagePicker = ({ selected, onSelect }: LanguagePickerProps) => {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-white">Select Interview Language</h3>
      <div className="flex flex-wrap gap-2">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            onClick={() => onSelect(lang.code)}
            className={cn(
              "language-badge cursor-pointer transition-all hover:border-primary-200",
              selected === lang.code
                ? "border-primary-200 bg-primary-200/20 text-white"
                : "border-transparent bg-dark-300 text-light-400"
            )}
          >
            {lang.flag} {lang.nativeName}
          </button>
        ))}
      </div>
      <p className="text-light-600 text-xs">
        AI will speak and understand your selected language
      </p>
    </div>
  );
};

export default LanguagePicker;
