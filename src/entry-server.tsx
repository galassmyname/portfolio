import { renderToString } from 'react-dom/server';
import App from './App';
import { caseStudies } from './data/projects';
import { parsePath } from './router';
import { getHead, renderHead } from './seo';
import { BASE, DEFAULT_LANG, LANGS, SITE_URL, homePath, projectPath } from './site';

/**
 * Server entry used only by scripts/prerender.mjs at build time.
 * Produces the static HTML and <head> of every indexable page.
 */

/** Every indexable URL: both home pages and each case study in both languages. */
export function routes(): string[] {
  return LANGS.flatMap((lang) => [homePath(lang), ...caseStudies.map((p) => projectPath(lang, p.slug))]);
}

/** URL used to render the generic not-found page (404.html). */
export const notFoundPath = `${homePath(DEFAULT_LANG)}404/`;

export function render(path: string, extra: { googleVerification?: string } = {}) {
  const route = parsePath(path) ?? { lang: DEFAULT_LANG, page: 'notfound' as const };
  const head = getHead(route);
  return {
    lang: route.lang,
    html: renderToString(<App path={path} />),
    head: renderHead(head, extra),
    alternates: head.alternates,
  };
}

/** The English home head, reused for the root redirect page so shared links still preview well. */
export function rootHead(extra: { googleVerification?: string } = {}) {
  return renderHead(getHead({ lang: DEFAULT_LANG, page: 'home' }), extra);
}

export const site = { SITE_URL, BASE, LANGS, DEFAULT_LANG, homePath: homePath(DEFAULT_LANG) };
