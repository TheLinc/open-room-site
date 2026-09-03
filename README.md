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

Copy screenshots and video into `public/` rather than referencing the app repo at build time. The two repos have no build-time link.
