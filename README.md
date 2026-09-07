# rngdev

Source for rngdev.net — a blog built with [Astro](https://astro.build).

## Writing locally

```bash
npm install
npm run dev
```

Open http://localhost:4321 to preview. `npm run build` outputs a static site to `dist/`.

## Adding a post

Create a new file in `src/content/blog/`, e.g. `src/content/blog/my-post.md`:

```markdown
---
title: "My post title"
description: "One sentence for previews, RSS, and search engines."
pubDate: 2026-09-10
tags: ["optional", "tags"]
---

Write the post here in Markdown.
```

The post appears automatically at `/blog/my-post/` — no other file needs to change.

## Deploying

Pick one host. All three are free for a personal blog and all three take a custom domain.

### Option A: GitHub Pages (uses the included GitHub Actions workflow)

1. Create a new **public** GitHub repository and push this project to it.
2. In the repo's Settings → Pages, set **Source** to "GitHub Actions".
3. Push to `main` — `.github/workflows/deploy.yml` builds and deploys automatically.
4. In Settings → Pages, add `rngdev.net` (and `www.rngdev.net` if you want it) as the custom domain. A `public/CNAME` file with `rngdev.net` is already included, so this may be pre-filled.
5. At your domain registrar, point DNS at GitHub Pages:
   - Four `A` records on the root (`@`) to `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - A `CNAME` record for `www` pointing to `<your-github-username>.github.io`

### Option B: Netlify

1. Push this project to a GitHub (or GitLab) repo.
2. In Netlify, "Add new site" → "Import an existing project" → pick the repo.
3. Build command: `npm run build`. Publish directory: `dist`.
4. Once deployed, go to Domain settings → Add a domain → enter `rngdev.net`, then follow Netlify's DNS instructions (either point nameservers at Netlify, or add the `A`/`CNAME` records it gives you at your registrar).
5. Delete `public/CNAME` — that file is GitHub Pages-specific and unnecessary here (harmless if left, just unused).

### Option C: Cloudflare Pages

1. Push this project to a GitHub repo.
2. In the Cloudflare dashboard, Workers & Pages → Create → Pages → connect the repo.
3. Build command: `npm run build`. Build output directory: `dist`.
4. After deploying, go to Custom domains → add `rngdev.net`. If the domain's nameservers are already on Cloudflare, this is a couple of clicks; otherwise Cloudflare shows the DNS records to add elsewhere.

## Registering rngdev.net

Not registered yet. Register it at any registrar (Cloudflare Registrar, Namecheap, Porkbun, etc. are all reasonably priced with no markup or free WHOIS privacy). If you register through Cloudflare, DNS setup for Option C above is simplest since it's all in one dashboard.

## Project structure

```
src/
  content/blog/        one Markdown file per post
  layouts/              BaseLayout (site chrome), BlogPost (post chrome)
  pages/                 index, /blog, /blog/[...slug], /about, rss.xml
  styles/global.css     all styling, including dark mode
public/                  favicon, robots.txt, CNAME (GitHub Pages)
```
