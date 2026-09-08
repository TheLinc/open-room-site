import { crewById, type CrewId } from "@/lib/crew";
import { faceById } from "@/lib/crew-faces";

// A mascot's face as a crisp little SVG, for avatars. Fits its cells into a
// square box so every face lines up in a list.
export function CrewFace({
  id,
  size = 28,
  className,
}: {
  id: CrewId;
  size?: number;
  className?: string;
}) {
  const face = faceById[id];
  const member = crewById[id];
  const cells = Math.max(face.width, face.height);
  const ox = (cells - face.width) / 2;
  const oy = (cells - face.height) / 2;
  const dark = id === "terminal" ? "#2e5c34" : member.color;
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox={`0 0 ${cells} ${cells}`}
      shapeRendering="crispEdges"
      aria-hidden="true"
      focusable="false"
    >
      {face.rows.map((line, y) =>
        line
          .split("")
          .map((ch, x) =>
            ch === "." ? null : (
              <rect
                key={`${x},${y}`}
                x={ox + x}
                y={oy + y}
                width={1}
                height={1}
                fill={ch === "w" ? "#ffffff" : ch === "D" ? dark : member.color}
              />
            ),
          ),
      )}
    </svg>
  );
}
