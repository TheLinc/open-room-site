import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { copy } from "@/lib/copy";

export const alt = copy.headline;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const png = await readFile(join(process.cwd(), "src/assets/room/og-room.png"));
  const room = `data:image/png;base64,${png.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "#010206",
          color: "#ededed",
        }}
      >
        {/* Room on the right. og-room.png is a 1200 px square; at 700 tall it is 700 wide. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={room}
          alt=""
          style={{ position: "absolute", right: -40, top: -35, height: 700 }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 24,
            padding: 64,
            width: 560,
          }}
        >
          <div style={{ fontSize: 22, color: "#a1a1aa" }}>{copy.eyebrow}</div>
          <div style={{ fontSize: 54, fontWeight: 600, lineHeight: 1.1 }}>{copy.headline}</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
