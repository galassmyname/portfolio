import type { Localized } from './profile';
import { projects } from './projects';

/**
 * Skills shown on the site, each with its evidence:
 *  - `match`: technology names in projects.ts that demonstrate it, or
 *  - `projects`: project slugs that demonstrate a concept (e.g. data preparation);
 *  - `training`: covered in the Sonatel Academy P1 IA programme.
 *
 * A skill with public projects shows how many use it. A skill covered only in
 * training is labelled as such. A skill with neither is not displayed.
 */
type SkillDef = { name: Localized | string; match?: string[]; projects?: string[]; training?: boolean; icon?: string };
type SkillGroupDef = { title: Localized; skills: SkillDef[]; wide?: boolean };

const groups: SkillGroupDef[] = [
  {
    title: { en: 'Programming & fundamentals', fr: 'Programmation & fondamentaux' },
    skills: [
      { name: 'Python', training: true },
      { name: 'Java', match: ['Java', 'Java 17'] },
      { name: 'TypeScript' },
      { name: 'JavaScript', training: true },
      { name: 'PHP' },
      { name: 'SQL', match: ['MySQL', 'PostgreSQL', 'SQLite'] },
      { name: 'HTML & CSS', match: ['HTML', 'CSS'], training: true, icon: 'HTML' },
      { name: 'Linux & Bash', match: ['Linux', 'Bash'], training: true, icon: 'Linux' },
    ],
  },
  {
    title: { en: 'Data & machine learning', fr: 'Données & machine learning' },
    skills: [
      {
        name: { en: 'Data preparation', fr: 'Préparation des données' },
        projects: ['waste-image-dataset', 'review-text-preprocessing', 'smart-building-tabular', 'iot-pandas'],
        training: true,
      },
      {
        name: { en: 'Exploratory data analysis', fr: 'Analyse exploratoire' },
        projects: ['iot-seaborn', 'iot-matplotlib', 'smart-building-tabular'],
      },
      { name: 'pandas & NumPy', match: ['pandas', 'NumPy'], training: true, icon: 'pandas' },
      { name: 'Matplotlib & Seaborn', match: ['Matplotlib', 'Seaborn'] },
      {
        name: { en: 'ML with scikit-learn', fr: 'ML avec scikit-learn' },
        match: ['scikit-learn'],
        icon: 'scikit-learn',
        training: true,
      },
      {
        name: { en: 'NLP (NLTK, spaCy)', fr: 'NLP (NLTK, spaCy)' },
        projects: ['review-text-preprocessing'],
        icon: 'spaCy',
      },
      { name: { en: 'No-code ML with KNIME', fr: 'ML no code avec KNIME' }, training: true },
    ],
  },
  {
    title: { en: 'Deep learning', fr: 'Deep learning' },
    skills: [
      {
        name: { en: 'TensorFlow / Keras', fr: 'TensorFlow / Keras' },
        projects: ['energy-consumption-nn'],
        icon: 'TensorFlow / Keras',
        training: true,
      },
      {
        name: { en: 'Image preparation (vision)', fr: 'Préparation d’images (vision)' },
        projects: ['waste-image-dataset'],
      },
      { name: { en: 'Voice and video AI', fr: 'IA voix et vidéo' }, training: true },
    ],
  },
  {
    title: { en: 'Generative AI & LLMs', fr: 'IA générative & LLM' },
    skills: [
      { name: { en: 'Prompt engineering', fr: 'Prompt engineering' }, training: true },
      { name: { en: 'LLMs and their ecosystem', fr: 'LLM et écosystème' }, training: true },
      { name: { en: 'LLM-based applications', fr: 'Applications basées sur les LLM' }, training: true },
      { name: { en: 'AI agents', fr: 'Agents IA' }, training: true },
    ],
  },
  {
    title: { en: 'AI engineering & deployment', fr: 'Ingénierie IA & déploiement' },
    skills: [
      {
        name: { en: 'REST APIs', fr: 'API REST' },
        projects: ['student-microservices', 'appointment-api', 'distributed-system', 'sunutransport', 'red-product', 'book-management'],
        training: true,
      },
      { name: 'Docker', match: ['Docker', 'Docker Compose'] },
      { name: 'Kubernetes', match: ['Kubernetes'] },
      { name: 'CI/CD (Jenkins, Ansible)', match: ['Jenkins', 'Ansible'], icon: 'Ansible' },
      { name: { en: 'LLM-oriented MLOps', fr: 'MLOps orienté LLM' }, training: true },
      { name: { en: 'AI automation', fr: 'Automatisation IA' }, training: true },
    ],
  },
  {
    title: { en: 'Software engineering', fr: 'Génie logiciel' },
    skills: [
      { name: 'Spring Boot' },
      { name: 'Django REST Framework', icon: 'Django' },
      { name: 'Node.js / Express', match: ['Express'], icon: 'Node.js' },
      { name: 'Laravel' },
      { name: 'Angular' },
      { name: 'React' },
      { name: 'Next.js' },
      { name: 'PostgreSQL' },
      { name: 'MySQL' },
      { name: 'MongoDB' },
    ],
  },
  {
    title: { en: 'Professional skills', fr: 'Compétences professionnelles' },
    wide: true,
    skills: [
      { name: { en: 'Teamwork', fr: 'Travail d’équipe' }, training: true },
      { name: { en: 'Solving data problems', fr: 'Résolution de problèmes data' }, training: true },
      { name: { en: 'Technical communication', fr: 'Communication technique' }, training: true },
      { name: { en: 'Data ethics', fr: 'Éthique des données' }, training: true },
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
