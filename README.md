# GetUp

AI-focused static website for GetUp (getupdated.tech), with curated AI blogs, legal pages, SEO files, and homepage UI custom styling.

## Project Overview

- Homepage: `index.html`
- Blog listing page: `blogs.html`
- Individual blog posts: `blogs/*.html`
- Global styles: `styles.css`
- Blog styles: `blog-styles.css`
- **Theme layer: `css/theme-terminal.css`**
- **JS entry point: `js/main.js`** (bundled via esbuild → `script.js`)
- SEO/Indexing files: `sitemap.xml`, `robots.txt`, `blogs.xml` (RSS)
- Legal pages: `privacy-policy.html`, `terms-of-service.html`, `disclaimer.html`

## Quick Start

```bash
npm install
npm run build   # bundles js/main.js → script.js
npm run qa      # runs SEO validation
```

## Build System

The site uses **esbuild** to bundle ES6 modules from `js/main.js` into the single `script.js` that browsers load.

```
js/main.js  ──esbuild──►  script.js
js/*.js       (bundle)    (site uses this)
```

| Command | Description |
|---------|-------------|
| `npm run build` | Bundle JS modules into `script.js` |
| `npm run build:watch` | Watch mode for development |
| `npm run lint` | Run ESLint on JS modules |
| `npm run qa` | Run PowerShell SEO validation |
| `npm run ci` | Lint + QA (used by GitHub Actions) |

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

## Local Editing Workflow

1. Update content in `index.html`, `blogs.html`, and `blogs/*.html`.
2. Update shared styles in `styles.css`.
3. **After editing JS modules in `js/`**, run `npm run build` to regenerate `script.js`.
4. If URLs change, update:
   - `sitemap.xml`
   - `blogs.html` links
   - `index.html` featured links
   - `blogs.xml` (RSS feed)
5. Run quick QA:

```powershell
.\seo-qa-check.ps1
```

Expected result:

```text
PASS: Core SEO and technical checks passed.
```

## Deploy

This is a static site; deploy by publishing repository files as-is to your hosting provider (GitHub Pages / Netlify / Vercel static / cPanel file manager).

**Important:** Always run `npm run build` before deploying to ensure `script.js` is up to date with your latest `js/` module changes.

## Search Console Notes

For indexing health:

1. Keep `sitemap.xml` updated when content URLs change.
2. Re-submit sitemap in Google Search Console after major content updates.
3. The RSS feed at `blogs.xml` provides another crawl path for search engines.

## RSS Feed

Subscribe to `blogs.xml` in any RSS reader to get new posts as soon as they're published.

## Git Quick Commands

```bash
npm run build       # bundle JS (required before committing)
git add -A
git commit -m "Update site content and styling"
git push origin main
```

## Repository

- GitHub: https://github.com/Vijay-C-S/GetUp