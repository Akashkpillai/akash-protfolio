import { hasResume, resumeHref } from "@/lib/resume";

export function ResumeLink({ className }: { className?: string }) {
  if (!hasResume()) {
    return null;
  }

  return (
    <a className={className} href={resumeHref} download>
      Download résumé <span className="resume-format">(PDF)</span>
    </a>
  );
}
