import { writeFileSync } from 'node:fs';
import { brand } from '../src/config/brand.js';
import { routes } from '../src/config/routes.js';
writeFileSync(
  'public/robots.txt',
  `User-agent: *\nAllow: /\nSitemap: ${brand.domain}/sitemap.xml\n`,
);
writeFileSync(
  'public/sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map((path) => `\n  <url><loc>${brand.domain}${path}</loc></url>`).join('')}\n</urlset>`,
);
