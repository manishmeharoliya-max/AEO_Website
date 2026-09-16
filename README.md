# AnswerEdge

A complete, responsive Answer Engine Optimization agency frontend. The frontend project lives in `website/`. Paths below are relative to that folder.

Built with React, JavaScript, Vite, Tailwind CSS and Lucide icons. Navigation uses React Router. The homepage URL checker connects to a small Node/Express analysis service in `backend/`; contact and audit enquiry forms still keep their data locally.

## Run locally

Requires Node.js 22.19+ (Node.js 24 recommended) and npm. Run the analysis service and frontend in two terminals from the repository root.

**Terminal 1 ? analysis service (no database required):**

```bash
cd backend
npm install
npm run start:audit
```

**Terminal 2 ? frontend:**

```bash
cd website
npm install
npm run dev
```

Open the local URL printed by Vite (normally http://localhost:5173).

```bash
npm run build
npm run preview
```

The production output is `dist/`. The build also regenerates `public/robots.txt` and `public/sitemap.xml` from the domain in `src/config/brand.js` and routes in `src/config/routes.js`.

## Structure

```text
website/
  public/                       Static assets and crawl files
  scripts/generate-seo.js        Generates robots.txt and sitemap.xml
  src/
    app/                        App composition, routes and shared Tailwind theme
    components/
      layout/                   SiteLayout, Navbar, MobileMenu, Footer, Logo
      common/                   SEO, headings, accordion and shared sections
      cards/                    ServiceCard, IndustryCard and BlogCard
      ui/                       Button, Icon and CheckList
    config/                     Brand, route paths and navigation
    data/                       Content grouped by subject
    features/
      home/                     Homepage sections and visual components
      aeo-checker/              URL input, API client, report and USD plan cards
      inquiries/
        components/             Forms, fields and submission confirmation
        data/                   Named form field definitions
        hooks/                  Form state and event handlers
        utils/                  Pure validation functions
    pages/                      Route pages; legal routes share one template
    index.css                   Tailwind import only; no custom CSS rules
    utils/                      Shared pure helpers
    main.jsx                    React entry point
  tests/site.spec.js             Browser regression checks
  docs/ARCHITECTURE.md           Folder responsibilities and contribution guide
  .editorconfig                 Editor whitespace settings
  .prettierrc.json               Shared formatting rules
  playwright.config.js
  vite.config.js
  vercel.json
  index.html
```

## Routes

`/`, `/services`, `/aeo-audit`, `/industries`, `/about`, `/insights`, `/insights/:slug`, `/contact`, `/privacy-policy`, `/terms-and-conditions`. Unknown routes and unknown insight slugs show the custom 404 view.

## Features

- Sticky header, active links, mobile menu with Escape dismissal, skip link and scroll-to-top control.
- Accessible FAQ accordion and interactive insight category filters.
- Nine editorial insight previews, with dynamic routes; full articles are intentionally marked as being prepared.
- Native form controls with JavaScript validation, field-specific errors and local success states.
- Responsive Tailwind visuals; no custom stylesheets, inline style props, remote fonts or heavy UI libraries.
- Route titles, descriptions, canonical URLs and JSON-LD for Organization, WebSite, Service, BreadcrumbList and Article previews. Preview schema does not claim a publication date or author.
- Reduced-motion support and visible keyboard focus states.

## Form behaviour

Contact and audit enquiry form values and submissions exist only in component memory. These forms do not make a POST request, send email or write to storage. The separate homepage URL checker makes a POST request to `/api/aeo/analyze` to fetch and analyse the supplied public page. Navigating away or reloading clears the information. The requested audit confirmation is accompanied by a clear demo notice so visitors understand that no follow-up is scheduled.

## Browser checks

The configuration uses an installed Microsoft Edge browser:

```bash
npx playwright test
```

On systems without Edge, remove `channel: 'msedge'` from `playwright.config.js`, then run `npx playwright install chromium`. Tests cover every route, titles and headings, homepage links and section anchors, FAQ toggling, category filtering, valid and invalid forms, local-only submission, mobile navigation and overflow at 360, 390, 768 and 1280 pixels. Screenshots are saved alongside test results in `test-results/`.

## Customisation and launch

1. Update `src/config/brand.js` for the brand, real domain and contact email; adjust the static title in `index.html` and favicon as needed.
2. Edit content in `src/data/` and route-specific copy in `src/pages/`.
3. Replace the explicitly marked team, email and article placeholders. Review the legal pages for the actual business and hosting practices.
4. Enquiry forms remain demonstrations until a delivery integration is built. The URL checker has its own backend endpoint; it does not send enquiries or accept payments.
5. Deploy `dist/` to static hosting. Netlify and Vercel fallback configurations are included. Other hosts must serve `index.html` for application routes.

Metadata is updated client-side. For reliable search indexing and social previews across all crawlers, prerendering or server rendering is a future deployment enhancement. Static hosting may return HTTP 200 for the client-rendered 404 view.

Run `backend/audit-server.js` for the checker without starting the unrelated authentication/database services. The same route is also mounted in the existing main backend server.

## Formatting and maintenance

```bash
npm run format        # Format source, styles, configuration and documentation
npm run format:check  # Check formatting without modifying files
npm test              # Run the existing browser regression suite
```

Read [the architecture guide](website/docs/ARCHITECTURE.md) before adding a page or feature.

## Live URL checker and USD plans

Home flow: URL input ? computed score ? observed issues and recommended fixes ? three plans ? contact form with the selected plan and website prefilled.

- Starter: from **$199 one-time**, up to 5 priority pages, audit and recommendations.
- Growth: from **$499/month**, initial roadmap for up to 10 priority pages, ongoing optimisation.
- Authority: from **$999/month**, initial roadmap for up to 25 priority pages, broader research and optimisation.

Starting prices and deliverables are editable in `website/src/data/plans.js`. These are initial business pricing settings, not market-verified quotes. Final scope is agreed after review. Plan buttons request a discussion; no subscription, charge or checkout is created.

### What the score measures

Ten transparent checks award a total of 100 points: HTTPS (5), title (10), description (10), H1 (10), H2 sections (10), answer-oriented paragraph structure (15), parseable JSON-LD (15), identity links (10), contact links (10), and absence of page-level noindex directives (5).

The server reads the submitted page's initial HTML. This is a rules-based readiness indicator, not an official AEO metric, a content-accuracy review, a complete site audit or a prediction of recommendations from ChatGPT or Google. The checker uses English heading and link patterns. It does not execute JavaScript, check robots.txt or measure actual citations. Thin JavaScript shells, access challenges and unreadable pages return an error instead of a fabricated score.

The free result shows the measured score and points missed by failed checks. After a plan order is submitted, checkout rescans the supplied website and shows a separately labeled illustrative score if selected failed checks were fixed. Submitting an order does not change the measured score or activate payment. Visitors can rescan after changes are live to get a new measured score.

The URL fetcher only allows public HTTP(S) addresses, verifies DNS again after redirects, pins the resolved address, rejects private and reserved destinations, caps redirects and response size, and uses a 12-second deadline. The endpoint limits request bursts and concurrent requests. URLs, HTML and reports are not persisted by the application. Rate-limit counters are held briefly in memory; hosting access logs are separate.

### Server files

```text
backend/
  audit-server.js                    Standalone analysis server; default port 5001
  src/routes/aeoRoutes.js            POST /api/aeo/analyze
  src/services/aeo/
    fetchPublicPage.js               Validated, bounded public-page fetch
    scorePage.js                     Explainable page checks and score
  test/aeo.test.js                   Scoring, URL validation and API tests
```

### Production connection

Deploy the audit server to a Node host with outbound HTTP(S) access. Set `AEO_PORT` to its listening port and `AEO_CLIENT_ORIGIN` to the deployed frontend origin. In the frontend build environment, set `VITE_AEO_API_URL=https://your-audit-api.example` (origin only, no `/api` suffix). Rebuild the frontend after changing that variable. Vite's local proxy works during development only; static hosting by itself cannot perform the URL analysis. A sample frontend env file is included as `.env.example`.

The in-memory rate limit is per process. For multiple server instances, use shared rate limiting and configure trusted proxies only for the actual deployment infrastructure.

### Checker verification

```bash
# From backend/
npm run test:aeo

# From website/
npm test
```

Browser tests use deterministic API fixtures for success, errors, plan selection and mobile layouts. Backend tests independently verify actual score computation, redirects, unsafe URL rejection and rate limiting. A live request through the Vite proxy to `https://example.com` was also verified during setup.

## Tailwind styling

All page and component styling lives in JSX `className` utilities. Responsive
variants, focus/hover states and reduced-motion preferences are included there.
Long class lists are split into readable string arrays. Shared typography and
interaction defaults live in `src/app/theme.js`.

`src/index.css` contains only `@import 'tailwindcss';`, the Tailwind entry point.
There are no custom CSS selectors, CSS modules, styled-components or inline
`style` props. The score ring uses SVG attributes for its dynamic value; preview
bars use complete, statically declared Tailwind width and height classes.

Use complete class strings when adding conditional styles so Tailwind can find
them at build time. Existing semantic class markers also support tests and
state-dependent variants; they do not reference a separate stylesheet.
