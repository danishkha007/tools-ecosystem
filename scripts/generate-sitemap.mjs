import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const toolDataPath = join(rootDir, 'src/app/core/data/tool-data.json');
const sitemapPath = join(rootDir, 'public/sitemap.xml');

const siteUrl = normalizeSiteUrl(process.env.SITE_URL || 'https://mytooltrove.com');
const lastmod = process.env.SITEMAP_LASTMOD || new Date().toISOString().slice(0, 10);

const staticPages = [
  { route: '/', changefreq: 'daily', priority: '1.0' },
  { route: '/about', changefreq: 'monthly', priority: '0.8' },
  { route: '/contact', changefreq: 'monthly', priority: '0.7' },
];

const categoryOrder = [
  'trading-tools',
  'career-tools',
  'pdf-tools',
  'image-tools',
  'developer-tools',
  'design-tools',
  'calculator-tools',
  'utility-tools',
  'other-tools',
];

const categoryChangefreq = new Map([
  ['pdf-tools', 'monthly'],
  ['trading-tools', 'daily'],
  ['career-tools', 'weekly'],
  ['image-tools', 'weekly'],
  ['developer-tools', 'weekly'],
  ['utility-tools', 'weekly'],
  ['calculator-tools', 'weekly'],
]);

const categoryPriority = new Map([
  ['trading-tools', '1.0'],
  ['career-tools', '1.0'],
  ['pdf-tools', '1.0'],
  ['image-tools', '0.9'],
  ['developer-tools', '0.9'],
  ['utility-tools', '0.8'],
  ['calculator-tools', '0.8'],
]);

const toolData = JSON.parse(await readFile(toolDataPath, 'utf8'));
const activeCategories = [...new Set(toolData.tools.map(tool => tool.category))]
  .sort((a, b) => categorySortOrder(a) - categorySortOrder(b));
const categoryPages = activeCategories.map(category => ({
  route: `/tools/${categorySlug(category)}`,
  changefreq: 'weekly',
  priority: '0.8',
}));
const toolPages = toolData.tools.map(tool => ({
  route: tool.route,
  loc: tool.seo?.canonicalUrl,
  changefreq: categoryChangefreq.get(tool.category) || 'weekly',
  priority: categoryPriority.get(tool.category) || '0.8',
}));

const entries = [...staticPages, ...categoryPages, ...toolPages].map(page => ({
  loc: page.loc || toAbsoluteUrl(page.route),
  lastmod,
  changefreq: page.changefreq,
  priority: page.priority,
}));

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map(toUrlXml).join('\n')}
</urlset>
`;

await writeFile(sitemapPath, sitemap);
console.log(`Generated ${sitemapPath} with ${entries.length} URLs.`);

function toUrlXml(entry) {
  return `  <url>
    <loc>${escapeXml(entry.loc)}</loc>
    <lastmod>${escapeXml(entry.lastmod)}</lastmod>
    <changefreq>${escapeXml(entry.changefreq)}</changefreq>
    <priority>${escapeXml(entry.priority)}</priority>
  </url>`;
}

function toAbsoluteUrl(route) {
  const path = route.startsWith('/') ? route : `/${route}`;
  return `${siteUrl}${path === '/' ? '/' : path}`;
}

function normalizeSiteUrl(url) {
  return url.replace(/\/+$/, '');
}

function categorySortOrder(category) {
  const index = categoryOrder.indexOf(category);
  return index === -1 ? Number.MAX_SAFE_INTEGER : index;
}

function categorySlug(categoryName) {
  return categoryName.split('-')[0]
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function escapeXml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}
