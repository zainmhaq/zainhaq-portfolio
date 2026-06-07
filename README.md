# Portfolio — zainmhaq.com

Personal portfolio site built with Astro, deployed to GitHub Pages.

## Swap writing samples

1. Drop the new PDF into `public/samples/`.
2. Open `src/data/samples.json` and update the entry (or add a new one):

```json
{
  "title": "Your sample title",
  "type": "API documentation",
  "audience": "Developers",
  "description": "A short description of what this sample covers.",
  "file": "your-filename.pdf"
}
```

3. Remove the old PDF from `public/samples/` if replacing.
4. Commit and push. The GitHub Action handles the rest.

## Local development

```bash
npm install
npm run dev
```

## Deploy

Push to `main`. The GitHub Action at `.github/workflows/deploy.yml` builds and deploys to GitHub Pages automatically.

## Project structure

```
public/samples/       <- PDF writing samples go here
src/data/samples.json <- edit this file to update what appears on the site
src/pages/index.astro <- main page
src/styles/global.css <- all styles
```
