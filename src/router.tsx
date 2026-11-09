import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Lang } from './i18n/ui';
import { BASE, LANGS, homePath, projectPath } from './site';

/**
 * Path-based routing with one URL per language:
 *   /en/                    home
 *   /en/projects/<slug>/    case study
 * Each URL is prerendered to static HTML at build time; in the browser,
 * internal links are handled client-side so navigation stays instant.
 */
export type Route =
  | { lang: Lang; page: 'home' }
  | { lang: Lang; page: 'project'; slug: string }
  | { lang: Lang; page: 'notfound' };

/** Returns null when the path has no language prefix (e.g. the site root). */
export function parsePath(pathname: string): Route | null {
  const rest = pathname.startsWith(BASE) ? pathname.slice(BASE.length) : pathname.replace(/^\//, '');
  const [lang, ...parts] = rest.split('/').filter(Boolean);
  if (!LANGS.includes(lang as Lang)) return null;
  const l = lang as Lang;
  if (parts.length === 0) return { lang: l, page: 'home' };
  if (parts[0] === 'projects' && parts.length === 2) return { lang: l, page: 'project', slug: decodeURIComponent(parts[1]) };
  return { lang: l, page: 'notfound' };
}

/** The same page in another language. */
export function pathFor(route: Route, lang: Lang): string {
  return route.page === 'project' ? projectPath(lang, route.slug) : homePath(lang);
}

type RouterState = { route: Route; navigate: (to: string) => void };

const RouterContext = createContext<RouterState | null>(null);

export function RouterProvider({ initialPath, children }: { initialPath: string; children: ReactNode }) {
  const [route, setRoute] = useState<Route>(() => parsePath(initialPath) ?? { lang: 'en', page: 'notfound' });

  const navigate = useCallback((to: string) => {
    const url = new URL(to, window.location.href);
    const next = parsePath(url.pathname);
    if (!next) {
      window.location.assign(url.href);
      return;
    }
    window.history.pushState(null, '', url.pathname + url.search + url.hash);
    setRoute(next);
  }, []);

  useEffect(() => {
    const onPop = () => {
      const next = parsePath(window.location.pathname);
      if (next) setRoute(next);
    };

    // Handle clicks on internal links to other pages without a full reload.
    // Same-page anchors (#about) are left to the browser.
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.('a');
      if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
      const href = a.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname === window.location.pathname) return;
      if (!parsePath(url.pathname)) return;
      e.preventDefault();
      navigate(url.href);
    };

    window.addEventListener('popstate', onPop);
    document.addEventListener('click', onClick);
    return () => {
      window.removeEventListener('popstate', onPop);
      document.removeEventListener('click', onClick);
    };
  }, [navigate]);

  return <RouterContext.Provider value={{ route, navigate }}>{children}</RouterContext.Provider>;
}

export function useRouter(): RouterState {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error('useRouter must be used inside RouterProvider');
  return ctx;
}
