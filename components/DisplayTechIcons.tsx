import Image from "next/image";
import { mappings } from "@/constants";

const DisplayTechIcons = ({ techstack }: TechIconProps) => {
  const icons = (techstack || []).slice(0, 5).map((tech) => {
    const normalized = tech.toLowerCase().replace(/\s/g, "");
    const mapped = mappings[normalized] || normalized;
    return {
      tech,
      url: `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${mapped}/${mapped}-original.svg`,
    };
  });

  const remaining = (techstack || []).length - 5;

  return (
    <div className="flex flex-row gap-1">
      {icons.map(({ tech, url }) => (
        <div
          key={tech}
          className="relative size-7 rounded-full bg-dark-300 border border-dark-200 flex items-center justify-center overflow-hidden"
          title={tech}
        >
          <Image
            src={url}
            alt={tech}
            width={20}
            height={20}
            className="object-contain p-0.5"
          />
        </div>
      ))}
      {remaining > 0 && (
        <div className="size-7 rounded-full bg-dark-300 border border-dark-200 flex items-center justify-center">
          <span className="text-light-400 text-xs font-bold">+{remaining}</span>
        </div>
      )}
    </div>
  );
};

export default DisplayTechIcons;
