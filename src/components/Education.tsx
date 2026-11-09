import { education } from '../data/profile';
import { revealDelay } from '../hooks/useReveal';
import { useLang, useT } from '../i18n/LanguageContext';
import { ChipIcon, GraduationIcon, InstitutionIcon } from './Icons';
import SectionHeader from './SectionHeader';
import './Education.css';

/**
 * Education & training as a vertical tree: a central line with cards
 * alternating left and right on wide screens, and a single left-hand line on
 * mobile. Everything is readable without interaction; motion only reveals.
 */
export default function Education() {
  const { lang } = useLang();
  const t = useT();

  return (
    <section id="education" className="section" aria-labelledby="education-title">
      <div className="container">
        <SectionHeader index="04" label={t.education.label} titleId="education-title" title={t.education.title} />

        <div className="tree">
          <span className="tree__line" aria-hidden="true" data-reveal />

          <ol className="tree__list">
            {education.map((e, i) => {
              const side = i % 2 === 0 ? 'left' : 'right';
              const training = e.kind === 'training';
              const Icon = training ? ChipIcon : GraduationIcon;
              const current = Boolean(e.inProgress);
              return (
                <li
                  key={`${e.institution}-${e.credential.en}`}
                  className={`tree__item tree__item--${side}${training ? ' tree__item--featured' : ''}`}
                  data-reveal
                  style={revealDelay(i * 90)}
                >
                  <span className={`tree__node${current ? ' tree__node--current' : ''}`} aria-hidden="true" />
                  <span className="tree__branch" aria-hidden="true" />

                  <article className="tree__card spot" aria-labelledby={`edu-${i}`}>
                    <header className="tree__head">
                      <span className="tree__icon" aria-hidden="true">
                        <Icon />
                      </span>
                      <p className="tree__period mono">{e.period[lang]}</p>
                      <p className={`tree__status mono${current ? ' tree__status--current' : ''}`}>
                        {current ? t.education.inProgress : t.education.completed}
                      </p>
                    </header>

                    <h3 className="tree__title" id={`edu-${i}`}>
                      <span className="tree__credential">{e.credential[lang]}</span>
                      {e.field[lang]}
                    </h3>
                    <p className="tree__institution">
                      <InstitutionIcon />
                      {e.institution}
                    </p>

                    {e.description && <p className="tree__desc">{e.description[lang]}</p>}
                  </article>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
