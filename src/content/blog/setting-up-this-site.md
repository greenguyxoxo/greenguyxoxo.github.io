---
title: "How this site is put together"
description: "A quick tour of the project structure, in case future-me forgets."
pubDate: 2026-09-08
tags: ["meta", "astro"]
---

A quick reference for how this project is organized:

- `src/content/blog/` — one Markdown file per post
- `src/pages/` — routes: the home page, the `/blog` index, the `[...slug]` post template, `/about`, and the RSS feed
- `src/layouts/` — shared page chrome (`BaseLayout`) and the per-post layout (`BlogPost`)
- `src/styles/global.css` — all the site's styling, including light and dark mode
- `public/` — static files served as-is (favicon, `robots.txt`)

## Local development

```bash
npm install
npm run dev
```

Then open `http://localhost:4321`.

## Building for production

```bash
npm run build
```

This outputs a fully static site to `dist/`, ready to deploy anywhere that serves static files.
