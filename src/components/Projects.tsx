import { projects } from '../data/projects';
import { useT } from '../i18n/LanguageContext';
import ProjectIndex from './ProjectIndex';
import SectionHeader from './SectionHeader';
import './Projects.css';

export default function Projects() {
  const t = useT();

  return (
    <section id="projects" className="section" aria-labelledby="projects-title">
      <div className="container">
        <SectionHeader
          index="02"
          label={t.projects.label}
          titleId="projects-title"
          title={t.projects.title}
          lede={t.projects.lede(projects.length)}
        />
        <ProjectIndex />
      </div>
    </section>
  );
}
