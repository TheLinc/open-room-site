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

The download button asks the GitHub API for the newest published release at render time and links straight to its Windows installer (`open-room-<version>-setup.exe`, named by `electron-builder.yml` in the app repo). The answer is cached for ten minutes, and when GitHub can't be reached the button falls back to the releases list. GitHub's own `releases/latest` redirect is not used because it skips pre-releases, which is every 0.x release.

## Art

The five mascots are hand-traced pixel sprites in `src/lib/crew-sprites.ts` and `src/lib/crew-faces.ts`. The desk-row sprites were traced by `scripts/trace-row.mjs` from the generated still kept under `assets/higgsfield/keyframes/row/`, next to the character reference; see the README there. The social preview image is drawn from the same sprites and copy by `src/app/opengraph-image.tsx`, with Geist Medium from `src/assets/fonts/`.

Every product image is drawn in code, on purpose: a change to the app does not force a site change, and a drawing sits on the page's own surface where a cropped screenshot would carry the app's white background with it. The panels below the hero are built from `src/components/app-parts.tsx`, which draws the app's fields, selects and switches small. Their reference is the set of real captures in `assets/app-reference/`: element crops at 2x from the app running in its light theme, taken over the Chrome DevTools Protocol against `electron-vite dev --remoteDebuggingPort <port>` with `OPEN_ROOM_HOME` pointed at a throwaway home holding the five demo agents. Retake them when the app's editor, settings or thread change shape, then update the drawings.
