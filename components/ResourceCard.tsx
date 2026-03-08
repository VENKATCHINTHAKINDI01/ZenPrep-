import Link from "next/link";
import { cn } from "@/lib/utils";

// Platform icon map — emoji fallback for each platform
const platformIcons: Record<string, string> = {
  YouTube: "▶️",
  Coursera: "🎓",
  Udemy: "🟣",
  Docs: "📄",
  LeetCode: "💻",
  HackerRank: "🟢",
  GitHub: "🐙",
  Blog: "✍️",
};

// Difficulty color map
const difficultyColors: Record<string, string> = {
  Beginner: "text-success-100",
  Intermediate: "text-yellow-400",
  Advanced: "text-destructive-100",
};

interface ResourceCardProps {
  resource: UpskillResource;
}

const ResourceCard = ({ resource }: ResourceCardProps) => {
  const icon = platformIcons[resource.platform] || "🔗";
  const diffColor = difficultyColors[resource.difficulty] || "text-light-400";

  return (
    <Link
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="resource-card group"
    >
      {/* ── Top Row: platform icon + badges ── */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">{icon}</span>
          <span className="text-light-400 text-xs font-medium">
            {resource.platform}
          </span>
        </div>

        {/* Free / Paid + Difficulty badges */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span
            className={cn(
              resource.type === "free"
                ? "resource-badge-free"
                : "resource-badge-paid"
            )}
          >
            {resource.type === "free" ? "Free" : "Paid"}
          </span>
          <span className={cn("text-xs font-semibold", diffColor)}>
            {resource.difficulty}
          </span>
        </div>
      </div>

      {/* ── Topic tag ── */}
      <span className="text-xs text-primary-200 font-semibold bg-primary-200/10 px-2 py-0.5 rounded-full w-fit">
        {resource.topic}
      </span>

      {/* ── Title ── */}
      <h4 className="text-white text-sm font-semibold leading-snug group-hover:text-primary-200 transition-colors">
        {resource.title}
      </h4>

      {/* ── Description ── */}
      {resource.description && (
        <p className="text-light-600 text-xs leading-relaxed line-clamp-2">
          {resource.description}
        </p>
      )}

      {/* ── Visit link indicator ── */}
      <p className="text-primary-200/60 text-xs mt-auto group-hover:text-primary-200 transition-colors">
        Visit resource →
      </p>
    </Link>
  );
};

export default ResourceCard;