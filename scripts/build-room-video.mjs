// Encodes the approved loop for the web: H.264 MP4 for everything, VP9 WebM where
// supported, both silent, 1080 px square, and a JSON manifest the site and tests read.
import { execFileSync } from "node:child_process";
import { mkdir, stat, writeFile } from "node:fs/promises";

const SRC = "assets/higgsfield/keyframes/hero/video/loop-test-v1.mp4";
const OUT = "public/room";
const MANIFEST = "src/assets/room/loop.json";
const SIDE = 1080;

await mkdir(OUT, { recursive: true });

const input = ["-y", "-v", "error", "-i", SRC, "-an", "-vf", `scale=${SIDE}:${SIDE}:flags=lanczos`];

execFileSync(
  "ffmpeg",
  [...input, "-c:v", "libx264", "-preset", "slow", "-crf", "23", "-pix_fmt", "yuv420p", "-movflags", "+faststart", `${OUT}/loop.mp4`],
  { stdio: "inherit" },
);

execFileSync(
  "ffmpeg",
  [...input, "-c:v", "libvpx-vp9", "-crf", "33", "-b:v", "0", "-row-mt", "1", "-pix_fmt", "yuv420p", `${OUT}/loop.webm`],
  { stdio: "inherit" },
);

const probe = JSON.parse(
  execFileSync("ffprobe", [
    "-v", "error",
    "-select_streams", "v:0",
    "-show_entries", "stream=width,height,nb_frames,duration",
    "-of", "json",
    `${OUT}/loop.mp4`,
  ]).toString(),
);
const stream = probe.streams[0];

const manifest = {
  width: stream.width,
  height: stream.height,
  duration: Number(stream.duration),
  frames: Number(stream.nb_frames),
  mp4Bytes: (await stat(`${OUT}/loop.mp4`)).size,
  webmBytes: (await stat(`${OUT}/loop.webm`)).size,
};
await writeFile(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(manifest);
