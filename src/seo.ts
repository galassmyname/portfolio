import { education, profile } from './data/profile';
import { allRepos, findProject, hasCaseStudy, repoUrl } from './data/projects';
import { localizeProject } from './data/projects.fr';
import { ui, type Lang } from './i18n/ui';
import type { Route } from './router';
import { pathFor } from './router';
import { BASE, DEFAULT_LANG, LANGS, SITE_URL, absoluteUrl, homePath, preferAbsolute } from './site';

/**
 * Everything a page needs in <head> for search engines and social previews,
 * derived only from the portfolio's own data. Used both by the build-time
 * prerender (static HTML) and in the browser after client-side navigation.
 */
export type Head = {
  lang: Lang;
  title: string;
  description: string;
  robots: string;
  canonical: string;
  alternates: { hreflang: string; href: string }[];
  og: { type: string; url: string | null; image: string | null; imageAlt: string; locale: string; localeAlt: string };
  jsonLd: object;
};

const OG_LOCALE: Record<Lang, string> = { en: 'en_US', fr: 'fr_FR' };
const OG_IMAGE_PATH = `${BASE}og-image.png`;

/** Shortens text to a meta-description length on a word boundary. */
function clip(text: string, max = 158) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:—–-]$/, '')}…`;
}

function personNode(lang: Lang) {
  const t = ui[lang];
  const home = absoluteUrl(homePath(lang));
  return {
    '@type': 'Person',
    ...(SITE_URL && { '@id': `${SITE_URL}${BASE}#person` }),
    name: profile.name,
    ...(home && { url: home }),
    ...(SITE_URL && { image: `${SITE_URL}${profile.photo}` }),
    jobTitle: profile.jobTitle[lang],
    description: t.seo.description,
    address: { '@type': 'PostalAddress', addressLocality: 'Dakar', addressCountry: 'SN' },
    // Only institutions where a programme is completed (in-progress training is not "alumni").
    alumniOf: [...new Set(education.filter((e) => !e.inProgress).map((e) => e.institution))].map((name) => ({
      '@type': 'CollegeOrUniversity',
      name,
    })),
    knowsAbout: t.seo.knowsAbout,
    sameAs: [profile.githubUrl, profile.linkedinUrl],
  };
}

export function getHead(route: Route): Head {
  const { lang } = route;
  const t = ui[lang];
  const project = route.page === 'project' ? findProject(route.slug) : undefined;
  const isCaseStudy = project && hasCaseStudy(project);
  const indexable = route.page === 'home' || Boolean(isCaseStudy);

  const pagePath = route.page === 'notfound' || (route.page === 'project' && !isCaseStudy) ? homePath(lang) : pathFor(route, lang);
  const alternates = indexable
    ? [
        ...LANGS.map((l) => ({ hreflang: l, href: preferAbsolute(pathFor(route, l)) })),
        { hreflang: 'x-default', href: preferAbsolute(pathFor(route, DEFAULT_LANG)) },
      ]
    : [];

  const base = {
    lang,
    robots: indexable ? 'index, follow, max-image-preview:large' : 'noindex, follow',
    canonical: preferAbsolute(pagePath),
    alternates,
  };
  const ogBase = {
    url: absoluteUrl(pagePath),
    image: absoluteUrl(OG_IMAGE_PATH),
    imageAlt: t.seo.ogImageAlt,
    locale: OG_LOCALE[lang],
    localeAlt: OG_LOCALE[lang === 'en' ? 'fr' : 'en'],
  };

  if (project && isCaseStudy) {
    const p = localizeProject(project, lang);
    const url = absoluteUrl(pathFor(route, lang));
    return {
      ...base,
      title: `${p.name} | ${profile.name}`,
      description: clip(p.description),
      og: { ...ogBase, type: 'article' },
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'SoftwareSourceCode',
        name: p.name,
        description: p.description,
        ...(url && { url }),
        codeRepository: repoUrl(p),
        ...(allRepos(p).length > 1 && { sameAs: allRepos(p).slice(1).map((repo) => repoUrl({ repo })) }),
        keywords: p.technologies.join(', '),
        inLanguage: lang,
        dateCreated: String(p.year),
        author: personNode(lang),
      },
    };
  }

  if (route.page === 'home') {
    const url = absoluteUrl(homePath(lang));
    return {
      ...base,
      title: t.seo.title,
      description: t.seo.description,
      og: { ...ogBase, type: 'profile' },
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'ProfilePage',
        name: t.seo.title,
        ...(url && { url }),
        inLanguage: lang,
        mainEntity: personNode(lang),
      },
    };
  }

  return {
    ...base,
    title: `${t.caseStudy.notFoundTitle} | ${profile.name}`,
    description: t.seo.description,
    og: { ...ogBase, type: 'website' },
    jsonLd: { '@context': 'https://schema.org', '@type': 'WebPage', name: t.caseStudy.notFoundTitle, inLanguage: lang },
  };
}

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Serialises JSON-LD safely inside a <script> tag. */
export const jsonLdText = (data: object) => JSON.stringify(data).replace(/</g, '\\u003c');

