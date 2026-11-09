import type { Localized } from './profile';
import { projects } from './projects';

/**
 * Skills shown on the site, each with its evidence:
 *  - `match`: technology names in projects.ts that demonstrate it, or
 *  - `projects`: project slugs that demonstrate a concept (e.g. data preparation);
 *  - `training`: covered in the Sonatel Academy P1 IA programme.
 *
 * Evidence only counts published projects (drafts are excluded), so a skill
 * appears once its repository is public.
 *
 * A skill with public projects shows how many use it. A skill covered only in
 * training is labelled as such. A skill with neither is not displayed.
 */
type SkillDef = { name: Localized | string; match?: string[]; projects?: string[]; training?: boolean; icon?: string };
type SkillGroupDef = { title: Localized; skills: SkillDef[]; wide?: boolean };

const groups: SkillGroupDef[] = [
  {
    title: { en: 'Programming languages', fr: 'Langages de programmation' },
    skills: [
      { name: 'Python', training: true },
      { name: 'JavaScript', match: ['JavaScript', 'Node.js', 'Express'], training: true },
      { name: 'TypeScript' },
      { name: 'Java', match: ['Java', 'Java 17'] },
      { name: 'SQL', match: ['MySQL', 'PostgreSQL', 'SQLite'] },
      { name: 'PHP' },
    ],
  },
  {
    title: { en: 'AI & machine learning', fr: 'IA & machine learning' },
    skills: [
      {
        name: { en: 'Data preparation & EDA', fr: 'Préparation & analyse exploratoire' },
        projects: ['waste-image-dataset', 'review-text-preprocessing', 'smart-building-tabular', 'iot-pandas', 'iot-seaborn'],
        training: true,
      },
      { name: 'pandas & NumPy', match: ['pandas', 'NumPy'], training: true, icon: 'pandas' },
      { name: { en: 'Machine learning (scikit-learn)', fr: 'Machine learning (scikit-learn)' }, match: ['scikit-learn'], icon: 'scikit-learn', training: true },
      { name: { en: 'Deep learning (TensorFlow / Keras)', fr: 'Deep learning (TensorFlow / Keras)' }, match: ['TensorFlow / Keras'], icon: 'TensorFlow / Keras', training: true },
      { name: { en: 'NLP (NLTK, spaCy)', fr: 'NLP (NLTK, spaCy)' }, match: ['NLTK', 'spaCy'], icon: 'spaCy' },
      { name: { en: 'LLM applications', fr: 'Applications LLM' }, match: ['Groq', 'Hugging Face API'], training: true },
      { name: { en: 'RAG & vector search', fr: 'RAG & recherche vectorielle' }, match: ['ChromaDB', 'sentence-transformers'], training: true },
      { name: { en: 'Prompt engineering', fr: 'Prompt engineering' }, training: true },
      { name: { en: 'AI agents & automation', fr: 'Agents IA & automatisation' }, training: true },
    ],
  },
  {
    title: { en: 'Backend & APIs', fr: 'Backend & API' },
    skills: [
      {
        name: { en: 'REST API design', fr: 'Conception d’API REST' },
        projects: ['couture-api', 'student-microservices', 'appointment-api', 'distributed-system', 'sunutransport', 'red-product', 'book-management'],
        training: true,
      },
      { name: 'FastAPI', match: ['FastAPI'], training: true },
      { name: 'Node.js / Express', match: ['Express'], icon: 'Node.js' },
      { name: 'Spring Boot' },
      { name: 'Django REST Framework', icon: 'Django' },
      { name: 'Laravel' },
      { name: { en: 'Automated tests (pytest)', fr: 'Tests automatisés (pytest)' }, match: ['pytest'] },
    ],
  },
  {
    title: { en: 'Frontend', fr: 'Frontend' },
    skills: [
      { name: 'React / Next.js', match: ['React', 'Next.js'], icon: 'React' },
      { name: 'Angular' },
      { name: 'HTML & CSS', match: ['HTML', 'CSS'], training: true, icon: 'HTML' },
      { name: 'Tailwind CSS' },
    ],
  },
  {
    title: { en: 'Databases', fr: 'Bases de données' },
    skills: [
      { name: 'PostgreSQL' },
      { name: 'MySQL' },
      { name: 'MongoDB' },
      { name: { en: 'ORMs (SQLAlchemy, Prisma, JPA)', fr: 'ORM (SQLAlchemy, Prisma, JPA)' }, match: ['SQLAlchemy', 'Prisma', 'Spring Data JPA'] },
    ],
  },
  {
    title: { en: 'Tools, infrastructure & big data', fr: 'Outils, infrastructure & big data' },
    wide: true,
    skills: [
      { name: { en: 'Git & GitHub (team workflow)', fr: 'Git & GitHub (travail en équipe)' }, projects: ['labour-code-rag', 'appointment-api'], icon: 'Git' },
      { name: 'Docker', match: ['Docker', 'Docker Compose'] },
      { name: 'Kubernetes', match: ['Kubernetes'] },
      { name: 'CI/CD (Jenkins, Ansible)', match: ['Jenkins', 'Ansible'], icon: 'Ansible' },
      { name: 'Linux & Bash', match: ['Linux', 'Bash'], training: true, icon: 'Linux' },
      { name: 'Hadoop (HDFS, YARN, MapReduce)', match: ['Hadoop'], icon: 'Hadoop' },
      { name: 'Apache Spark / PySpark', match: ['PySpark', 'Apache Spark'], icon: 'Apache Spark' },
    ],
  },
];

export type Skill = { name: Localized; repos: string[]; training: boolean; icon: string };
export type SkillGroup = { title: Localized; skills: Skill[]; wide: boolean };

const localized = (n: Localized | string): Localized => (typeof n === 'string' ? { en: n, fr: n } : n);

export const skillGroups: SkillGroup[] = groups.map((g) => ({
  title: g.title,
  wide: Boolean(g.wide),
  skills: g.skills
    .map((s) => {
      const name = localized(s.name);
      const keys = s.match ?? (s.projects ? [] : [name.en]);
      const evidence = projects.filter(
        (p) => s.projects?.includes(p.slug) || p.technologies.some((t) => keys.includes(t)),
      );
      return { name, repos: evidence.map((p) => p.repo), training: Boolean(s.training), icon: s.icon ?? name.en };
    })
    .filter((s) => s.repos.length > 0 || s.training),
}));
