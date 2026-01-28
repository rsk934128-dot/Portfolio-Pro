"use client";

import { doc, collection } from "firebase/firestore";
import { useFirestore, useDoc, useCollection, useMemoFirebase } from "@/firebase";
import { portfolioOwnerId } from "@/lib/config";

import { Header } from "@/components/layout/header";
import { HeroSection } from "@/components/sections/hero-section";
import { SkillsSection } from "@/components/sections/skills-section";
import { ProjectsSection } from "@/components/sections/projects-section";
import { CertificationsSection } from "@/components/sections/certifications-section";
import { Footer } from "@/components/layout/footer";
import { ContactSection } from "@/components/sections/contact-section";

export default function Home() {
  const firestore = useFirestore();

  const userRef = useMemoFirebase(() => doc(firestore, 'users', portfolioOwnerId), [firestore]);
  const { data: profileData, isLoading: isProfileLoading } = useDoc(userRef);

  const projectsRef = useMemoFirebase(() => collection(firestore, 'users', portfolioOwnerId, 'projects'), [firestore]);
  const { data: projectsData, isLoading: areProjectsLoading } = useCollection(projectsRef);

  const skillsRef = useMemoFirebase(() => collection(firestore, 'users', portfolioOwnerId, 'skills'), [firestore]);
  const { data: skillsData, isLoading: areSkillsLoading } = useCollection(skillsRef);
  
  const certificationsRef = useMemoFirebase(() => collection(firestore, 'users', portfolioOwnerId, 'certifications'), [firestore]);
  const { data: certificationsData, isLoading: areCertificationsLoading } = useCollection(certificationsRef);

  return (
    <div className="flex flex-col min-h-screen">
      <Header profile={profileData} skills={skillsData} />
      <main className="flex-1">
        <HeroSection profile={profileData} isLoading={isProfileLoading} />
        <SkillsSection skills={skillsData} isLoading={areSkillsLoading} />
        <ProjectsSection projects={projectsData} isLoading={areProjectsLoading} />
        <CertificationsSection certifications={certificationsData} isLoading={areCertificationsLoading} />
        <ContactSection />
      </main>
      <Footer profile={profileData} isLoading={isProfileLoading} />
    </div>
  );
}
