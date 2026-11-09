import type { ReactNode } from 'react';
import ArchitectureDiagram from '../components/ArchitectureDiagram';
import { ArrowIcon, GitHubIcon } from '../components/Icons';
import { allRepos, caseStudies, projectNumber, repoUrl, type Project } from '../data/projects';
import { localizeProject } from '../data/projects.fr';
import { revealDelay } from '../hooks/useReveal';
import { useLang, useT } from '../i18n/LanguageContext';
import { homePath, projectPath } from '../site';
import './ProjectPage.css';

function Block({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section className="case__block" aria-label={label} data-reveal>
      <h2 className="case__label mono">{label}</h2>
      <div className="case__content">{children}</div>
    </section>
  );
}

export default function ProjectPage({ project }: { project: Project | undefined }) {
  const { lang } = useLang();
  const t = useT();
  const c = t.caseStudy;

  if (!project) {
    return (
      <div className="case case--missing container">
        <p className="mono case__eyebrow">404</p>
        <h1 className="case__title">{c.notFoundTitle}</h1>
        <p className="case__lede">{c.notFoundText}</p>
        <a className="btn" href={`${homePath(lang)}#projects`}>
          <ArrowIcon direction="left" /> {c.backToProjects}
        </a>
      </div>
    );
  }

  const position = caseStudies.findIndex((p) => p.slug === project.slug);
  const nextBase = position >= 0 ? caseStudies[(position + 1) % caseStudies.length] : undefined;
  const next = nextBase && localizeProject(nextBase, lang);

  return (
    <article className="case container" aria-labelledby="case-title">
      <a className="text-link case__back" href={`${homePath(lang)}#projects`}>
        <ArrowIcon direction="left" /> {c.allProjects}
      </a>

      <header className="case__header">
        <p className="mono case__eyebrow" data-reveal>
          {c.caseStudy} · {projectNumber(project)}
        </p>
        <h1 id="case-title" className="case__title" data-reveal style={revealDelay(60)}>
          {project.name}
        </h1>
        <p className="case__lede" data-reveal style={revealDelay(120)}>
          {project.description}
        </p>

        <dl className="case__meta" data-reveal style={revealDelay(180)}>
          <div>
            <dt className="mono">{c.year}</dt>
            <dd>{project.year}</dd>
          </div>
          <div>
            <dt className="mono">{c.area}</dt>
            <dd>{project.categories.map((cat) => t.projects.categories[cat]).join(', ')}</dd>
          </div>
          <div>
            <dt className="mono">{c.repository}</dt>
            <dd className="case__repos">
              {allRepos(project).map((repo) => (
                <a key={repo} className="text-link" href={repoUrl({ repo })} target="_blank" rel="noopener noreferrer">
                  <GitHubIcon /> {repo}
                </a>
              ))}
            </dd>
          </div>
          {project.demoUrl && (
            <div>
              <dt className="mono">{c.demo}</dt>
              <dd>
                <a className="text-link" href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                  {c.openDemo} <ArrowIcon direction="up-right" />
                </a>
              </dd>
            </div>
          )}
        </dl>
      </header>

      <div className="case__body">
        {project.context && (
          <Block label={c.context}>
            <p>{project.context}</p>
          </Block>
        )}
        {project.problem && (
          <Block label={c.problem}>
            <p>{project.problem}</p>
          </Block>
        )}
        {project.solution && (
          <Block label={c.solution}>
            <p>{project.solution}</p>
          </Block>
        )}
        {project.features && (
          <Block label={c.features}>
            <ul className="case__features">
              {project.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </Block>
        )}
        {project.architecture && (
          <Block label={c.architecture}>
            <ArchitectureDiagram {...project.architecture} />
          </Block>
        )}
        <Block label={c.stack}>
          <ul className="tags case__stack">
            {project.technologies.map((tech) => (
              <li key={tech}>{tech}</li>
            ))}
          </ul>
        </Block>
        {project.notes && (
          <Block label={c.notes}>
            {project.notes.map((n) => (
              <p key={n}>{n}</p>
            ))}
          </Block>
        )}
        {project.sources && (
          <Block label={c.sources}>
            <p className="case__sources-intro">{c.sourcesIntro}</p>
            <ul className="case__sources mono">
              {project.sources.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </Block>
        )}
      </div>

      {next && next.slug !== project.slug && (
        <nav className="case__next" aria-label={c.next}>
          <a href={projectPath(lang, next.slug)}>
            <span className="mono">
              {c.next} — {projectNumber(next)}
            </span>
            <span className="case__next-title">{next.name}</span>
            <ArrowIcon className="case__next-arrow" />
          </a>
        </nav>
      )}
    </article>
  );
}
