import { useEffect, type CSSProperties } from 'react';

/** Inline style that staggers a `data-reveal` element. */
export const revealDelay = (ms: number) => ({ '--delay': `${ms}ms` }) as CSSProperties;

/**
 * Fades in elements marked with `data-reveal` as they enter the viewport.
 * Content stays visible without JavaScript and with reduced motion (see base.css).
 *
 * The page arrives prerendered and fully visible. On first run, anything
 * already on screen is marked visible *before* animations are enabled (the
 * `js` class), so nothing the visitor is looking at flickers; only content
 * further down fades in as it is scrolled into view.
 */
export function useReveal(key: unknown) {
  useEffect(() => {
    const root = document.documentElement;
    if (!root.classList.contains('js')) {
      document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('is-visible');
      });
      root.classList.add('js');
    }

    const elements = document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-visible)');
    if (!('IntersectionObserver' in window)) {
      elements.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [key]);
}
