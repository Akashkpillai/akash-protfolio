import type { Metadata } from "next";
import { Manrope, Source_Sans_3 } from "next/font/google";
import { AskLab } from "@/components/lab/AskLab";
import { LabProbe } from "@/components/lab/LabProbe";
import { Footer } from "@/components/layout/Footer";
import { labTopics } from "@/lib/lab-knowledge";
import { Header } from "@/components/layout/Header";
import { AmbientBackground } from "@/components/motion/AmbientBackground";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { INTRO_KEY, MOTION_KEY } from "@/lib/motion";
import { profile } from "@/content/profile";
import { siteOrigin } from "@/lib/site";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
  display: "swap",
});

// Defaults only: canonical and sharing fields are set per page (src/lib/metadata.ts), so
// the not-found page inherits none of them.
export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  title: `${profile.name} | Portfolio`,
  description: profile.headline,
  applicationName: profile.name,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // The head script may set data-motion before hydration, so <html> attributes can differ.
    <html lang="en" className={`${manrope.variable} ${sourceSans.variable}`} suppressHydrationWarning>
      <head>
        {/* Applies a saved motion pause before first paint (feature 007 FR-014), and marks the
            first homepage view of a session for the entrance (FR-037). */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var d=document.documentElement,m=localStorage.getItem("${MOTION_KEY}")||sessionStorage.getItem("${MOTION_KEY}");if(m==="paused")d.dataset.motion="paused";else if(location.pathname==="/"&&!matchMedia("(prefers-reduced-motion: reduce)").matches&&!sessionStorage.getItem("${INTRO_KEY}")){sessionStorage.setItem("${INTRO_KEY}","1");d.dataset.intro="play"}}catch(e){}`,
          }}
        />
      </head>
      <body>
        <MotionProvider>
          <AmbientBackground />
          <div className="scroll-progress" aria-hidden="true" />
          <Header />
          {children}
          <Footer />
          <AskLab topics={labTopics()} />
          <LabProbe />
        </MotionProvider>
      </body>
    </html>
  );
}
