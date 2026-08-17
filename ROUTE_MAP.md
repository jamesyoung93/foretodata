# Route map

All public routes are generated beneath the GitHub Pages base path `/foretodata/`. Source routes below are shown without the base prefix for readability.

## Previous routes

| Route | Previous purpose | Disposition |
| --- | --- | --- |
| `/` | Terminal homepage and repeated project filters | Replaced in place by Editorial Mode |
| `/about` | Biography, employer claims, method inventory | Rewritten in place |
| `/publications` | Flat publication list | Reorganized in place |
| `/posts` | Flat writing list | Preserved as a legacy alias |
| `/posts/[slug]` | Earlier writing detail pages | Curated; three remain technical notes and the retired URLs redirect to `/writing` |
| `/surprise` | Terminal quote easter egg | Preserved as part of Lab Mode |

## New and current routes

| Route | Purpose | Status |
| --- | --- | --- |
| `/` | Scientific-editorial homepage | Canonical |
| `/work` | Curated work index | New |
| `/work/oxic-nitrogen-fixation` | Published functional-discovery case study | New |
| `/work/rubisco-active-learning` | Protein-language-model and active-learning case study | New |
| `/work/operational-decision-systems` | Applied-practice record for operational decision systems | New |
| `/work/independent-scientific-ml-advisory` | Redirect for retired advisory content | Preserved as a `noindex` redirect to `/work` |
| `/research` | Connected research program | New |
| `/publications` | Publications grouped by research program | Canonical, preserved |
| `/writing` | Insights landing page with one interactive field note and three current Substack essays | Canonical |
| `/field-notes/private-intelligence-network` | Interactive Private Intelligence Network field note with downloadable PDF | New permanent field-note route |
| `/writing/archive` | Three earlier technical notes | New archive route |
| `/posts` | Compatibility redirect | Preserved as a `noindex` redirect to Insights at `/writing` |
| `/posts/[slug]` | Three technical notes plus six retired paths | Curated; retired paths redirect to Insights at `/writing` |
| `/about` | Narrative professional profile | Canonical, preserved |
| `/lab` | Optional terminal-inspired exploration layer | New |
| `/surprise` | Lab Mode easter egg | Preserved, `noindex` |

## Redirects and removals

No runtime redirect dependency was added. Astro generates static, base-aware redirect documents for `/posts`, the retired advisory page, three generated guide posts, the DNA post, and the two removed Foundations posts. Each redirect is `noindex`, has the correct canonical target, and avoids a 404.

## Base-path behavior

`src/utils/paths.ts` builds internal URLs from `import.meta.env.BASE_URL`. Astro configuration remains `base: /foretodata`. The generated route checker rejects root-relative references that escape the base and verifies generated local targets.

Canonical and social URLs use the configured Astro site plus the base-aware path. Assets and redirects use the same path helper. Three technical notes remain at `/foretodata/posts/[slug]`; six retired post paths redirect to Insights.

## Compatibility concerns

- GitHub Pages may normalize trailing slashes; generated pages use directory-style output and work with or without the visible trailing slash.
- Direct client-side routing was not introduced. Every public page is a static HTML file.
- The `/posts` compatibility route redirects to Insights.
- Retired-detail routes use `noindex` and canonical URLs for the Work or Insights destination.
- The route checker explicitly asserts the Insights page, earlier-notes archive, three retained notes, and all retired post redirects.
- A future custom-domain migration should update `site` and `base` together and rerun `npm run check:routes`.
