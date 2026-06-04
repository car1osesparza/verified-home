# Deploying this site

This is a **Next.js** app. For normal hosting (Vercel, AWS, Docker, a Node server, etc.), use the **standard build** — not the static export used for GitHub Pages.

## Get the code

```bash
git clone https://github.com/car1osesparza/verified-home.git
cd verified-home
git checkout main
git pull origin main
```

## Run in production (Node)

Requires **Node 20+**.

```bash
npm ci
npm run build
npm start
```

The app listens on port **3000** by default (`PORT` env var overrides).

Local development:

```bash
npm run dev
```

## Do not use for this deploy path

These are only for **GitHub Pages** (static HTML in `out/`):

- `npm run build:static`
- `npm run preview:static`
- Uploading the `out/` folder

## Environment variables

| Variable | When |
|----------|------|
| *(none)* | Site at domain root, e.g. `https://example.com/` |
| `NEXT_PUBLIC_BASE_PATH=/your-path` | Site under a subpath only — set **before** `npm run build` |

## Large files

Hero background videos live in `public/video/` (committed encodes). First visit may take time to load the desktop file (~25 MB). Mobile uses `VerifiedHero.mobile.mp4` (~2 MB).

## GitHub Pages (optional)

If you *are* using Pages on this repo: push to `main` and let the **Deploy Next.js static site to Pages** workflow run. Live URL: https://car1osesparza.github.io/verified-home/

That path is separate from a normal Node deploy above.
