import { Github, Linkedin, Mail } from "lucide-react";
import { PlaceHolderImages } from "./placeholder-images";

export const profile = {
  name: "Muskan Akram",
  title: "Front-End Developer | Web & AI Solutions Creator",
  bio: "A Meta Certified Front-End Developer passionate about building modern, responsive, and performant web applications. I focus on clean UI, scalability, and creating seamless user experiences. This portfolio showcases my journey, skills, and the projects I'm proud of.",
  contact: {
    email: "muskan@example.com",
    social: [
      {
        name: "GitHub",
        url: "https://github.com/muskan-akram",
        icon: Github,
      },
      {
        name: "LinkedIn",
        url: "https://linkedin.com/in/muskan-akram",
        icon: Linkedin,
      },
      {
        name: "Email",
        url: "mailto:muskan@example.com",
        icon: Mail,
      },
    ],
  },
  profilePicture: PlaceHolderImages.find(p => p.id === 'profile-pic'),
};

export const skills = {
  "Languages & Frameworks": [
    "React",
    "TypeScript",
    "JavaScript (ES6+)",
    "HTML5",
    "CSS3",
    "Tailwind CSS",
  ],
  "Tools & Platforms": [
    "Vite",
    "Next.js",
    "Git",
    "GitHub",
    "Vercel",
    "Firebase",
  ],
  "Concepts": [
    "Responsive Design",
    "Component Architecture",
    "UI/UX Principles",
    "Web Performance",
    "REST APIs",
  ],
};

export const projects = [
  {
    title: "Nexus – Investor & Entrepreneur Collaboration Platform",
    description:
      "A platform designed to facilitate seamless collaboration between investors and entrepreneurs, featuring advanced frontend enhancements like a FullCalendar integration, video call interface, and a secure document chamber with e-signature mockups.",
    tags: ["React", "TypeScript", "Tailwind CSS", "FullCalendar", "Vercel"],
    liveUrl: "#",
    repoUrl: "https://github.com/muskan-akram/Nexus",
    image: PlaceHolderImages.find(p => p.id === 'project-nexus'),
  },
  {
    title: "Personal Portfolio Website",
    description:
      "My personal space on the web to showcase my skills, projects, and professional journey. Built with React and Vite, focusing on performance, clean UI, and scalability. Includes an AI-powered personalization tool.",
    tags: ["React", "Vite", "TypeScript", "AI", "Responsive Design"],
    liveUrl: "#",
    repoUrl: "https://github.com/muskan-akram/muskan-portfolio",
    image: PlaceHolderImages.find(p => p.id === 'project-portfolio'),
  },
  {
    title: "Admin Payment Dashboard",
    description:
      "A simple yet effective admin dashboard for processing payments from GBP to USDT. This project demonstrates skills in creating functional and clear user interfaces for financial applications, tracking transactions, and managing data.",
    tags: ["HTML", "CSS", "JavaScript", "Dashboard UI"],
    liveUrl: "#",
    repoUrl: "#",
    image: PlaceHolderImages.find(p => p.id === 'project-payment'),
  },
];

export const certifications = [
  {
    title: "Meta Certified Front-End Developer",
    issuer: "Meta (Facebook)",
    date: "2023",
    url: "#",
  },
  {
    title: "Advanced Frontend Development",
    issuer: "Internship Program",
    date: "2023",
    url: "#",
  },
  {
    title: "React - The Complete Guide",
    issuer: "Udemy",
    date: "2022",
    url: "#",
  },
];
