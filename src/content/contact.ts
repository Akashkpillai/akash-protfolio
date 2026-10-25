// Owner-confirmed contacts (2026-10-25). No phone number, address, or form (FR-008).
export const email = "akashkpillai55@gmail.com";

export type ContactLink = {
  kind: "email" | "linkedin" | "github";
  label: string;
  href: string;
};

export const contactLinks: readonly ContactLink[] = [
  { kind: "email", label: "Email", href: `mailto:${email}` },
  { kind: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/akash-k-pillai/" },
  { kind: "github", label: "GitHub", href: "https://github.com/Akashkpillai" },
];
