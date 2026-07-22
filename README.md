# GetUp

AI-focused static website for GetUp (getupdated.tech), with curated AI blogs, legal pages, SEO files, and homepage UI custom styling.

## Project Overview

- Homepage: `index.html`
- Blog listing page: `blogs.html`
- Individual blog posts: `blogs/*.html` (currently the four earliest AI posts)
- Global styles: `styles.css`
- Blog styles: `blog-styles.css`
- Global JS: `script.js`
- SEO/Indexing files: `sitemap.xml`, `robots.txt`
- Legal pages: `privacy-policy.html`, `terms-of-service.html`, `disclaimer.html`

## Current Scope

- Site content is AI-blog focused, with only the four earliest published blog posts retained.
- Newer blog pages were removed from the active listing/sitemap flow and from `blogs/`.
- Homepage uses the redesigned split-hero layout (`home-v2` classes).

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
