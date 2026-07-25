# ForetoData

James Young's professional portfolio for decision systems, interactive AI, and scientific machine learning.

The default experience is a restrained analytical-editorial site organized around a cross-domain operating pattern: represent, simulate, decide, and learn. An optional Lab Mode preserves the terminal-inspired character without duplicating the underlying work content.

## Local development

Requirements: Node.js 20 or later and npm.

```bash
npm ci
npm run dev
```

Open `http://localhost:4321/foretodata/`.

## Validation

```bash
npm run build
npm run check:routes
```

The build includes `astro check`. The route checker validates generated internal references against the GitHub Pages `/foretodata/` base path.

## Content and structure

- `src/data/site.ts` — shared case-study, capability, publication, featured-insight, positioning, and profile content
- `src/components/SystemsLens.jsx` — interactive comparison of the decision architecture across domains
- `src/content/blog/` — earlier technical notes preserved behind the Insights page
- `src/pages/` — static Astro routes
- `src/layouts/Base.astro` — shared navigation, metadata, and mode-aware shell
- `src/styles/global.css` — editorial and Lab Mode visual systems
- `review/screenshots/` — non-public review captures

Private review and implementation documents live at the repository root:

- `CONTENT_REVIEW.md`
- `ARCHIVE_REVIEW.md`
- `REDESIGN_NOTES.md`
- `ROUTE_MAP.md`
- `QA_REPORT.md`

## Deployment

The GitHub Actions workflow deploys pushes to `main`. New work should be validated on a branch, reviewed through a pull request, and merged only when it is ready for the public site.

