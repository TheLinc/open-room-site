import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { copy } from "@/lib/copy";
import { crew } from "@/lib/crew";
import { faceById } from "@/lib/crew-faces";

export const alt = copy.hero.headline;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// The same surface as the page: zinc ground, Geist, the ink voice pill in
// the headline, the crew looking out from the bottom edge.
const ground = "#fafafa";
const ink = "#09090b";
const muted = "#71717a";
const line = "#e4e4e7";
const teal = "#288888";

const geist = readFile(
  join(process.cwd(), "src/assets/fonts/Geist-Medium.ttf"),
);
const mark = readFile(join(process.cwd(), "src/assets/brand/logo.png"));

function Face({ id, cell }: { id: (typeof crew)[number]["id"]; cell: number }) {
  const face = faceById[id];
  const color = crew.find((m) => m.id === id)!.color;
  const dark = id === "terminal" ? "#2e5c34" : color;
  const cells = Math.max(face.width, face.height);
  const ox = (cells - face.width) / 2;
  const oy = cells - face.height;
  return (
    <svg
      width={cells * cell}
      height={cells * cell}
      viewBox={`0 0 ${cells} ${cells}`}
      shapeRendering="crispEdges"
    >
      {face.rows.flatMap((row, y) =>
        row
          .split("")
          .map((ch, x) =>
            ch === "." ? null : (
              <rect
                key={`${x},${y}`}
                x={ox + x}
                y={oy + y}
                width={1}
                height={1}
                fill={ch === "w" ? "#ffffff" : ch === "D" ? dark : color}
              />
            ),
          ),
      )}
    </svg>
  );
}

export default async function Image() {
  const [font, logo] = await Promise.all([geist, mark]);
  // Two set lines, the way the page breaks it at desktop width; the verb
  // sits in the pill with the bars after it.
  const [first, second] = copy.hero.headline.split(" without ");
  const [verb, ...restOfFirst] = first.split(" ");
  const bars = [0.5, 0.8, 1, 0.7, 0.45];

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "56px 64px 0",
        background: ground,
        color: ink,
        fontFamily: "Geist",
        letterSpacing: "-0.02em",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 40,
            height: 40,
            borderRadius: 10,
            background: ink,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`data:image/png;base64,${logo.toString("base64")}`}
            alt=""
            width={9}
            height={22}
          />
        </div>
        <div style={{ fontSize: 26 }}>{copy.siteName}</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 72,
            lineHeight: 1.04,
            letterSpacing: "-0.035em",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                height: 64,
                padding: "0 18px 0 14px",
                marginRight: 16,
                marginTop: 2,
                borderRadius: 999,
                background: ink,
                color: "#ffffff",
              }}
            >
              <div style={{ display: "flex", marginTop: 4 }}>{verb}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                {bars.map((h, i) => (
                  <div
                    key={i}
                    style={{
                      width: 4,
                      height: Math.round(20 * h),
                      borderRadius: 2,
                      background: teal,
                    }}
                  />
                ))}
              </div>
            </div>
            <div style={{ display: "flex" }}>{restOfFirst.join(" ")}</div>
          </div>
          <div style={{ display: "flex" }}>{`without ${second}`}</div>
        </div>
        <div
          style={{
            maxWidth: 880,
            fontSize: 27,
            lineHeight: 1.4,
            color: muted,
          }}
        >
          {copy.hero.lead}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          borderTop: `1px solid ${line}`,
          paddingTop: 22,
          paddingBottom: 40,
        }}
      >
        <div style={{ fontSize: 22, color: muted }}>{copy.hero.under}</div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 34 }}>
          {crew.map((m) => (
            <Face key={m.id} id={m.id} cell={7} />
          ))}
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [{ name: "Geist", data: font, style: "normal", weight: 500 }],
    },
  );
}
