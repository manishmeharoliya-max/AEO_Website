# Frontend architecture

## Where to make changes

| Change                                           | Location                                            |
| ------------------------------------------------ | --------------------------------------------------- |
| Brand name, domain or contact email              | `src/config/brand.js`                               |
| Header links                                     | `src/config/navigation.js`                          |
| Application routes                               | `src/app/AppRoutes.jsx`                             |
| Sitemap route list                               | `src/config/routes.js`                              |
| Page titles and descriptions                     | `src/data/metadata.js`                              |
| Service, industry, FAQ or insight content        | Corresponding file in `src/data/`                   |
| A route's layout and content                     | Corresponding `src/pages/*Page.jsx`                 |
| A homepage section                               | `src/features/home/`                                |
| Shared header and footer                         | `src/components/layout/`                            |
| Contact or audit form layout                     | `src/features/inquiries/components/InquiryForm.jsx` |
| Form field labels, types or required rules       | `src/features/inquiries/data/fields.js`             |
| Field markup and accessibility                   | `src/features/inquiries/components/FormField.jsx`   |
| Form state and submission handlers               | `src/features/inquiries/hooks/useInquiryForm.js`    |
| Form validation                                  | `src/features/inquiries/utils/validateInquiry.js`   |
| Colours, typography and shared layout primitives | `src/app/theme.js` and component Tailwind classes   |
| Breakpoints and reduced-motion rules             | Responsive Tailwind variants in each component      |

## Application flow

`main.jsx` mounts `App`. `App` provides the browser router and `SiteLayout`.
`SiteLayout` owns the shared navigation, metadata, main landmark, footer and
scroll-to-top button. `AppRoutes` selects a page for the current URL.

Pages compose sections and shared components. Home-specific code lives in
`features/home`; inquiry-specific code lives in `features/inquiries`. Shared
components should not depend on page modules. Imports point directly to the
file that owns a component; there are no large catch-all barrel modules.

## Form flow

1. The audit or contact page renders `InquiryForm` with the appropriate variant.
2. `InquiryForm` selects its field definitions and composes the form.
3. `FormField` renders a labelled input, select or textarea with its error.
4. `useInquiryForm` handles input changes, validates on submission and focuses
   the first invalid field.
5. `validateInquiry` returns errors without accessing React, the DOM or a server.
6. A valid submission displays `SuccessMessage`; reset clears all form state.

Fields use named objects (`name`, `label`, `type`, `required`, `options`) so their
meaning is visible when editing them. Submissions remain in component memory.

## Adding a page

Create its component in `src/pages/`, register it in `AppRoutes.jsx`, add its
metadata, and add a public route to `config/routes.js` if it belongs in the
sitemap. Add a navigation entry only when it should appear in the header.

Keep reusable UI in `components/`. Put code specific to a feature inside that
feature's folder. Extract a helper or hook when it has a separate responsibility;
small route components do not need additional abstraction.

## Style and naming conventions

- Use PascalCase for React component files and camelCase for hooks and helpers.
- Keep JSX, conditions and event handlers in readable multiline blocks.
- Prefer descriptive names and named field objects over positional values for new data.
- Keep content separate from rendering when it is reused or edited frequently.
- Use named exports and explicit imports with file extensions.
- Style with Tailwind utilities in JSX; keep responsive and state variants next to their component.
- Keep `src/index.css` limited to the Tailwind import. Shared document defaults belong in `app/theme.js`.
- Use SVG attributes or complete static utility strings for dynamic visuals instead of inline styles.
- Use comments to explain intent or constraints, rather than restating the code.
- Run `npm run format` before committing; `npm run format:check` verifies consistency.

## Verification

Run `npm run build` and `npm test` after changes that affect routing, styles or
forms. The browser suite checks every public route, metadata, navigation, FAQ,
filters, form validation, local-only submission and responsive overflow.

Production deployment details and the intentionally unfinished editorial/team
content are described in the [root README](../../README.md). The homepage URL checker uses the small analysis service described in the root README. Enquiry forms remain local-only.

## Homepage URL checker

`features/aeo-checker/AeoCheckerSection.jsx` owns request state and the URL input.
The `api/` module validates the input and calls the analysis endpoint; components
render the returned score, check evidence and plans. Plan content is defined in
`data/plans.js`. Contact reads the plan ID and website from the query string and
prefills its local enquiry form.

The backend separates public URL fetching (`fetchPublicPage.js`) from pure
scoring (`scorePage.js`) and request handling (`aeoRoutes.js`). Do not remove DNS
validation, address pinning, request deadlines or size limits when extending the
fetcher. Add a test whenever scoring rules or URL handling change.
