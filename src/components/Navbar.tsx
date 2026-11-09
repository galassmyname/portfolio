import { useEffect, useRef, useState } from 'react';
import { profile } from '../data/profile';
import { GitHubIcon, LinkedInIcon } from './Icons';
import { useLang, useT } from '../i18n/LanguageContext';
import { homePath } from '../site';
import LanguageSwitch from './LanguageSwitch';
import './Navbar.css';

const sections = ['home', 'about', 'projects', 'skills', 'education', 'contact'] as const;

export default function Navbar({ onHome }: { onHome: boolean }) {
  const t = useT();
  const { lang } = useLang();
  const home = homePath(lang);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Highlight the section currently crossing the middle of the viewport.
  useEffect(() => {
    if (!onHome || !('IntersectionObserver' in window)) {
      setActive(null);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [onHome]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    const onResize = () => window.innerWidth > 900 && setOpen(false);
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
      document.body.style.overflow = '';
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className={`nav${scrolled || !onHome ? ' nav--solid' : ''}${open ? ' nav--open' : ''}`}>
      <div className="nav__inner container">
        <a className="nav__brand" href={`${home}#home`} onClick={close} aria-label={`${profile.name} — ${t.nav.home}`}>
          <span className="nav__mark" aria-hidden="true" />
          <span className="nav__name">{profile.name}</span>
        </a>

        <nav className="nav__menu" id="site-menu" aria-label={t.nav.primary}>
          <ul className="nav__links">
            {sections.map((id) => (
              <li key={id}>
                <a href={`${home}#${id}`} onClick={close} aria-current={active === id ? 'true' : undefined}>
                  {t.nav.links[id]}
                </a>
              </li>
            ))}
          </ul>
          <div className="nav__social">
            <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" aria-label={`GitHub ${t.newTab}`}>
              <GitHubIcon />
              <span className="nav__social-label">GitHub</span>
            </a>
            <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label={`LinkedIn ${t.newTab}`}>
              <LinkedInIcon />
              <span className="nav__social-label">LinkedIn</span>
            </a>
          </div>
        </nav>

        <LanguageSwitch />

        <button
          ref={toggleRef}
          className="nav__toggle"
          type="button"
          aria-expanded={open}
          aria-controls="site-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">{open ? t.nav.closeMenu : t.nav.openMenu}</span>
          <span className="nav__toggle-bar" aria-hidden="true" />
          <span className="nav__toggle-bar" aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
