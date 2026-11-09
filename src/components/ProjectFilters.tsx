import { useT } from '../i18n/LanguageContext';
import type { Filter } from '../i18n/ui';

type Props = {
  options: Filter[];
  category: Filter;
  onCategory: (c: Filter) => void;
  query: string;
  onQuery: (q: string) => void;
  counts: Record<Filter, number>;
  resultCount: number;
};

export default function ProjectFilters({ options, category, onCategory, query, onQuery, counts, resultCount }: Props) {
  const t = useT();

  return (
    <div className="filters" data-reveal>
      <div className="filters__chips" role="group" aria-label={t.projects.filterBy}>
        {options.map((c) => (
          <button
            key={c}
            type="button"
            className="chip"
            aria-pressed={category === c}
            onClick={() => onCategory(c)}
          >
            {t.projects.categories[c]}
            <span className="chip__count" aria-hidden="true">
              {counts[c]}
            </span>
          </button>
        ))}
      </div>

      <div className="filters__search">
        <label htmlFor="project-search" className="sr-only">
          {t.projects.searchLabel}
        </label>
        <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
          <circle cx="7" cy="7" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
          <path d="M10.5 10.5 14 14" stroke="currentColor" strokeWidth="1.4" />
        </svg>
        <input
          id="project-search"
          type="search"
          placeholder={t.projects.searchPlaceholder}
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          autoComplete="off"
          spellCheck={false}
        />
      </div>

      <p className="filters__status mono" role="status" aria-live="polite">
        {t.projects.count(resultCount)}
      </p>
    </div>
  );
}
