/**
 * Build-time prerendering.
 *
 * Runs after `vite build` (client) and `vite build --ssr` (server entry):
 *   - writes static HTML for every indexable page (/en/, /fr/, case studies),
 *     each with its own <title>, meta description, canonical, hreflang,
 *     Open Graph / Twitter tags and JSON-LD;
 *   - writes the root page (redirects to the visitor's language), 404.html,
 *     robots.txt and — once VITE_SITE_URL is set — sitemap.xml.
 */
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { loadEnv } from 'vite';

const root = process.cwd();
const dist = path.join(root, 'dist');
const ssrDir = path.join(root, 'dist-ssr');
const env = loadEnv('production', root, '');

const server = await import(pathToFileURL(path.join(ssrDir, 'entry-server.js')).href);
const { routes, render, rootHead, notFoundPath, site } = server;
const extra = { googleVerification: env.VITE_GOOGLE_SITE_VERIFICATION?.trim() || undefined };

const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
const HEAD_RE = /<!--app-head-->[\s\S]*?<!--\/app-head-->/;
if (!HEAD_RE.test(template) || !template.includes('<!--app-html-->')) {
  throw new Error('index.html is missing the <!--app-head--> / <!--app-html--> placeholders.');
}

function page({ lang, head, html, pathKey }) {
  return template
    .replace(/<html lang="[^"]*">/, `<html lang="${lang}">`)
    .replace(HEAD_RE, head)
    .replace('<div id="root"><!--app-html--></div>', `<div id="root" data-path="${pathKey}">${html}</div>`);
}

function write(relPath, content) {
  const file = path.join(dist, relPath);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
}

const toFile = (urlPath) => `${urlPath.slice(site.BASE.length)}index.html`;

// 1. Indexable pages
const pages = routes();
for (const urlPath of pages) {
  const r = render(urlPath, extra);
  write(toFile(urlPath), page({ ...r, pathKey: urlPath }));
}

// 2. 404 page (noindex)
const nf = render(notFoundPath, extra);
write('404.html', page({ ...nf, pathKey: notFoundPath }));

// 3. Site root: send visitors to their language. Keeps the English head so
//    links shared to the bare domain still get a proper preview.
const redirectScript = `<script>(function(){var l='${site.DEFAULT_LANG}';try{var s=localStorage.getItem('lang');if(s==='en'||s==='fr'){l=s}else if((navigator.language||'').toLowerCase().indexOf('fr')===0){l='fr'}}catch(e){}location.replace('${site.BASE}'+l+'/'+location.hash)})();</script>`;
const rootHtml = template
  .replace(HEAD_RE, `${rootHead(extra)}\n    ${redirectScript}\n    <noscript><meta http-equiv="refresh" content="0; url=${site.homePath}" /></noscript>`)
  .replace(
    '<div id="root"><!--app-html--></div>',
    `<div id="root"><p style="padding:2rem;font-family:sans-serif"><a href="${site.BASE}en/" hreflang="en">English</a> · <a href="${site.BASE}fr/" hreflang="fr">Français</a></p></div>`,
  )
  .replace(/<script type="module"[^>]*><\/script>/, '');
write('index.html', rootHtml);

// 4. robots.txt (+ sitemap reference once the domain is known)
const robots = ['User-agent: *', 'Allow: /', ''];
if (site.SITE_URL) robots.push(`Sitemap: ${site.SITE_URL}${site.BASE}sitemap.xml`, '');
write('robots.txt', robots.join('\n'));

// 5. sitemap.xml — only with a real domain; never with a placeholder URL.
const sitemapFile = path.join(dist, 'sitemap.xml');
if (site.SITE_URL) {
  const today = new Date().toISOString().slice(0, 10);
  const entries = pages.map((urlPath) => {
    const { alternates } = render(urlPath, extra);
    const links = alternates
      .map((a) => `    <xhtml:link rel="alternate" hreflang="${a.hreflang}" href="${a.href}" />`)
      .join('\n');
    return `  <url>\n    <loc>${site.SITE_URL}${urlPath}</loc>\n    <lastmod>${today}</lastmod>\n${links}\n  </url>`;
  });
  fs.writeFileSync(
    sitemapFile,
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries.join('\n')}\n</urlset>\n`,
  );
} else if (fs.existsSync(sitemapFile)) {
  fs.rmSync(sitemapFile);
}

fs.rmSync(ssrDir, { recursive: true, force: true });

console.log(`Prerendered ${pages.length} pages + root redirect + 404.html.`);
if (site.SITE_URL) {
  console.log(`Domain: ${site.SITE_URL} — sitemap.xml and robots.txt written.`);
} else {
  console.warn(
    '\n⚠ VITE_SITE_URL is not set: canonical/hreflang use relative paths, og:url/og:image are omitted,\n' +
      '  and sitemap.xml is not generated. Set it in .env (or on your host) to your real domain and rebuild.\n',
  );
}
