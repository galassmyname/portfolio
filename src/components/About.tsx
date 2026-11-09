import type { ReactNode } from 'react';
import { education as educationEntries } from '../data/profile';
import { caseStudies, projects } from '../data/projects';
import { revealDelay } from '../hooks/useReveal';
import { useT } from '../i18n/LanguageContext';
import CountUp from './CountUp';
import { ChartIcon, CodeIcon, GraduationIcon, InstitutionIcon } from './Icons';
import SectionHeader from './SectionHeader';
import TechIcon from './TechIcon';
import './About.css';

const icons = [CodeIcon, ChartIcon, GraduationIcon];

/** Figures computed from the project data, so they always match the site. */
const technologyCount = new Set(projects.flatMap((p) => p.technologies)).size;

/** Frameworks behind the software projects (each appears in projects.ts). */
const softwareStack = ['Spring Boot', 'Django', 'Express', 'Angular', 'React', 'Next.js', 'Docker', 'Kubernetes'].filter((tech) =>
  projects.some((p) => p.technologies.includes(tech)),
);

/**
 * Bento grid: the three strengths as cards of different widths, interleaved
 * with three figures taken from the public projects.
 */
export default function About() {
  const t = useT();
  const [software, data, education] = t.about.highlights;
  const stats = [
    { value: projects.length, label: t.about.stats.projects },
    { value: caseStudies.length, label: t.about.stats.caseStudies },
    { value: technologyCount, label: t.about.stats.technologies },
  ];

  const highlight = (h: { title: string; text: string }, i: number, delay: number, tags?: ReactNode) => {
    const Icon = icons[i];
    return (
      <li key={h.title} className={`bento__item bento__item--text spot${tags ? ' bento__item--wide' : ''}`} data-reveal style={revealDelay(delay)}>
        <div className="bento__main">
          <span className="bento__icon" aria-hidden="true">
            <Icon />
          </span>
          <h3 className="bento__title">{h.title}</h3>
          <p className="bento__text">{h.text}</p>
        </div>
        {tags && <ul className="bento__tags">{tags}</ul>}
      </li>
    );
  };

  const softwareTags = softwareStack.map((tech) => (
    <li key={tech}>
      <TechIcon tech={tech} />
      {tech}
    </li>
  ));
  const schoolTags = [...new Set(educationEntries.map((e) => e.institution))].map((name) => (
    <li key={name}>
      <InstitutionIcon className="tech-icon" />
      {name}
    </li>
  ));

  const stat = (s: { value: number; label: string }, delay: number) => (
    <li key={s.label} className="bento__item bento__item--stat spot" data-reveal style={revealDelay(delay)}>
      <p className="bento__value">
        <CountUp value={s.value} />
      </p>
      <p className="bento__label">{s.label}</p>
    </li>
  );

  return (
    <section id="about" className="section" aria-labelledby="about-title">
      <div className="container">
        <SectionHeader index="01" label={t.about.label} titleId="about-title" title={t.about.title} lede={t.about.lead} />

        <ul className="bento">
          {highlight(software, 0, 0, softwareTags)}
          {stat(stats[0], 80)}
          {stat(stats[1], 160)}
          {stat(stats[2], 0)}
          {highlight(data, 1, 80)}
          {highlight(education, 2, 160, schoolTags)}
        </ul>
      </div>
    </section>
  );
}