/** <head> markup for the prerendered HTML. */
export function renderHead(h: Head, extra: { googleVerification?: string } = {}): string {
  const tags = [
    `<title>${esc(h.title)}</title>`,
    `<meta name="description" content="${esc(h.description)}" />`,
    `<meta name="robots" content="${h.robots}" />`,
    `<link rel="canonical" href="${esc(h.canonical)}" />`,
    ...h.alternates.map((a) => `<link rel="alternate" hreflang="${a.hreflang}" href="${esc(a.href)}" />`),
    `<meta property="og:site_name" content="${esc(profile.name)}" />`,
    `<meta property="og:type" content="${h.og.type}" />`,
    `<meta property="og:title" content="${esc(h.title)}" />`,
    `<meta property="og:description" content="${esc(h.description)}" />`,
    h.og.url && `<meta property="og:url" content="${esc(h.og.url)}" />`,
    `<meta property="og:locale" content="${h.og.locale}" />`,
    `<meta property="og:locale:alternate" content="${h.og.localeAlt}" />`,
    h.og.image && `<meta property="og:image" content="${esc(h.og.image)}" />`,
    h.og.image && `<meta property="og:image:type" content="image/png" />`,
    h.og.image && `<meta property="og:image:width" content="1200" />`,
    h.og.image && `<meta property="og:image:height" content="630" />`,
    h.og.image && `<meta property="og:image:alt" content="${esc(h.og.imageAlt)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(h.title)}" />`,
    `<meta name="twitter:description" content="${esc(h.description)}" />`,
    h.og.image && `<meta name="twitter:image" content="${esc(h.og.image)}" />`,
    h.og.image && `<meta name="twitter:image:alt" content="${esc(h.og.imageAlt)}" />`,
    extra.googleVerification && `<meta name="google-site-verification" content="${esc(extra.googleVerification)}" />`,
    `<script type="application/ld+json">${jsonLdText(h.jsonLd)}</script>`,
  ];
  return tags.filter(Boolean).join('\n    ');
}

/** Keeps <head> in sync after client-side navigation (title, language, canonical, social tags, JSON-LD). */
export function applyHead(h: Head) {
  document.documentElement.lang = h.lang;
  document.title = h.title;

  const setMeta = (selector: string, attr: string, key: string, value: string | null) => {
    let el = document.head.querySelector<HTMLMetaElement>(selector);
    if (value === null) {
      el?.remove();
      return;
    }
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attr, key);
      document.head.appendChild(el);
    }
    el.content = value;
  };
  setMeta('meta[name="description"]', 'name', 'description', h.description);
  setMeta('meta[name="robots"]', 'name', 'robots', h.robots);
  setMeta('meta[property="og:type"]', 'property', 'og:type', h.og.type);
  setMeta('meta[property="og:title"]', 'property', 'og:title', h.title);
  setMeta('meta[property="og:description"]', 'property', 'og:description', h.description);
  setMeta('meta[property="og:url"]', 'property', 'og:url', h.og.url);
  setMeta('meta[property="og:locale"]', 'property', 'og:locale', h.og.locale);
  setMeta('meta[property="og:locale:alternate"]', 'property', 'og:locale:alternate', h.og.localeAlt);
  setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', h.title);
  setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', h.description);

  let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.rel = 'canonical';
    document.head.appendChild(canonical);
  }
  canonical.href = h.canonical;

  document.head.querySelectorAll('link[rel="alternate"][hreflang]').forEach((el) => el.remove());
  for (const a of h.alternates) {
    const link = document.createElement('link');
    link.rel = 'alternate';
    link.hreflang = a.hreflang;
    link.href = a.href;
    document.head.appendChild(link);
  }

  let ld = document.head.querySelector<HTMLScriptElement>('script[type="application/ld+json"]');
  if (!ld) {
    ld = document.createElement('script');
    ld.type = 'application/ld+json';
    document.head.appendChild(ld);
  }
  ld.textContent = jsonLdText(h.jsonLd);
}
