export const DOMAINS: DomainOption[] = [
  { id: "technical", label: "Technical / DSA", icon: "💻", techstack: ["Data Structures", "Algorithms", "System Design", "LeetCode"] },
  { id: "fullstack", label: "Full Stack Developer", icon: "🌐", techstack: ["React", "Node.js", "MongoDB", "TypeScript", "Next.js"] },
  { id: "fullstack-java", label: "Full Stack Java", icon: "☕", techstack: ["Java", "Spring Boot", "React", "MySQL", "Docker"] },
  { id: "ai-ml", label: "AI / Machine Learning", icon: "🤖", techstack: ["Python", "TensorFlow", "PyTorch", "Scikit-learn", "MLOps"] },
  { id: "devops", label: "DevOps / Cloud", icon: "☁️", techstack: ["AWS", "Docker", "Kubernetes", "CI/CD", "Terraform"] },
  { id: "hr-behavioral", label: "HR / Behavioral", icon: "🤝", techstack: ["Communication", "Leadership", "Problem Solving", "Teamwork"] },
  { id: "finance", label: "Finance", icon: "📊", techstack: ["Valuation", "Financial Modeling", "Excel", "Accounting"] },
  { id: "marketing", label: "Marketing", icon: "📣", techstack: ["Digital Marketing", "SEO", "Analytics", "Brand Strategy"] },
  { id: "data-science", label: "Data Science", icon: "📈", techstack: ["Python", "SQL", "Tableau", "Statistics", "Pandas"] },
  { id: "mobile", label: "Mobile Development", icon: "📱", techstack: ["React Native", "Flutter", "iOS", "Android", "Firebase"] },
  { id: "custom", label: "Custom / Other", icon: "✏️", techstack: [] },
];

export const EXPERIENCE_LEVELS = [
  { id: "intern", label: "Intern" },
  { id: "junior", label: "Junior (0–2 yrs)" },
  { id: "mid", label: "Mid Level (2–5 yrs)" },
  { id: "senior", label: "Senior (5+ yrs)" },
  { id: "lead", label: "Tech Lead / Manager" },
];

export const INTERVIEW_TYPES = [
  { id: "technical", label: "Technical" },
  { id: "behavioral", label: "Behavioral" },
  { id: "mixed", label: "Mixed" },
];

export const getDomainById = (id: string): DomainOption | undefined => {
  return DOMAINS.find((d) => d.id === id);
};

export const getDomainTechstack = (id: string): string[] => {
  return getDomainById(id)?.techstack ?? [];
};
