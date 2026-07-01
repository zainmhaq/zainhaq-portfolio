# Portfolio — zainmhaq.com

Personal portfolio site for Zain Haq, technical writer. Built with Astro, deployed to GitHub Pages.

Writing samples are Markdown files rendered as native HTML pages (docs-as-code), with PDF downloads and machine-readable twins for AI agents (`/llms.txt`, `/llms-full.txt`, and a raw `.md` route per sample).

## Add or update a writing sample

1. Create or edit a Markdown file in `src/content/samples/`. The frontmatter drives everything:

   ```yaml
   ---
   title: Your sample title
   summary: One-sentence description shown on cards and in llms.txt.
   docType: API documentation
   audience: Developers
   purpose: What the document does, shown as the page lede.
   note: Disclosure note (e.g., fictional product names).
   highlights:
     - What a reviewer should look for in this sample
   pdf: your-filename.pdf          # must exist in public/samples/
   order: 1                        # sort position
   ---

   Your Markdown content here...
   ```

2. Drop the matching PDF into `public/samples/`.
3. Commit and push. The GitHub Action handles the rest.

Each sample automatically gets: an HTML page at `/work/<filename>/`, a raw Markdown route at `/work/<filename>.md`, a card on the home page, and entries in `llms.txt`, `llms-full.txt`, and `sitemap.xml`.

## Local development

```bash
npm install
npm run dev
```

## Deploy

Push to `main`. The GitHub Action at `.github/workflows/deploy.yml` builds and deploys to GitHub Pages automatically.

## Project structure

```
src/content/samples/   <- writing samples (Markdown + frontmatter)
src/content.config.ts  <- content collection schema
src/pages/index.astro  <- home page
src/pages/work/        <- sample page template + raw Markdown route
src/pages/llms.txt.ts  <- llms.txt for AI agents
src/components/        <- nav, footer, sample card
src/styles/global.css  <- design system (light/dark themes)
public/samples/        <- PDF versions of samples
```

## Design notes

- Type: Fraunces (display), Atkinson Hyperlegible Next (body), JetBrains Mono (labels/code) — variable fonts, self-hosted via Fontsource
- Light "paper & ink" theme and dark "dusk & ember" theme; toggle in the nav, respects `prefers-color-scheme`
- No JavaScript frameworks, no analytics, no cookies
