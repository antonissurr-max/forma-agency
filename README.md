# Omnidot

Marketing site for Omnidot (Vite + React + TypeScript).

## Local development

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

## Remotes

- `origin` — Cursor Origin (this Cloud Agent workspace pushes here)
- `github` — https://github.com/antonissurr-max/omnidot.git (Cloudflare Pages typically watches this)

## Cloudflare Pages preview

If your Cloudflare Pages project is connected to the GitHub repo `antonissurr-max/omnidot`:

| Setting | Value |
| --- | --- |
| Framework preset | Vite |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | `/` |
| Node version | 20+ |

Production deploys update when commits land on the branch Cloudflare watches (usually `main`).

To also push edits from this agent to GitHub (so Cloudflare rebuilds automatically), add a GitHub personal access token with `repo` scope as a Cloud Agent secret / env var, or grant write access another way — then we can `git push github main`.

Alternatively, deploy with Wrangler (needs `CLOUDFLARE_API_TOKEN` + account/project):

```bash
npx wrangler pages deploy dist --project-name=<your-pages-project>
```
