import { Fragment, useDeferredValue, useMemo, useRef, useState } from 'react';
import { allRepos, categories, projects } from '../data/projects';
import { localizeProject } from '../data/projects.fr';
import { useLang, useT } from '../i18n/LanguageContext';
import type { Filter } from '../i18n/ui';
import { ArrowIcon } from './Icons';
import ProjectCard, { type CardVariant } from './ProjectCard';
import ProjectFilters from './ProjectFilters';

/** Projects shown before "View all": the featured ones come first in `projects`. */
const INITIAL_COUNT = 6;

const matches = (q: string, fields: string[]) => fields.some((f) => f.toLowerCase().includes(q));

/** Bento rhythm for the lead projects: the 1st and 4th are wide, side by side. */
const variantFor = (i: number): CardVariant => (i === 0 ? 'wide' : i === 3 ? 'wide-flip' : 'default');

/**
 * One compact grid for every project. By default the first six (the featured
 * projects) are shown, with a button to reveal the rest in place. A filter or
 * search always covers the whole portfolio, so nothing is ever unreachable.
 */
export default function ProjectIndex() {
  const { lang } = useLang();
  const t = useT();
  const [category, setCategory] = useState<Filter>('All');
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState(false);
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());
  const rootRef = useRef<HTMLDivElement>(null);

  const localized = useMemo(() => projects.map((p) => localizeProject(p, lang)), [lang]);

  // Only offer categories that at least one project actually uses.
  const counts = useMemo(() => {
    const c = { All: projects.length } as Record<Filter, number>;
    for (const cat of categories) c[cat] = projects.filter((p) => p.categories.includes(cat)).length;
    return c;
  }, []);
  const available = categories.filter((c) => counts[c] > 0);

  const filtering = category !== 'All' || deferredQuery !== '';

  const matching = useMemo(
    () =>
      localized.filter((p) => {
        if (category !== 'All' && !p.categories.includes(category)) return false;
        if (!deferredQuery) return true;
        const labels = p.categories.map((c) => t.projects.categories[c]);
        return matches(deferredQuery, [p.name, ...allRepos(p), p.description, ...p.technologies, ...labels, ...p.categories]);
      }),
    [localized, category, deferredQuery, t],
  );

  const collapsed = !expanded && !filtering && matching.length > INITIAL_COUNT;
  const canCollapse = expanded && !filtering && matching.length > INITIAL_COUNT;

  const collapse = () => {
    setExpanded(false);
    // Bring the grid back into view so the visitor isn't left far below it.
    rootRef.current?.scrollIntoView({ block: 'start' });
  };

  return (
    <div className="index" ref={rootRef}>
      <ProjectFilters
        options={['All', ...available]}
        category={category}
        onCategory={setCategory}
        query={query}
        onQuery={setQuery}
        counts={counts}
        resultCount={matching.length}
      />

      {/* Every matching card stays in the HTML (indexable); the extra ones are
          only hidden while the grid is collapsed. */}
      {matching.length > 0 && (
        <ul className={`index__grid${filtering ? '' : ' index__grid--bento'}`} id="project-grid">
          {matching.map((p, i) => (
            <Fragment key={p.slug}>
              <ProjectCard
                project={p}
                order={i < INITIAL_COUNT ? i : i - INITIAL_COUNT}
                hidden={collapsed && i >= INITIAL_COUNT}
                variant={filtering ? 'default' : variantFor(i)}
              />
              {/* While collapsed, the last tile of the bento invites to see the rest. */}
              {collapsed && i === INITIAL_COUNT - 1 && (
                <li className="index__cta">
                  <p className="index__cta-count">{t.projects.moreCount(matching.length - INITIAL_COUNT)}</p>
                  <p className="index__cta-text">{t.projects.moreText}</p>
                  <button
                    type="button"
                    className="btn btn--primary index__more"
                    aria-controls="project-grid"
                    aria-expanded="false"
                    onClick={() => setExpanded(true)}
                  >
                    {t.projects.showAll(matching.length)}
                    <ArrowIcon direction="down" />
                  </button>
                  <p className="index__more-note mono">{t.projects.showing(INITIAL_COUNT, matching.length)}</p>
                </li>
              )}
            </Fragment>
          ))}
        </ul>
      )}

      {canCollapse && (
        <div className="index__more-row">
          <button type="button" className="btn index__more" aria-controls="project-grid" aria-expanded="true" onClick={collapse}>
            {t.projects.showLess}
            <ArrowIcon direction="up" />
          </button>
        </div>
      )}

      {matching.length === 0 && (
        <div className="index__empty">
          <p>{t.projects.noMatch(query, category === 'All' ? null : t.projects.categories[category])}</p>
          <button
            type="button"
            className="text-link"
            onClick={() => {
              setQuery('');
              setCategory('All');
            }}
          >
            {t.projects.reset}
          </button>
        </div>
      )}
    </div>
  );
}
