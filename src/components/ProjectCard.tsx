import { allRepos, hasCaseStudy, repoUrl, type Project } from '../data/projects';
import { techIcon } from '../data/techIcons';
import { useLang, useT } from '../i18n/LanguageContext';
import { projectPath } from '../site';
import { ArrowIcon, GitHubIcon } from './Icons';
import ProjectCover, { projectTone } from './ProjectCover';
import TechIcon from './TechIcon';

/** Technologies shown on a card (the full stack is on the case study / repo). */
const MAX_TAGS = 4;

export type CardVariant = 'default' | 'wide' | 'wide-flip';

/** Workshops and exercises get a compact card (no cover), so the main projects stand out. */
const isCompact = (p: Project) => Boolean(p.learning);

/**
 * Project card: a framed cover, then category and year, title, one-line
 * summary, the main technologies as logos and the links. `wide` cards lay the
 * cover and the text side by side (used for the lead projects).
 */
export default function ProjectCard({
  project,
  order,
  hidden = false,
  variant = 'default',
}: {
  project: Project;
  order: number;
  hidden?: boolean;
  variant?: CardVariant;
}) {
  const t = useT();
  const { lang } = useLang();
  const titleId = `card-${project.slug}`;
  const shown = project.technologies.slice(0, MAX_TAGS);
  const moreTags = project.technologies.length - shown.length;
  const caseStudy = hasCaseStudy(project);
  const href = caseStudy ? projectPath(lang, project.slug) : undefined;
  const repos = allRepos(project);
  const compact = isCompact(project);
  const urlFor = (repo: string) => repoUrl(repo === project.repo ? project : { repo });

  return (
    <li
      className={`card card--${compact ? 'compact' : variant} card--tone-${projectTone(project)}${project.featured ? ' card--featured' : ''}`}
      style={{ animationDelay: `${Math.min(order, 8) * 50}ms` }}
      hidden={hidden}
    >
      <article className="spot" aria-labelledby={titleId}>
        {!compact && (
        <div className="card__media">
          <ProjectCover project={project} />
          {project.featured && (
            <span className="card__badge mono">
              <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
                <path d="m8 1.5 1.9 4 4.4.5-3.3 3 .9 4.3L8 11.1l-3.9 2.2.9-4.3-3.3-3 4.4-.5L8 1.5Z" fill="currentColor" />
              </svg>
              {t.projects.featured}
            </span>
          )}
        </div>
        )}

        <div className="card__body">
          <p className="card__meta mono">
            <span className="card__cat">{compact ? t.projects.learning : t.projects.categories[project.categories[0]]}</span>
            <span className="card__year">{project.year}</span>
          </p>

          <h3 className="card__title" id={titleId}>
            {href ? <a href={href}>{project.name}</a> : project.name}
          </h3>
          <p className="card__desc" title={project.description}>
            {project.summary}
          </p>
          {project.role && (
            <p className="card__role">
              <span className="mono">{t.projects.myRole}</span> {project.role}
            </p>
          )}

          <ul className="card__tags" aria-label={t.projects.technologies}>
            {shown.map((tech) =>
              techIcon(tech) ? (
                <li key={tech} className="card__logo" title={tech}>
                  <TechIcon tech={tech} />
                  <span className="sr-only">{tech}</span>
                </li>
              ) : (
                <li key={tech} className="card__tag">
                  {tech}
                </li>
              ),
            )}
            {moreTags > 0 && (
              <li className="card__tag card__tag--more" title={project.technologies.slice(MAX_TAGS).join(', ')}>
                +{moreTags}
              </li>
            )}
          </ul>

          <div className="card__links">
            {href ? (
              <a className="card__cta" href={href} aria-describedby={titleId}>
                {t.projects.caseStudy}
                <ArrowIcon />
              </a>
            ) : (
              <a className="card__cta" href={urlFor(project.repo)} target="_blank" rel="noopener noreferrer" aria-describedby={titleId}>
                GitHub
                <ArrowIcon direction="up-right" />
                <span className="sr-only"> {t.newTab}</span>
              </a>
            )}
            <span className="card__actions">
              {(href ? repos : repos.slice(1)).map((repo) => {
                const part = repos.length > 1 ? repo.replace(/^.*-/, '') : null;
                const label = part ? t.projects.sourceCodePart(part) : t.projects.sourceCode;
                return (
                  <a key={repo} className="card__icon-link" href={urlFor(repo)} target="_blank" rel="noopener noreferrer" title={label}>
                    <GitHubIcon />
                    {part && (
                      <span className="card__icon-text" aria-hidden="true">
                        {part}
                      </span>
                    )}
                    <span className="sr-only">
                      {label} {t.newTab}
                    </span>
                  </a>
                );
              })}
              {project.demoUrl && (
                <a className="card__icon-link card__icon-link--demo" href={project.demoUrl} target="_blank" rel="noopener noreferrer" title={t.projects.liveDemo}>
                  <span className="card__icon-text">{t.projects.liveDemo}</span>
                  <ArrowIcon direction="up-right" />
                  <span className="sr-only"> {t.newTab}</span>
                </a>
              )}
            </span>
          </div>
        </div>
      </article>
    </li>
  );
}
