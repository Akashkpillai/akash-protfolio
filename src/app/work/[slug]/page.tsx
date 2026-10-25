import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublishedProject, publishedProjects } from "@/content/projects";
import { profile } from "@/content/profile";
import { CaseStudyArticle } from "@/components/work/CaseStudyArticle";

type CaseStudyPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return publishedProjects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: CaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getPublishedProject(slug);
  if (!project) {
    return {};
  }
  return {
    title: `${project.title} | ${profile.name}`,
    description: project.summary,
  };
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const project = getPublishedProject(slug);
  if (!project) {
    notFound();
  }

  return (
    <main id="main-content" tabIndex={-1}>
      <CaseStudyArticle project={project} />
    </main>
  );
}
