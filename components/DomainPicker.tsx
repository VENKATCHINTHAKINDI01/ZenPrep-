"use client";

import { DOMAINS } from "@/constants/domains";
import { cn } from "@/lib/utils";

interface DomainPickerProps {
  selected: string;
  onSelect: (domainId: string, techstack: string[]) => void;
}

const DomainPicker = ({ selected, onSelect }: DomainPickerProps) => {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-white">Select Domain</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {DOMAINS.map((domain) => (
          <button
            key={domain.id}
            onClick={() => onSelect(domain.id, domain.techstack)}
            className={cn(
              "domain-card",
              selected === domain.id && "domain-card-active"
            )}
          >
            <span className="text-2xl">{domain.icon}</span>
            <span className="text-xs font-medium text-center leading-tight">
              {domain.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DomainPicker;
