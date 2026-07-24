# GetUp

AI-focused static website for GetUp (getupdated.tech), with curated AI blogs, legal pages, SEO files, and homepage UI custom styling.

## Project Overview

- Homepage: `index.html`
- Blog listing page: `blogs.html`
- Individual blog posts: `blogs/*.html`
- Global styles: `styles.css`
- Blog styles: `blog-styles.css`
- **Theme layer: `css/theme-terminal.css`**
- Global JS: `script.js`
- SEO/Indexing files: `sitemap.xml`, `robots.txt`
- Legal pages: `privacy-policy.html`, `terms-of-service.html`, `disclaimer.html`

## Theming

The site uses a terminal / code-editor visual theme, implemented as a single
override layer in `css/theme-terminal.css`. It is linked **last in `<head>`**
on every page so it wins the cascade over `styles.css`, `blog-styles.css` and
`css/cookie-consent.css`.

Rules of thumb when editing:

- Change colours by editing the variable blocks at the top of
  `theme-terminal.css` (`:root` / `[data-theme="dark"]` and `[data-theme="light"]`).
  Almost all of `styles.css` is variable-driven, so this propagates site-wide.
- `styles.css` is minified and contains some hardcoded colours plus
  higher-specificity `body.home-v2 …` hero rules. Those are re-matched
  selector-for-selector in section 5 of the theme layer — if a colour looks
  stale, check there before editing `styles.css` directly.
- Fonts are JetBrains Mono (headings, UI, code) + Inter (body prose), loaded
  from Google Fonts in each page's `<head>`.
- Dark mode is the default; `script.js` persists the choice in `localStorage`.

## Current Scope

- Homepage is positioned around coding languages and developer workflow.
- Homepage uses the split-hero layout (`home-v2` classes) with a terminal-window hero visual.
- Existing published posts and their URLs are unchanged; only presentation was restyled.

## Local Editing Workflow

1. Update content in `index.html`, `blogs.html`, and `blogs/*.html`.
2. Update shared styles in `styles.css`.
3. If URLs change, update:
   - `sitemap.xml`
   - `blogs.html` links
   - `index.html` featured links
4. Run quick QA:

```powershell
.\seo-qa-check.ps1
```

Expected result:

```text
PASS: Core SEO and technical checks passed.
```

## Deploy

This is a static site; deploy by publishing repository files as-is to your hosting provider (GitHub Pages / Netlify / Vercel static / cPanel file manager).

## Search Console Notes

For indexing health:

1. Keep `sitemap.xml` updated when content URLs change.
2. Re-submit sitemap in Google Search Console after major content updates.

## Git Quick Commands

```bash
git add -A
git commit -m "Update site content and styling"
git push origin main
```

## Repository

- GitHub: https://github.com/Vijay-C-S/GetUp
