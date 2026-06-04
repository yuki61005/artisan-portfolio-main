// Personal portfolio configuration — edit this file to update your details.

export const site = {
  name: "Htoo Khant Kyaw",
  title: "Htoo Khant Kyaw — Junior Web Developer",
  shortBio:
    "Junior web developer building engaging, functional user experiences with React, Next.js, and modern tooling.",
  longBio:
    "I'm a junior web developer based in Tokyo, currently studying IT Engineering at 読売理工医療福祉専門学校. With a foundation in HTML5, CSS3, JavaScript, and React.js — and a growing toolkit across Node.js, TypeScript, and Tailwind — I'm focused on shipping clean, accessible, and performant web products. Coming from a chemistry background and a year of immersing myself in Japanese language and culture, I bring curiosity, discipline, and a problem-solving mindset to every codebase I touch.",
  email: "hkkportfolio97@gmail.com",
  phone: "080-3055-4654",
  location: "Tokyo, Japan",
  resumeUrl: "/resume.pdf",
  url: "https://example.com",
  languages: "JLPT N2 · ビジネスレベル 上中級 / English / Burmese",
  social: {
    github: "https://github.com/yuki61005",
    linkedin: "https://linkedin.com/in/hkkportfolio/",
    twitter: "https://twitter.com",
  },
};

export const skills: { group: string; items: string[] }[] = [
  {
    group: "Frontend",
    items: ["HTML5", "CSS3", "JavaScript (ES6+)", "React.js", "Next.js", "TypeScript", "Tailwind CSS"],
  },
  { group: "Backend", items: ["Node.js", "Express", "REST APIs"] },
  { group: "Databases", items: ["PostgreSQL", "MySQL", "MongoDB"] },
  { group: "Tools", items: ["Git & GitHub", "Figma", "Jest / Vitest", "Agile / Scrum"] },
];

// Detailed proficiency for the About page.
export const skillMatrix: {
  category: string;
  items: { name: string; level: "Basic" | "Intermediate" | "Advanced"; note: string }[];
}[] = [
  {
    category: "Technical",
    items: [
      { name: "HTML5 & CSS3", level: "Advanced", note: "Semantic HTML, CSS Grid & Flexbox" },
      { name: "JavaScript (ES6+)", level: "Advanced", note: "async/await, DOM manipulation" },
      { name: "Tailwind CSS", level: "Advanced", note: "Utility-first, responsive design" },
      { name: "React.js / Next.js", level: "Intermediate", note: "Hooks, Server-Side Rendering" },
      { name: "Node.js & Express", level: "Intermediate", note: "Building RESTful APIs" },
      { name: "SQL (PostgreSQL)", level: "Basic", note: "CRUD, basic schema design" },
    ],
  },
  {
    category: "Workflow",
    items: [
      { name: "Git & GitHub", level: "Advanced", note: "Branching, Pull Request workflows" },
      { name: "Agile / Scrum", level: "Intermediate", note: "Sprints and standups" },
      { name: "Unit Testing (Jest/Vitest)", level: "Basic", note: "Core logic and components" },
    ],
  },
  {
    category: "Soft Skills",
    items: [
      { name: "Problem Solving", level: "Advanced", note: "Debug and research independently" },
      { name: "Technical Communication", level: "Advanced", note: "Explaining code to non-technical stakeholders" },
      { name: "Adaptability", level: "Advanced", note: "Picking up new frameworks quickly" },
    ],
  },
];

export interface Project {
  title: string;
  description: string;
  tech: string[];
  github?: string;
  live?: string;
  year: string;
  featured?: boolean;
  category: "Web" | "Tool" | "Library" | "Experiment";
}

export const projects: Project[] = [
  {
    title: "E-commerce Site",
    description:
      "Full-stack e-commerce app with user auth, product catalog, shopping cart, and secure payment processing.",
    tech: ["React", "Node.js", "Express", "PostgreSQL"],
    github: "https://github.com/yuki61005",
    year: "2025",
    featured: true,
    category: "Web",
  },
  {
    title: "Task Tracker",
    description:
      "A focused CRUD task management app with local-first storage and a clean, keyboard-friendly UI.",
    tech: ["React", "TypeScript", "Tailwind"],
    github: "https://github.com/yuki61005",
    year: "2025",
    featured: true,
    category: "Web",
  },
  {
    title: "Portfolio & Blog",
    description:
      "This site — a developer portfolio with an integrated blogging platform, built on TanStack Start.",
    tech: ["TanStack Start", "React", "Tailwind", "Supabase"],
    github: "https://github.com/yuki61005",
    year: "2026",
    featured: true,
    category: "Web",
  },
  {
    title: "Open Source Contributions",
    description:
      "Documented fixes and small feature additions across public repositories on GitHub.",
    tech: ["Git", "GitHub", "JavaScript"],
    github: "https://github.com/yuki61005",
    year: "2025",
    category: "Tool",
  },
];

export const experience: { role: string; org: string; period: string; summary: string }[] = [
  {
    role: "Junior Web Developer (Portfolio & Projects)",
    org: "Independent",
    period: "2024 — Present",
    summary:
      "Building full-stack portfolio projects with React, Next.js, Node, and PostgreSQL. Focused on clean UI, accessibility, and shipping end-to-end.",
  },
  {
    role: "IT Engineering Student",
    org: "読売理工医療福祉専門学校",
    period: "2025 — 2027",
    summary:
      "Studying software engineering fundamentals, system design, and modern web development in Tokyo.",
  },
  {
    role: "Japanese Language & Culture",
    org: "長船日本語学院",
    period: "2023 — 2025",
    summary:
      "Full-time Japanese study in Okayama. Achieved JLPT N2 (business level) and adapted to working in Japanese environments.",
  },
];

export const education: { degree: string; school: string; period: string; location: string }[] = [
  {
    degree: "Department of IT Engineering",
    school: "読売理工医療福祉専門学校",
    period: "2025 — 2027",
    location: "Tokyo, Japan",
  },
  {
    degree: "Japanese Language & Culture",
    school: "長船日本語学院",
    period: "2023 — 2025",
    location: "Okayama, Japan",
  },
  {
    degree: "B.Sc. Industrial Chemistry",
    school: "University of East Yangon",
    period: "2013 — 2019",
    location: "Yangon, Myanmar",
  },
];
