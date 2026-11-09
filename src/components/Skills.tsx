import { skillGroups } from '../data/skills';
import { revealDelay } from '../hooks/useReveal';
import { useLang, useT } from '../i18n/LanguageContext';
import { ChartIcon, CodeIcon, LayersIcon, NeuralIcon, RocketIcon, SparklesIcon, UsersIcon } from './Icons';
import SectionHeader from './SectionHeader';
import TechIcon from './TechIcon';
import './Skills.css';

/** One icon per group, in the order of data/skills.ts. */
const groupIcons = [CodeIcon, ChartIcon, NeuralIcon, SparklesIcon, RocketIcon, LayersIcon, UsersIcon];

export default function Skills() {
  const { lang } = useLang();
  const t = useT();

  return (
    <section id="skills" className="section" aria-labelledby="skills-title">
      <div className="container">
        <SectionHeader index="03" label={t.skills.label} titleId="skills-title" title={t.skills.title} lede={t.skills.lede} />

        <p className="skills__legend" data-reveal>
          <span>
            <span className="skill skill--sample" aria-hidden="true" />
            {t.skills.legendProjects}
          </span>
          <span>
            <span className="skill skill--training skill--sample" aria-hidden="true" />
            {t.skills.legendTraining}
          </span>
        </p>

        <div className="skills">
          {skillGroups.map((group, i) => {
            const Icon = groupIcons[i] ?? CodeIcon;
            return (
              <section
                key={group.title.en}
                className={`skills__group spot${group.wide ? ' skills__group--wide' : ''}`}
                aria-labelledby={`skills-${i}`}
                data-reveal
                style={revealDelay((i % 3) * 70)}
              >
                <h3 id={`skills-${i}`} className="skills__title">
                  <span className="skills__icon" aria-hidden="true">
                    <Icon />
                  </span>
                  {group.title[lang]}
                </h3>
                <ul className="skills__list">
                  {group.skills.map((s) => {
                    const used = s.repos.length > 0;
                    return (
                      <li
                        key={s.name.en}
                        className={`skill${used ? '' : ' skill--training'}`}
                        title={used ? s.repos.join(', ') : t.skills.training}
                      >
                        <TechIcon tech={s.icon} />
                        <span>{s.name[lang]}</span>
                        {used ? (
                          <span className="sr-only">{t.skills.usedIn(s.repos.length)}</span>
                        ) : (
                          <span className="sr-only">{t.skills.trainingOnly}</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}
        </div>
      </div>
    </section>
  );
}
