import type { Metadata } from "next";
import { profile } from "@/content/profile";
import { absoluteUrl } from "@/lib/site";

type PageMetadataInput = {
  path: string;
  title: string;
  description: string;
};

const sharingImage = {
  url: absoluteUrl("/og.png"),
  width: 1200,
  height: 630,
  alt: `${profile.name} — ${profile.role}. ${profile.headline}`,
};

// The full metadata for one public page (feature 005 FR-011–FR-013). Next.js replaces a
// parent's `openGraph` object rather than merging it, so every field is set here.
export function pageMetadata({ path, title, description }: PageMetadataInput): Metadata {
  const url = absoluteUrl(path);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: profile.name,
      type: "website",
      images: [sharingImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [sharingImage.url],
    },
  };
}
