# Route map

All public routes are generated beneath the GitHub Pages base path `/foretodata/`. Source routes below are shown without the base prefix for readability.

## Previous routes

| Route | Previous purpose | Disposition |
| --- | --- | --- |
| `/` | Terminal homepage and repeated project filters | Replaced in place by Editorial Mode |
| `/about` | Biography, employer claims, method inventory | Rewritten in place |
| `/publications` | Flat publication list | Reorganized in place |
| `/posts` | Flat writing list | Preserved as a legacy alias |
| `/posts/[slug]` | Seven writing detail pages | Curated; every prior URL remains either a selected article or a `noindex` archive notice |
| `/surprise` | Terminal quote easter egg | Preserved as part of Lab Mode |

## New and current routes

| Route | Purpose | Status |
| --- | --- | --- |
| `/` | Scientific-editorial homepage | Canonical |
| `/work` | Curated work index | New |
| `/work/oxic-nitrogen-fixation` | Published functional-discovery case study | New |
| `/work/rubisco-active-learning` | Protein-language-model and active-learning case study | New |
| `/work/operational-decision-systems` | Applied-practice record for operational decision systems | New |
| `/work/independent-scientific-ml-advisory` | Compatibility notice for retired advisory content | Preserved as `noindex`; canonical points to `/work` |
| `/research` | Connected research program | New |
| `/publications` | Publications grouped by research program | Canonical, preserved |
| `/writing` | Grouped writing archive | New canonical archive |
| `/posts` | Compatibility copy of writing archive | Preserved, `noindex`, canonical points to `/writing` |
| `/posts/[slug]` | Five selected writing entries plus four archived compatibility pages | Curated; retired DNA and generated-guide URLs preserved as `noindex` |
| `/about` | Narrative professional profile | Canonical, preserved |
| `/lab` | Optional terminal-inspired exploration layer | New |
| `/surprise` | Lab Mode easter egg | Preserved, `noindex` |

## Redirects and removals

No runtime redirect dependency was added. `/posts` remains a rendered compatibility route because static GitHub Pages redirects are otherwise brittle. Content from the advisory page, three generated guide posts, and the older DNA post was retired. Their prior URLs render concise `noindex` compatibility notices rather than returning 404.

## Base-path behavior

`src/utils/paths.ts` builds internal URLs from `import.meta.env.BASE_URL`. Astro configuration remains `base: /foretodata`. The generated route checker rejects root-relative references that escape the base and verifies generated local targets.

Canonical and social URLs use the configured Astro site plus the base-aware path. Assets use the same path helper. Five selected articles remain at `/foretodata/posts/[slug]`; four retired post paths are preserved for inbound links as archive notices.

## Compatibility concerns

- GitHub Pages may normalize trailing slashes; generated pages use directory-style output and work with or without the visible trailing slash.
- Direct client-side routing was not introduced. Every public page is a static HTML file.
- The `/posts` compatibility route intentionally duplicates archive presentation but not the underlying content source.
- Retired-detail compatibility pages use `noindex,follow` and canonical URLs for the current Work or Writing index.
- A future custom-domain migration should update `site` and `base` together and rerun `npm run check:routes`.
