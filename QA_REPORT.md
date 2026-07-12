# ForetoData redesign QA report

Review date: 2026-07-12 (America/New_York)

## Build, type-check, lint, and tests

- Production build: passed with 22 static HTML pages after the second editorial pass and compatibility review.
- Astro type-check: passed with zero errors. Legacy unused-component hints were resolved before finalization.
- Lint: no standalone lint script exists in the preserved repository. `astro check` is the repository-native static diagnostic.
- Automated tests: no unit-test framework existed. A dependency-free static route/link checker was added at `scripts/check-site.mjs` and is available through `npm run check:routes`.
- Deployment: GitHub Pages deploys merges to `main`; production status is verified after each release.

## Routes and internal links

- The generated-site checker validates every HTML `href` and `src` beneath `/foretodata/`.
- It rejects root-relative paths that escape the GitHub Pages base.
- The checked build produced no missing internal targets.
- `/posts` is preserved as a `noindex` redirect with canonical `/writing`.
- Three `/posts/[slug]` essays remain available. Six retired post URLs redirect to Writing, and the retired advisory URL redirects to Work. `/surprise` also remains available.

## External links

External references were checked with concurrent HTTP requests and targeted browser/web verification.

- A broken lowercase NIST AI RMF path was corrected to `NIST.AI.100-1.pdf`.
- An unavailable Kaggle notebook URL returned 404 and was removed rather than replaced with an unverified link.
- Nature, arXiv, Open PRAIRIE, Scholar, Substack, OWASP, OpenAI, Anthropic, and the Cell Reports DOI resolved.
- Wiley and MDPI DOI destinations rejected automated HEAD requests with 403 after a valid redirect; retain for human click-through review.
- LinkedIn rejects HEAD with 405 but remains the existing public profile URL.
- Both 2026 bioRxiv DOI links resolved to official preprint pages with HTTP 200. MDPI continues to reject automated clients with 403 even though the official DOI records are valid.
- All newly supplied Google Scholar publication-record links returned HTTP 200 during the 2026-07-11 content update.

## Mobile and responsive review

Browser review used 1440×1000 desktop and 390×844 mobile viewports for the homepage in both modes, one case study, Research, Publications, About, and Writing.

The first mobile pass found a two-pixel horizontal overflow caused by `100vw` including the browser scrollbar. The navigation width was changed to its containing block. All seven reviewed mobile routes subsequently reported `scrollWidth === clientWidth` (375 CSS pixels in the browser surface).

Cards, publication rows, diagrams, case-study navigation, footer links, and Lab Mode controls collapse to single-column layouts at small widths. No critical content depends on hover.

## Accessibility review

- Semantic landmarks: header/banner, primary navigation, main, named regions, article elements, asides, and footer are present.
- Heading hierarchy: every reviewed route has exactly one H1; section/article headings follow without skipped levels after corrections to Writing and Lab Mode cards.
- Skip link: first in the document and revealed on focus.
- Focus: a high-contrast 3px orange focus indicator is applied globally with `:focus-visible`.
- Controls: Lab Mode filters and sound controls are native buttons with accessible names and pressed state where applicable. Project cards and navigation are native links.
- Lab filter behavior: browser click testing reduced three records to the two Biological discovery records and updated `aria-pressed`.
- Images/diagrams: the research diagram has a useful accessible description and a caption that labels it conceptual. Decorative ASCII is hidden from assistive interpretation where appropriate.
- Contrast calculations: charcoal on paper 14.64:1; muted body copy on paper 5.48:1; deep-green links on paper 9.12:1; Lab secondary text 9.72:1; Lab green 13.54:1; Lab primary text 15.08:1.
- Keyboard limitation: the browser automation surface did not synthesize a reliable sequential Tab traversal. Native controls, DOM order, skip link, focus styles, and button semantics were reviewed, but a brief human Tab/Shift+Tab pass remains recommended before merge.

## Reduced motion and sound

- Global `prefers-reduced-motion: reduce` CSS disables nonessential animation and transitions and restores immediate scrolling.
- Surprise Me detects reduced-motion preference and renders final text without split-flap animation.
- No animation library was added.
- Sound remains opt-in. Lab Mode exposed the accessible label “Enable sounds,” and the reviewed DOM contained no audio element or autoplay behavior.
- The global layout no longer initializes audio or loads visualization scripts. Sound code hydrates only where the Lab control exists.

## Metadata and social preview

Browser inspection confirmed each reviewed route has a unique title, description, canonical URL, Open Graph title, exactly one H1, and base-aware metadata.

`public/og.png` is a site-specific social card. `Base.astro` supplies Open Graph and X/Twitter large-card metadata with absolute URLs derived from the configured site and base path. Compatibility and easter-egg routes use `noindex` where appropriate.

## Performance review

- The default Editorial homepage is static and references no client-side JavaScript bundle.
- Global 3Dmol, Three.js, Google Font requests, animated hero hydration, and repeated project-filter hydration were removed.
- Lab Mode loads React only for its optional filter and sound control. The build reports a 135.6 kB raw React client chunk, a 9.2 kB Lab explorer chunk, and a 2.0 kB sound-control chunk; gzip sizes are materially smaller.
- The social image is the largest static asset and is loaded only by link-unfurl clients, not in the visible page.
- The stale generated CSS copy under `public/_astro/` was removed.

## Adversarial positioning review

### Biotechnology founder

The specialization is legible in the hero within one sentence. A founder can identify candidate prioritization, experimental translation, and functional discovery as core strengths. Senior judgment is conveyed through problem framing and published work rather than service claims.

Fix applied: removed independent-advisory positioning and generic confidentiality boilerplate. Three published open papers now follow Selected Work on the homepage.

### Senior scientist

The research identity is coherent around functional discovery in undercharacterized microbial systems. Nitrogen fixation is explicitly a flagship application rather than the whole identity. Computational prioritization is distinguished from experimental validation. Publications are grouped by program, and unpublished statuses are marked for review.

Fix applied: removed illustrative enzyme-performance metrics. The Rubisco workflow now links to its 2026 *AI Chemistry* publication without implying additional experimental results beyond the scholarly record.

### Investor or attorney

The site demonstrates diligence-oriented reasoning through evidence provenance, uncertainty, stopping rules, and decision framing. Published claims link to their records, and unpublished status is stated directly.

Fix applied: removed client and employer names, unattributed commercial metrics, and generic confidentiality language from work records.

### Corporate executive

The site presents strategic analytical leadership through decision rights, operating constraints, adoption, measurement, and iteration. It does not offer commercial-pharma consulting and does not resemble a side-business sales funnel.

Fix applied: About now connects scientific depth, operational judgment, and translation without introducing a separate advisory narrative.

### Current employer or colleague

No employer endorsement is implied in the redesigned public copy. Internal platforms, brands, and commercial results are absent. The site does not present an external advisory offer.

Resolution: the editorial passes removed the advisory content, homepage and About sections, and footer link. The prior route redirects to Work.

## Screenshots

Fourteen non-public captures from the initial redesign remain in `review/screenshots/`. Browser review was repeated at 1440x1000 and 390x844 for the changed homepage and Writing layouts during the second pass, with additional mobile checks for Publications and About.

## Remaining limitations

- The “Beyond nif” submission status can change and requires a final owner confirmation immediately before production publication.
- Automated external checks cannot prove that bot-protected publisher pages work in every user browser.
- Browser review covered one representative desktop and mobile viewport rather than a device matrix.
- A manual keyboard traversal and screen-reader spot check are still recommended before merge.
- No Lighthouse run was available in the connected browser surface; performance conclusions use build output, request architecture, and bundle inspection.
