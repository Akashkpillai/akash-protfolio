import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { profile } from "@/content/profile";

// The site-wide sharing card (features 005 FR-013, 006 FR-021): the site's own typography,
// colours, and text only. Rendered once at build; fonts are OFL-1.1 Manrope instances, read
// once at module scope as the ImageResponse docs recommend.
export const dynamic = "force-static";

const fonts = Promise.all(
  ["Manrope-Medium.ttf", "Manrope-SemiBold.ttf"].map((file) =>
    readFile(join(process.cwd(), "src", "assets", "fonts", file)),
  ),
);

const colors = {
  canvas: "#0d1116",
  surface: "#131a21",
  ink: "#f1ebe2",
  muted: "#aab4bc",
  line: "#1d2731",
  teal: "#2fd3c4",
  cobalt: "#6f9bff",
  copper: "#de8a5f",
  sand: "#d9c27a",
};

// Decorative project nodes around the "AK" node (no data; the card only names the site).
const nodes = [
  { x: 960, y: 150, color: colors.copper },
  { x: 1090, y: 315, color: colors.sand },
  { x: 960, y: 480, color: colors.cobalt },
  { x: 830, y: 315, color: colors.teal },
];

export async function GET() {
  const [medium, semiBold] = await fonts;

  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          background: colors.canvas,
          color: colors.ink,
          fontFamily: "Manrope",
        }}
      >
        {Array.from({ length: 15 }, (_, i) => (
          <div key={`v${i}`} style={{ position: "absolute", top: 0, bottom: 0, left: i * 80, width: 1, background: colors.line }} />
        ))}
        {Array.from({ length: 8 }, (_, i) => (
          <div key={`h${i}`} style={{ position: "absolute", left: 0, right: 0, top: i * 80, height: 1, background: colors.line }} />
        ))}
        {nodes.map((node) => (
          <div
            key={`${node.x}-${node.y}`}
            style={{
              position: "absolute",
              left: node.x - 26,
              top: node.y - 26,
              width: 52,
              height: 52,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 26,
              border: `3px solid ${node.color}`,
              background: colors.surface,
            }}
          >
            <div style={{ width: 14, height: 14, borderRadius: 7, background: node.color }} />
          </div>
        ))}
        <div
          style={{
            position: "absolute",
            left: 960 - 56,
            top: 315 - 56,
            width: 112,
            height: 112,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 56,
            border: `2px solid ${colors.teal}`,
            background: colors.surface,
            fontSize: 36,
            fontWeight: 600,
          }}
        >
          AK
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: 760,
            padding: "72px 0 72px 80px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", fontSize: 24, fontWeight: 600, letterSpacing: 6 }}>
            AKASH
            <span style={{ color: colors.muted, margin: "0 16px" }}>/</span>
            <span style={{ color: colors.muted, fontSize: 20, letterSpacing: 5 }}>SYSTEMS LAB</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ color: colors.copper, fontSize: 22, fontWeight: 600, letterSpacing: 5 }}>
              {profile.role.toUpperCase()}
            </div>
            <div style={{ fontSize: 44, fontWeight: 600, marginTop: 14 }}>{profile.name}</div>
            {/* One sentence per line, as in the hero. */}
            <div style={{ display: "flex", flexDirection: "column", fontSize: 58, fontWeight: 600, letterSpacing: -1.5, lineHeight: 1.08, marginTop: 26 }}>
              {profile.headline.split(/(?<=\.)\s+/).map((sentence) => (
                <div key={sentence}>{sentence}</div>
              ))}
            </div>
          </div>
          <div style={{ width: 160, height: 6, background: colors.teal }} />
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Manrope", data: medium, weight: 500, style: "normal" },
        { name: "Manrope", data: semiBold, weight: 600, style: "normal" },
      ],
    },
  );
}
