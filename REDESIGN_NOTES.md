# ForetoData systems-synthesis redesign notes

## July 2026 synthesis revision

The first editorial redesign successfully removed unsupported metrics, duplicated project data, and an overly dominant terminal shell, but it narrowed the public story too far. It made biological discovery primary and represented decision systems only through generalized principles, leaving newer software and product capabilities invisible.

The current revision keeps the scientific credibility and editorial restraint while changing the organizing thesis: James repeatedly represents complex domains as outcomes, controllable levers, observed context, constraints, and uncertainty; simulates interventions; selects a feasible decision; and builds the feedback loop that improves the next one. Decision systems, interactive intelligence, and scientific discovery are now parallel capability lanes. TreeMMM, Insight Harness, private local-LLM development, and AI2Analytics provide concrete system evidence before the scientific case studies and publication record.

## Audit summary

The repository is an Astro 4 static site with React islands and Tailwind. `astro.config.mjs` defines `site: https://jamesyoung93.github.io`, `base: /foretodata`, and static output. GitHub Pages deployment is handled by `.github/workflows/deploy.yml` and runs only for pushes to `main` or a manual workflow dispatch. No deployment configuration was changed in a way that publishes this branch.

The original public route set was small: home, About, Publications, Posts, individual post pages, and Surprise Me. Content came from Astro’s blog collection, hard-coded publication markup, and a hard-coded React accomplishment array. The default shell was a fixed dark terminal sidebar. A “Classic” toggle changed colors but retained the terminal information architecture.

The original homepage hydrated a large animated visualization and a project filter. It loaded 3Dmol and Three.js globally, used continuous animation, and repeated the same projects under multiple filter categories. Several illustrative and project metrics could be mistaken for employer or client outcomes. Sound was already opt-in, which was retained. SEO consisted primarily of a title and one generic description, and internal links were manually hard-coded to `/foretodata/`.

Mobile CSS existed, but the fixed sidebar and wide visualizations were tightly coupled to the original design. The strongest reusable elements were the writing collection, publication record, sound manager, Surprise Me interaction, green terminal accent, command language, and the general idea of technical exploration.

## Intended audience and positioning

The primary audiences are biotechnology founders, scientists, investors, attorneys, executives, collaborators, and current professional colleagues arriving through a warm referral or search.

The desired positioning is senior analytical and product judgment across three connected capability lanes:

1. Decision systems: response modeling, causal inference, scenario simulation, constrained optimization, measurement, and operational implementation.
2. Interactive intelligence: private local LLMs, governed natural-language analytics, adaptive analytical pipelines, and inspectable AI-enabled tools.
3. Scientific discovery: computational biology, gene and protein function, multi-omics, protein representations, active learning, and experimental prioritization.

No one domain is declared primary. Scientific work provides unusually strong evidence of depth; decision and interactive systems provide the more immediately marketable capability surface. Independent advisory remains outside the public positioning.

## Brand architecture

James Young is the primary visible identity. “ForetoData” is a secondary field-notes platform and possible future studio identity. The site does not imply a team, agency infrastructure, broad service capacity, or institutional scale.

The principal message is: “I build extensible intelligence for complex decisions.” The unifying operating pattern is “Represent → Simulate → Decide → Learn.”

## Information architecture

Primary navigation is conventional: Work, Research, Publications, Insights, and About. Lab Mode is discoverable as a secondary utility rather than a primary identity.

The homepage order is hero, organizational horizon, interactive systems lens, three capability lanes, six systems in practice, recent open research, scientific-discovery program, operating pattern, and a minimal footer.

## Visual-system rationale

The default system uses a warm off-white paper surface, charcoal text, deep green and restrained navy accents, Georgia for editorial display typography, system sans-serif for body text, and monospace only for metadata and Lab Mode. Thin rules, a broad grid, figure captions, generous whitespace, and restrained panels evoke a scientific publication and analytical memorandum.

The balance is intentionally approximately 70% editorial restraint, 20% structured technical information, and 10% terminal character. The terminal character is concentrated in labels, paths, the favicon, and Lab Mode.

## Content model and component changes

`src/data/site.ts` is the shared source for profile copy, approach principles, case studies, and publication groups. Editorial cards, detail routes, and Lab Mode import the same case-study objects.

Added components:

- `CaseStudyCard.astro` for consistent selected-work summaries.
- `DiscoveryDiagram.astro` for a lightweight, accessible, explicitly conceptual research workflow.
- `WritingArchive.astro` for the separate earlier-notes archive.
- `LabExplorer.jsx` for accessible project filtering and terminal diagrams.

