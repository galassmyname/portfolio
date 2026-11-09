import type { Lang } from './i18n/ui';

/**
 * Site-wide configuration for URLs and SEO.
 *
 * VITE_SITE_URL is the public origin of the deployed site, e.g.
 * "https://www.example.com" (no trailing slash). It is read at build time
 * from .env or the host's environment settings. Until it is set, canonical
 * URLs fall back to root-relative paths and absolute-only tags (og:url,
 * og:image, sitemap entries) are left out rather than pointing to a guess.
 */
export const SITE_URL = (import.meta.env.VITE_SITE_URL ?? '').trim().replace(/\/+$/, '');

/** Path prefix the site is served from ("/" at a domain root). Ends with "/". */
export const BASE = import.meta.env.BASE_URL;

export const LANGS: Lang[] = ['en', 'fr'];
export const DEFAULT_LANG: Lang = 'en';

export const homePath = (lang: Lang) => `${BASE}${lang}/`;
export const projectPath = (lang: Lang, slug: string) => `${BASE}${lang}/projects/${slug}/`;

/** Absolute URL for a site path, or null while the domain is not configured. */
export const absoluteUrl = (path: string) => (SITE_URL ? `${SITE_URL}${path}` : null);

/** Absolute URL when the domain is known, otherwise the root-relative path. */
export const preferAbsolute = (path: string) => absoluteUrl(path) ?? path;
