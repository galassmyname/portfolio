import { LANG_STORAGE_KEY, useLang, useT } from '../i18n/LanguageContext';
import type { Lang } from '../i18n/ui';
import { pathFor, useRouter } from '../router';

const options: { lang: Lang; short: string; label: string }[] = [
  { lang: 'en', short: 'EN', label: 'English' },
  { lang: 'fr', short: 'FR', label: 'Français' },
];

/**
 * Real links to the same page in the other language, so crawlers can follow
 * them too; clicks are handled client-side by the router (scroll position kept).
 */
export default function LanguageSwitch() {
  const { lang } = useLang();
  const { route } = useRouter();
  const t = useT();

  const remember = (l: Lang) => {
    try {
      localStorage.setItem(LANG_STORAGE_KEY, l);
    } catch {
      // Non-critical: only used to pick a language when opening the site root.
    }
  };

  return (
    <div className="lang" role="group" aria-label={t.nav.language}>
      {options.map((o, i) => (
        <span key={o.lang} className="lang__item">
          {i > 0 && (
            <span className="lang__sep" aria-hidden="true">
              |{' '}
            </span>
          )}
          <a
            href={pathFor(route, o.lang)}
            hrefLang={o.lang}
            lang={o.lang}
            title={o.label}
            aria-current={lang === o.lang ? 'true' : undefined}
            onClick={() => remember(o.lang)}
          >
            <span aria-hidden="true">{o.short}</span>
            <span className="sr-only">{o.label}</span>
          </a>
        </span>
      ))}
    </div>
  );
}
