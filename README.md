# ForetoData

James Young’s professional portfolio for scientific machine learning, biological discovery, and decision systems.

The default experience is a restrained scientific editorial site. An optional Lab Mode preserves the original terminal-inspired character without duplicating the underlying work content.

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

- `src/data/site.ts` — shared case-study, publication, positioning, and profile content
- `src/content/blog/` — writing archive
- `src/pages/` — static Astro routes
- `src/layouts/Base.astro` — shared navigation, metadata, and mode-aware shell
- `src/styles/global.css` — editorial and Lab Mode visual systems
- `review/screenshots/` — non-public review captures

Private review and implementation documents live at the repository root:

- `CONTENT_REVIEW.md`
- `REDESIGN_NOTES.md`
- `ROUTE_MAP.md`
- `QA_REPORT.md`

## Deployment

The existing GitHub Actions workflow deploys only pushes to `main`. Redesign work should be reviewed on `redesign/scientific-editorial`; do not merge or deploy until the content review is complete.

