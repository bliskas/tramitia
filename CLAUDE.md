# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Tramitia is a lead generation landing page for Latin Americans in Spain who need to apostille documents from their home countries. The site is built as a static site with strong SEO focus.

- **Domain:** tramitia.es (hub) with country subpages (/apostilla-venezuela, /apostilla-argentina, etc.)
- **Stack:** Astro 5 + Tailwind CSS (SSG), Cloudflare Pages
- **Target:** Venezuelan market primarily, expanding to Argentina, Colombia, Ecuador, Peru, Bolivia

## Commands

```bash
npm install      # Install dependencies
npm run dev      # Development server at localhost:4321
npm run build    # Production build
npm run preview  # Preview production build
```

## Architecture

```
src/
├── content/
│   └── blog/                 # Blog posts as markdown files
├── layouts/
│   ├── BaseLayout.astro      # Main layout: SEO meta, header, footer, CookieBanner
│   └── BlogPostLayout.astro  # Blog posts with Article schema
├── lib/
│   └── seo.ts                # Schema.org JSON-LD generators
├── pages/
│   ├── index.astro           # Homepage (generic, country-agnostic)
│   ├── apostilla-*.astro     # Country-specific landing pages
│   ├── aviso-legal.astro     # Legal notice (LSSI-CE required)
│   ├── politica-privacidad.astro  # Privacy policy (RGPD)
│   ├── politica-cookies.astro     # Cookie policy
│   └── blog/                 # Blog index and [slug] pages
├── components/
│   └── CookieBanner.astro    # RGPD cookie consent with analytics toggle
└── styles/
    └── global.css            # Tailwind + custom utilities
```

## Key Technical Patterns

- **SSG only:** All pages statically generated for PageSpeed optimization
- **Blog:** Uses Astro content collections with local markdown files in `src/content/blog/`
- **Schema.org:** Every page must include JSON-LD (FAQ, Breadcrumb, Organization)
- **RGPD compliance:** Cookie banner required before loading Google Analytics
- **Forms:** Submit to n8n webhook which saves to Google Sheets

## Design System

### Colors (tailwind.config.mjs)

| Token | Hex | Usage |
|-------|-----|-------|
| primary | #23265a | Text, headers |
| accent | #ed5823 | CTAs, highlights, icons |
| muted | #bfbfbf | Secondary text, borders |
| muted-light | #f0efef | Section backgrounds |

### Typography

Font: Inter (Google Fonts), weights 400/500/600/700

### CRITICAL: Iconography Rules

- **NEVER use emojis** anywhere in the codebase or output
- Use inline SVG icons only (Heroicons style)
- Icons must be monochromatic using brand colors
- Sizes: 20px inline, 24px cards, 40px+ features

## Code Conventions

### File naming
- Pages: `kebab-case.astro`
- Components: `PascalCase.astro`
- Utilities: `camelCase.ts`

### Commits
```
feat: new functionality
fix: bug fix
content: new content/post
style: styling changes
refactor: code refactoring
docs: documentation
```

## Environment Variables

```env
SITE_URL=https://tramitia.es
WHATSAPP_NUMBER=34XXXXXXXXX
GOOGLE_SHEETS_ID=
```

## Content Language Rules (CRITICAL - ZERO TOLERANCE)

- **ALL content MUST be written in European Spanish (español de España), orthographically correct**
- Every tilde/accent is mandatory: á, é, í, ó, ú, ñ, ü
- Use Spain vocabulary: coste (not costo), móvil (not celular), ordenador (not computadora)
- This applies to: **titles, meta descriptions, Schema.org data, aria-labels, alt text, keywords, body content, FAQs, comments in HTML, button text, placeholder text — EVERYTHING visible or indexable**
- **BEFORE saving ANY file** (.astro, .ts, .md, .json), run a mental spell-check for missing tildes
- Never omit a tilde — it is a critical SEO and credibility issue
- **Common words that MUST have tildes**: información, trámites, guía, guías, más, también, aquí, página, útil, rápida, electrónica, gestión, legalizació, atención, próximamente, menú, navegación, España, país, están, será, está, estás, dónde, cómo, qué, cuál, cuánto, teléfono
- **Opening question marks ¿ and exclamation marks ¡ are MANDATORY** in Spanish
- **SEO titles must be <60 characters** (Google truncates longer titles in SERPs)

## Blog Workflow

- **Drafts**: Posts with `draft: true` in frontmatter are NOT built or published
- **Publishing**: Change `draft: true` to `draft: false`, commit and push
- **New posts**: Create in `src/drafts/blog/` first, move to `src/content/blog/` when approved
- **Skill**: Use `/create-blog-post <tipo> <pais> <documento>` to generate new posts
- **Dates**: Each post should have a unique `publishedDate`, spaced 3+ days apart

## SEO Audit & Roadmap

- Full SEO audit (18 Feb 2026) saved in memory: `memory/seo-audit-feb2026.md`
- Contains: all issues found, priority classification, and 6-phase improvement roadmap
- Key issues: tildes in blog/index.astro, title lengths, author schema type, missing lastmod in sitemap

## Important Notes

- Legal pages have placeholder text `[NOMBRE O RAZÓN SOCIAL]` etc. that must be filled
- WhatsApp number placeholder `34XXXXXXXXX` appears in multiple files
- Cookie consent stores preference in localStorage, key: `cookie_consent`
