# Open Room site

The landing page for [Open Room](https://github.com/TheLinc/open-room), served at https://openroom.dev.

This repo holds only the website. The app, its releases and its docs live in the app repo. Keeping them apart means a copy change here does not run the app's three-OS CI, and an app commit does not rebuild the site.

## Stack

Next.js 16 (App Router, `src/` layout, `@/*` alias), TypeScript, Tailwind CSS v4, ESLint. Node 22.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run lint
```

`next dev` rewrites the block inside `AGENTS.md` on every run. Commit that change with your work rather than reverting it.

## Deploy

Hosted on Vercel. Import the GitHub repo in the Vercel dashboard; it detects Next.js with no extra config. Point `openroom.dev` at the project under Settings, Domains.

Every push to `master` deploys production. Every other branch and pull request gets a preview URL.

## Download links

Link installers through GitHub's stable redirect so the page never needs updating for a release:

```
https://github.com/TheLinc/open-room/releases/latest
https://github.com/TheLinc/open-room/releases/latest/download/<asset name>
```

The asset names come from `electron-builder.yml` in the app repo. Check them against the latest release before hard-coding one.

## Assets

The room on the page comes from generated masters under `assets/higgsfield/keyframes/`. Two scripts turn them into web files, and both the masters and the outputs are committed, so the scripts only need to run again when a master changes:

- `npm run build:frames` crops the stills to a square around the room and writes `src/assets/room/*.webp` and `og-room.png`. Needs nothing beyond `npm install`.
- `npm run build:video` encodes the hero loop to `public/room/loop.webm` and `loop.mp4` and writes `src/assets/room/loop.json`. Needs `ffmpeg` and `ffprobe` on PATH.

Prompts, job ids and the art direction are in `assets/higgsfield/keyframes/README.md` and `docs/superpowers/specs/2026-09-03-hero-art-direction-design.md`.

## Waitlist

Signups go to Resend as contacts. Set `RESEND_API_KEY`, and optionally `RESEND_SEGMENT_ID`, in `.env.local` for development and in the Vercel project settings for deployments. See `.env.example`.