The old filter, three-dimensional molecular/landscape visualizations, animated hero, and theme toggle were removed after their useful ideas were translated into Lab Mode. They were tightly coupled to the prior design, duplicated project data, carried unsupported illustrative metrics, required global third-party scripts, and added motion and performance costs. The stale generated CSS file under `public/_astro/` was also removed.

## What was retained

- Astro’s static architecture, React integration, Tailwind integration, package lock, and GitHub Pages workflow.
- The `/foretodata/` base-path configuration.
- Three earlier technical notes, with retired post URLs preserved as `noindex` redirects.
- The publication record, reorganized into connected programs.
- The opt-in sound manager and sound control.
- Surprise Me as a Lab Mode easter egg.
- Terminal paths, command labels, ASCII diagrams, green accent, and interactive exploration in Lab Mode.
- The existing terminal favicon as a small continuity marker.

## Lab Mode

Lab Mode is a dedicated `/lab` route rather than the default shell or a color toggle. It provides command navigation, three lightweight analytical diagrams, a keyboard-native project filter, an explicit return to Editorial Mode, an opt-in sound control, and access to Surprise Me.

The mode does not maintain separate case-study content. It reads the same data as Work and links to the same canonical case-study pages. No sound starts automatically. Motion-reduction preferences are respected globally, and Surprise Me bypasses its split-flap animation when reduced motion is requested.

## Important content decisions

- Nitrogen fixation is the flagship application inside a broader functional-discovery program.
- The FOX gene work is presented as computational prioritization with a published evidence link, not as completed experimental validation.
- Rubisco active learning is described as a workflow and linked to its 2026 publication in *AI Chemistry*.
- The Insights page leads with three current Substack essays on trustworthy AI, research and insight generation, and analytical communication. Earlier technical notes remain available through a separate archive link.
- Employer-specific commercial systems and outcomes remain removed from public case-study copy. Decision systems are now evidenced through transferable architecture and public software rather than employer-specific claims.
- Private local-LLM work is described through verified implementation capabilities without linking a private repository or naming a model whose README and code may diverge.
- No inquiry form or scheduling tool was added; LinkedIn remains the contact path.
- No service packages, rates, availability promises, income claims, or revenue claims are published.
- The obsolete Kaggle link in the NFL post was removed after returning 404. The NIST AI RMF link was corrected.

## Social preview

`public/og-systems.png` is a bespoke analytical-editorial card matching the final palette and positioning. It contains “James Young,” “I build decision systems for complex domains,” the three capability lanes, and the four-stage operating pattern. Metadata is generated in `Base.astro` for Open Graph and X/Twitter cards.

## Screenshots

Review captures are stored outside the public site at `review/screenshots/`:

- `homepage-editorial-desktop.png` and `homepage-editorial-mobile.png`
- `homepage-lab-desktop.png` and `homepage-lab-mobile.png`
- `case-study-desktop.png` and `case-study-mobile.png`
- `research-desktop.png` and `research-mobile.png`
- `publications-desktop.png` and `publications-mobile.png`
- `about-desktop.png` and `about-mobile.png`
- `writing-desktop.png` and `writing-mobile.png`

Captures use 1440×1000 and 390×844 viewports and record the first viewport of each page.

## Known limitations and content decisions

- Reconfirm whether “Beyond nif: protein-family modeling reveals the accessory systems of cyanobacterial diazotrophy” is still in submission immediately before any production publication.
- James approved the seniority and degree wording: “A senior applied machine-learning and data-science leader with a PhD in Biological Sciences, specializing in molecular biology.”
- Independent-work positioning and generic confidentiality boilerplate were removed in the second editorial pass.
- Employer names, unsupported performance metrics, the NSF award amount, and honors remain omitted as deliberate positioning decisions.
- The browser automation surface could not synthesize a reliable end-to-end Tab sequence, so a short manual keyboard pass is still recommended before merge.
- External publisher sites sometimes reject automated HEAD requests even when DOI redirects are valid; those links should receive a final human click-through review.

## Future compatibility

A future Advisory page should be added only if there is approved evidence, a clear operating model, and a reason for it to become part of the public positioning.

Stage 3 can elevate ForetoData to the primary brand, add a team or specialist network, and expand institutional capabilities only after the organization exists. The current separation between person identity, platform label, shared work data, and routes supports that evolution without implying it today.
