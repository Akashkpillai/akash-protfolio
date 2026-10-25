import type { Metadata } from "next";
import { SystemsLab } from "@/components/layout/SystemsLab";
import { AboutSection } from "@/components/profile/AboutSection";
import { ContactSection } from "@/components/profile/ContactSection";
import { ExperienceSection } from "@/components/profile/ExperienceSection";
import { MessageSection } from "@/components/profile/MessageSection";
import { SkillsSection } from "@/components/profile/SkillsSection";
import { SelectedWork } from "@/components/work/SelectedWork";
import { profile } from "@/content/profile";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  path: "/",
  title: `${profile.name} | ${profile.role}`,
  description: `${profile.role}. ${profile.intro}`,
});

export default function HomePage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <SystemsLab />
      <SelectedWork />
      <ExperienceSection />
      <SkillsSection />
      <AboutSection />
      <MessageSection />
      <ContactSection />
    </main>
  );
}
