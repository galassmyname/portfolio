import { StrictMode, useEffect, useLayoutEffect, useRef, type ReactNode } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProjectPage from './pages/ProjectPage';
import { findProject } from './data/projects';
import { localizeProject } from './data/projects.fr';
import { LanguageProvider, useT } from './i18n/LanguageContext';
import { useReveal } from './hooks/useReveal';
import { useSpotlight } from './hooks/useSpotlight';
import { RouterProvider, useRouter, type Route } from './router';
import { applyHead, getHead } from './seo';

// useLayoutEffect warns during server rendering; it only matters in the browser.
const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

const sameDocument = (a: Route, b: Route) =>
  a.page === b.page && (a.page !== 'project' || (b.page === 'project' && a.slug === b.slug));

function Shell() {
  const { route } = useRouter();
  const t = useT();
  const found = route.page === 'project' ? findProject(route.slug) : undefined;
  const project = found && localizeProject(found, route.lang);
  const routeKey = route.page === 'project' ? `project:${route.slug}` : route.page;

  const previous = useRef(route);

  useReveal(routeKey);
  useSpotlight();

  // Scroll on navigation: top of a new page, or the requested section. Switching
  // language keeps the visitor where they are.
  useIsomorphicLayoutEffect(() => {
    const prev = previous.current;
    previous.current = route;
    if (prev === route || sameDocument(prev, route)) return;
    const anchor = window.location.hash.slice(1);
    const target = anchor ? document.getElementById(anchor) : null;
    if (target) target.scrollIntoView({ behavior: 'instant' });
    else window.scrollTo({ top: 0, behavior: 'instant' });
    if (route.page !== 'home') document.getElementById('main')?.focus({ preventScroll: true });
  }, [route]);

  useEffect(() => {
    applyHead(getHead(route));
  }, [route]);

  return (
    <>
      <div className="aurora" aria-hidden="true" />
      <div className="progress" aria-hidden="true" />
      <a
        className="skip-link"
        href="#main"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById('main')?.focus();
        }}
      >
        {t.skipToContent}
      </a>
      <Navbar onHome={route.page === 'home'} />
      <main id="main" tabIndex={-1}>
        {route.page === 'home' ? <HomePage /> : <ProjectPage project={project} />}
      </main>
      <Footer />
    </>
  );
}

function LanguageFromRoute({ children }: { children: ReactNode }) {
  const { route } = useRouter();
  return <LanguageProvider lang={route.lang}>{children}</LanguageProvider>;
}

/** Root used both for build-time prerendering and in the browser. */
export default function App({ path }: { path: string }) {
  return (
    <StrictMode>
      <RouterProvider initialPath={path}>
        <LanguageFromRoute>
          <Shell />
        </LanguageFromRoute>
      </RouterProvider>
    </StrictMode>
  );
}
