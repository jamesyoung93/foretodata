# ForetoData - Terminal-Style Portfolio

A modern, terminal-aesthetic portfolio site built with Astro, featuring a method/industry filter system for showcasing ML/AI work.

![Terminal Aesthetic](https://img.shields.io/badge/aesthetic-terminal-00ff88?style=flat-square)
![Built with Astro](https://img.shields.io/badge/built%20with-Astro-ff5d01?style=flat-square)
![Hosted on GitHub Pages](https://img.shields.io/badge/hosted-GitHub%20Pages-181717?style=flat-square)

## Quick Start

```bash
# Clone / download this repo
git clone https://github.com/YOUR_USERNAME/foretodata.git
cd foretodata

# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
foretodata/
├── src/
│   ├── components/
│   │   └── FilterToggle.jsx    # ← Main interactive filter component
│   ├── layouts/
│   │   └── Base.astro          # ← Terminal-style layout
│   ├── pages/
│   │   ├── index.astro         # ← Homepage
│   │   ├── about.astro         # ← About page
│   │   └── posts.astro         # ← Blog listing
│   └── content/
│       └── accomplishments/    # ← Your work (add markdown files here)
├── public/
│   ├── CNAME                   # ← Custom domain config
│   └── favicon.svg
├── .github/
│   └── workflows/
│       └── deploy.yml          # ← Auto-deploy to GitHub Pages
└── package.json
```

---

## Migration from WordPress

### Step 1: Export WordPress Content

1. Go to WordPress Admin → Tools → Export
2. Select "All content" → Download Export File
3. You'll get an XML file with your posts

### Step 2: Convert Posts to Markdown

Option A: **Manual** (recommended for <20 posts)
- Copy content from each WordPress post
- Create `.md` files in `src/content/blog/`
- Add frontmatter (see template below)

Option B: **Automated**
```bash
# Install converter
npm install -g wordpress-export-to-markdown

# Run conversion
npx wordpress-export-to-markdown --wizard
```

### Step 3: Markdown Post Template

```markdown
---
title: "Your Post Title"
date: 2024-01-15
summary: "A brief description for listings"
tags: ["causal-inference", "tutorial"]
---

Your post content here...
```

### Step 4: Update Your Accomplishments

Edit `src/components/FilterToggle.jsx` and update the `accomplishments` array:

```javascript
const accomplishments = [
  {
    id: 1,
    title: "Your Project Name",
    summary: "Brief description of what you did and the result.",
    methods: ["llms", "mlops"],           // Pick from defined categories
    industries: ["revenue", "operations"], // Pick from defined categories
    details: "Longer description shown when expanded...",
    metrics: ["23% improvement", "$2M saved"],
  },
  // Add more...
];
```

**Available method tags:** `llms`, `interpretable-ml`, `causal-inference`, `mlops`

**Available industry tags:** `revenue`, `operations`, `expansion`, `b2b-sales`, `pricing`, `supply-chain`, `customer-experience`, `retail`, `legal`

(You can add more by editing the `methodCategories` and `industryCategories` objects)

---

## Deployment to GitHub Pages

### Step 1: Create GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Name it `foretodata` (or whatever you want)
3. Make it Public
4. Don't initialize with README (you already have one)

### Step 2: Push Your Code

```bash
cd foretodata-site
git init
git add .
git commit -m "Initial commit: terminal portfolio"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/foretodata.git
git push -u origin main
```

### Step 3: Enable GitHub Pages

1. Go to repo Settings → Pages
2. Source: **GitHub Actions**
3. The workflow will auto-deploy on push

### Step 4: Configure Custom Domain

**In GitHub:**
1. Settings → Pages → Custom domain
2. Enter: `foretodata.com`
3. Check "Enforce HTTPS"

**In your DNS provider (wherever you bought foretodata.com):**

Delete any existing A/CNAME records for the root domain, then add:

| Type  | Name | Value                  |
|-------|------|------------------------|
| A     | @    | 185.199.108.153       |
| A     | @    | 185.199.109.153       |
| A     | @    | 185.199.110.153       |
| A     | @    | 185.199.111.153       |
| CNAME | www  | YOUR_USERNAME.github.io |

DNS propagation takes 15 min to 48 hours. Check status at [dnschecker.org](https://dnschecker.org/).

---

## Customization Guide

### Change Colors

Edit `tailwind.config.mjs`:

```javascript
colors: {
  terminal: {
    bg: '#0a0a0a',        // Background
    accent: '#00ff88',    // Main accent (the green)
    // ... other colors
  },
}
```

### Change Fonts

1. Edit the Google Fonts import in `src/layouts/Base.astro`
2. Update `fontFamily` in `tailwind.config.mjs`

### Add New Pages

Create new `.astro` files in `src/pages/`:

```astro
---
import Base from '../layouts/Base.astro';
---

<Base title="Page Title">
  <Fragment slot="sidebar">
    <!-- Sidebar content -->
  </Fragment>
  
  <!-- Main content -->
</Base>
```

### Add Blog Post Functionality

For a full blog with markdown posts:

1. Create `src/content/config.ts`:
```typescript
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    date: z.date(),
    summary: z.string(),
    tags: z.array(z.string()),
  }),
});

export const collections = { blog };
```

2. Create posts as `.md` files in `src/content/blog/`

3. Query them in your pages:
```astro
---
import { getCollection } from 'astro:content';
const posts = await getCollection('blog');
---
```

---

## Local Development

```bash
npm run dev      # Start dev server at localhost:4321
npm run build    # Build to ./dist
npm run preview  # Preview production build
```

---

## Troubleshooting

**Build fails?**
- Check Node version: `node -v` (need 18+)
- Clear cache: `rm -rf node_modules && npm install`

**Custom domain not working?**
- Verify DNS records are correct
- Check CNAME file contains just `foretodata.com`
- Wait for DNS propagation (up to 48h)

**Styles look wrong?**
- Tailwind classes are case-sensitive
- Check browser dev tools for CSS errors

---

## Credits

- Inspired by [Modal GPU Glossary](https://modal.com/gpu-glossary)
- Built with [Astro](https://astro.build)
- Styled with [Tailwind CSS](https://tailwindcss.com)
- Fonts: JetBrains Mono, Space Grotesk

---

## License

MIT - Do whatever you want with it.
