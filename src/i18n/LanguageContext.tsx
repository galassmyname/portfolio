import { createContext, useContext, type ReactNode } from 'react';
import { ui, type Lang, type UI } from './ui';

/** Key under which the visitor's last language choice is remembered (used by the root redirect). */
export const LANG_STORAGE_KEY = 'lang';

type LanguageState = { lang: Lang };

const LanguageContext = createContext<LanguageState>({ lang: 'en' });

/** The active language comes from the URL (/en/… or /fr/…). */
export function LanguageProvider({ lang, children }: { lang: Lang; children: ReactNode }) {
  return <LanguageContext.Provider value={{ lang }}>{children}</LanguageContext.Provider>;
}

export const useLang = () => useContext(LanguageContext);

/** Interface strings for the active language. */
export function useT(): UI {
  return ui[useLang().lang];
}
