import type { Lang } from '../i18n/ui';

export type Localized = Record<Lang, string>;

export const profile = {
  name: 'Serigne Fallou Mbaye',
  role: { en: 'Software Engineer', fr: 'Ingénieur logiciel' } as Localized,
  specialization: { en: 'AI & Machine Learning', fr: 'IA & Machine Learning' } as Localized,
  location: { en: 'Dakar, Senegal', fr: 'Dakar, Sénégal' } as Localized,
  tagline: {
    en: 'Specialising in AI, I build applications and intelligent solutions.',
    fr: 'Spécialisé en IA, je développe des applications et des solutions intelligentes.',
  } as Localized,
  githubUser: 'galassmyname',
  githubUrl: 'https://github.com/galassmyname',
  linkedinUrl: 'https://sn.linkedin.com/in/serigne-fallou-mbaye-200a57280',
  phone: { display: '+221 77 445 09 21', href: 'tel:+221774450921' },
  /** CV (French, PDF) served from public/cv/. */
  cv: {
    url: `${import.meta.env.BASE_URL}cv/Serigne_Fallou_Mbaye_CV.pdf`,
    fileName: 'Serigne_Fallou_Mbaye_CV.pdf',
  },
  /** Drop the portrait at public/images/profile.jpg. */
  photo: `${import.meta.env.BASE_URL}images/profile.jpg`,
};

export type EducationEntry = {
  /** 'training' = professional programme, 'degree' = university diploma (sets the icon). */
  kind: 'training' | 'degree';
  institution: string;
  credential: Localized;
  field: Localized;
  /** Dates as listed on the CV (public/cv/). */
  period: Localized;
  inProgress?: boolean;
  description?: Localized;
};

// Dates and entries follow the CV provided by Serigne Fallou Mbaye.
export const education: EducationEntry[] = [
  {
    kind: 'training',
    institution: 'Sonatel Academy',
    credential: { en: 'Training · Promotion 1 (P1 IA)', fr: 'Formation · Promotion 1 (P1 IA)' },
    field: { en: 'Artificial Intelligence', fr: 'Intelligence Artificielle' },
    period: { en: 'Jul 2026 – Dec 2026', fr: 'juil. 2026 – déc. 2026' },
    inProgress: true,
    description: {
      en: 'From data and machine learning to deep learning, LLMs, agents and automation.',
      fr: 'Des données et du machine learning au deep learning, aux LLM, aux agents et à l’automatisation.',
    },
  },
  {
    kind: 'degree',
    institution: 'Université Alioune Diop de Bambey',
    credential: { en: 'Master 2', fr: 'Master 2' },
    field: { en: 'Information Systems', fr: 'Systèmes d’information' },
    period: { en: '2026 – 2027', fr: '2026 – 2027' },
    inProgress: true,
  },
  {
    kind: 'degree',
    institution: 'Université Alioune Diop de Bambey',
    credential: { en: 'Master 1', fr: 'Master 1' },
    field: { en: 'Information Systems', fr: 'Systèmes d’information' },
    period: { en: '2025 – 2026', fr: '2025 – 2026' },
  },
  {
    kind: 'degree',
    institution: 'Université Alioune Diop de Bambey',
    credential: { en: 'Licence', fr: 'Licence' },
    field: { en: 'Systems, Networks and Telecommunications', fr: 'Systèmes, Réseaux et Télécommunications' },
    period: { en: '2021 – 2024', fr: '2021 – 2024' },
  },
];
