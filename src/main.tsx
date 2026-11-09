import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App';
import { LANG_STORAGE_KEY } from './i18n/LanguageContext';
import type { Lang } from './i18n/ui';
import { parsePath } from './router';
import { homePath, projectPath } from './site';
import './styles/fonts.css';
import './styles/base.css';

function preferredLang(): Lang {
  try {
    const stored = localStorage.getItem(LANG_STORAGE_KEY);
    if (stored === 'en' || stored === 'fr') return stored;
  } catch {
    // Storage unavailable: fall back to the browser language.
  }
  return navigator.language?.toLowerCase().startsWith('fr') ? 'fr' : 'en';
}

const { pathname, hash } = window.location;
const route = parsePath(pathname);
const legacyProject = hash.match(/^#\/projects\/([^/?#]+)/);

if (legacyProject) {
  // Links from the earlier hash-based version: /#/projects/<slug>
  window.location.replace(projectPath(route?.lang ?? preferredLang(), legacyProject[1]));
} else if (!route) {
  // Site root (or any path without a language): send to /en/ or /fr/.
  window.location.replace(homePath(preferredLang()) + hash);
} else {
  const root = document.getElementById('root')!;
  const app = <App path={pathname} />;
  const normalized = pathname.endsWith('/') ? pathname : `${pathname}/`;
  // Hydrate the prerendered HTML when it matches this URL; otherwise (dev
  // server, or a 404 page served for an unknown path) render from scratch.
  if (root.dataset.path === normalized && root.firstElementChild) hydrateRoot(root, app);
  else createRoot(root).render(app);
}
