# SkyClear Site

The public website for SkyClear Analytics, hosted at **skyclear.info**.

A static multi-page HTML/CSS/JS site. No build step, no framework. Each tool
lives in its own folder under `/tools/<category>/<tool>/` and is fully
self-contained.

## Structure

```
/
├── index.html               Landing page
├── about.html               About SkyClear
├── services.html            Custom dashboards & consulting offering
├── case-studies.html        Past work / examples
├── contact.html             Get in touch
├── assets/
│   ├── css/skyclear.css     Shared brand stylesheet (used by every page)
│   ├── js/skyclear.js       Tiny loader that injects header/footer partials
│   └── img/                 Logos, illustrations, etc.
├── partials/
│   ├── header.html          Shared site header (nav)
│   └── footer.html          Shared site footer
└── tools/
    ├── index.html           Tool catalog (all tools, grouped by category)
    ├── real-estate/
    │   └── rent-vs-buy/     Existing calculator (copied in from main repo)
    ├── personal-finance/    (empty — future tools land here)
    └── business/            (empty — future tools land here)
```

## How shared chrome works

Every page contains:

```html
<div data-include="header"></div>
...
<div data-include="footer"></div>
<script src="/assets/js/skyclear.js"></script>
```

The loader script fetches the matching `partials/<name>.html` at runtime,
rewrites `{{BASE}}` placeholders so links resolve correctly regardless of
page depth, and injects the markup. Update header.html or footer.html to
change nav everywhere.

Trade-off: the chrome flashes in slightly after first paint. Acceptable
for now; can be replaced with a static-site generator (Eleventy, Astro)
later if it becomes a problem.

## Local preview

From this directory:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000/ in a browser. The included header/footer
partials only work over HTTP (fetch() doesn't work on file:// URLs).

## Deploy

Target: Cloudflare Pages, custom domain skyclear.info.

Setup (one-time):
1. Push this directory to a GitHub repo.
2. In Cloudflare dashboard, Pages → Create a project → Connect to Git.
3. Build settings: framework = none, build command = (none), output
   directory = `/` (this folder).
4. Add custom domain `skyclear.info` once DNS is delegated to Cloudflare.

After that, every push to `main` auto-deploys.

## Adding a new tool

1. Drop the tool's HTML/CSS/JS into `tools/<category>/<tool-name>/`.
2. Add a card to the relevant section in `tools/index.html`.
3. Optionally feature it on the landing page's tools grid in `index.html`.
4. Commit. Done.

## Related repos / projects

- **Rent vs. Buy Calculator** lives at
  `/Users/johnyarbro/Documents/Claude/Projects/Rent vs. Buy Calculator/`.
  The Python data pipeline stays there. When the calculator's frontend
  changes, copy `web/index.html` and `web/dashboard_data.json` over to
  `tools/real-estate/rent-vs-buy/`. (Future: automate this with a deploy
  script.)
