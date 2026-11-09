import type React from 'react';
import { profile } from '../data/profile';
import { projects } from '../data/projects';
import { techIcon } from '../data/techIcons';
import { useLang, useT } from '../i18n/LanguageContext';
import HeroPortrait from './HeroPortrait';
import { ArrowIcon, DownloadIcon, GitHubIcon, LinkedInIcon, MailIcon, PinIcon } from './Icons';
import TechIcon from './TechIcon';
import './Hero.css';

/** Technologies from the public projects that have a logo, most used first. */
const stack = (() => {
  const count = new Map<string, number>();
  for (const p of projects) for (const tech of p.technologies) count.set(tech, (count.get(tech) ?? 0) + 1);
  return [...count.entries()]
    .filter(([tech]) => techIcon(tech) && !/^(Java 17|Docker Compose|Django REST Framework|Spring Cloud Gateway)$/.test(tech))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 18)
    .map(([tech]) => tech);
})();

const step = (i: number) => ({ '--i': i }) as React.CSSProperties;

/**
 * Two-column hero: on desktop the introduction sits on the left and the
 * official portrait on the right; on small screens the text comes first and
 * the portrait follows. Entrance motion is a one-off CSS animation (disabled
 * with prefers-reduced-motion).
 */
export default function Hero() {
  const { lang } = useLang();
  const t = useT();
  const first = profile.name.slice(0, profile.name.lastIndexOf(' '));
  const last = profile.name.slice(profile.name.lastIndexOf(' ') + 1);

  return (
    <section id="home" className="hero" aria-labelledby="hero-title">
      <div className="container hero__inner">
        <div className="hero__text">
          <p className="hero__role hero__in" style={step(1)}>
            {profile.role[lang]} <span aria-hidden="true">·</span> {profile.specialization[lang]}
          </p>

          <h1 id="hero-title" className="hero__name hero__in" style={step(2)}>
            {first} <span className="hero__accent">{last}</span>
          </h1>

          <p className="hero__tagline hero__in" style={step(3)}>
            {t.hero.headline}
          </p>

          <p className="hero__intro hero__in" style={step(4)}>
            {t.hero.intro}
          </p>

          <div className="hero__actions hero__in" style={step(5)}>
            <a className="btn btn--primary" href="#projects">
              {t.hero.cta}
              <ArrowIcon />
            </a>
            <a className="btn btn--accent" href={profile.githubUrl} target="_blank" rel="noopener noreferrer">
              <GitHubIcon />
              {t.hero.github}
              <span className="sr-only"> {t.newTab}</span>
            </a>
            <a className="btn" href="#contact">
              <MailIcon />
              {t.hero.contact}
            </a>
          </div>

          <ul className="hero__links hero__in" style={step(6)}>
            <li>
              <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer">
                <LinkedInIcon />
                LinkedIn
                <span className="sr-only"> {t.newTab}</span>
              </a>
            </li>
            <li>
              <a href={profile.cv.url} download={profile.cv.fileName} type="application/pdf" title={t.hero.downloadCv}>
                <DownloadIcon />
                {t.hero.cv}
                <span className="sr-only"> — {t.hero.downloadCv}</span>
              </a>
            </li>
            <li className="hero__place">
              <PinIcon />
              {profile.location[lang]}
            </li>
          </ul>
        </div>

        <HeroPortrait />
      </div>

      <div className="marquee hero__in" style={step(7)}>
        <p className="sr-only">{t.hero.stack}</p>
        <div className="marquee__track">
          {[0, 1].map((copy) => (
            <ul key={copy} className="marquee__list" aria-hidden={copy === 1 ? 'true' : undefined}>
              {stack.map((tech) => (
                <li key={tech}>
                  <TechIcon tech={tech} />
                  {tech}
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
