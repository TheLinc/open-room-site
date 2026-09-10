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

The download button asks the GitHub API for the newest published release at render time and links straight to its Windows installer (`open-room-<version>-setup.exe`, named by `electron-builder.yml` in the app repo). The answer is cached for an hour, and when GitHub can't be reached the button falls back to the releases list. GitHub's own `releases/latest` redirect is not used because it skips pre-releases, which is every 0.x release.

## Art

The five mascots are hand-traced pixel sprites in `src/lib/crew-sprites.ts` and `src/lib/crew-faces.ts`. The desk-row sprites were traced by `scripts/trace-row.mjs` from the generated still kept under `assets/higgsfield/keyframes/row/`, next to the character reference; see the README there. The social preview image is drawn from the same sprites and copy by `src/app/opengraph-image.tsx`, with Geist Medium from `src/assets/fonts/`.

## Waitlist

Signups go to Resend as contacts. Set `RESEND_API_KEY`, and optionally `RESEND_SEGMENT_ID`, in `.env.local` for development and in the Vercel project settings for deployments. See `.env.example`.
