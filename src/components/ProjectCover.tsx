import type { ReactNode } from 'react';
import type { Localized } from '../data/profile';
import type { Category, Project } from '../data/projects';
import { useLang } from '../i18n/LanguageContext';

/**
 * Card cover for a project.
 *
 * Real visuals come first: images published in the project's own repository
 * (dataset samples, charts produced by its notebooks), converted to 640×360
 * WebP in public/images/projects/. No screenshot is staged or invented.
 *
 * Every other project gets a drawn illustration instead: a pattern that
 * evokes its subject, an icon, and a tint by category. It is decorative and
 * clearly not a screenshot, so it is hidden from assistive technology.
 */

const IMG = `${import.meta.env.BASE_URL}images/projects/`;

const images: Record<string, { file: string; alt: Localized }> = {
  'waste-image-dataset': {
    file: 'waste-image-dataset.webp',
    alt: {
      en: 'Six images from the cleaned dataset, one per waste class',
      fr: 'Six images du dataset nettoyé, une par classe de déchets',
    },
  },
  'iot-sensor-classifier': {
    file: 'iot-sensor-classifier.webp',
    alt: {
      en: 'Confusion matrix of the k-NN classifier, from the project notebook',
      fr: 'Matrice de confusion du classifieur k-NN, issue du notebook du projet',
    },
  },
  'energy-consumption-nn': {
    file: 'energy-consumption-nn.webp',
    alt: {
      en: 'Predicted versus actual energy consumption, from the project notebook',
      fr: 'Consommation prédite et consommation réelle, graphique issu du notebook du projet',
    },
  },
  'smart-building-tabular': {
    file: 'smart-building-tabular.webp',
    alt: {
      en: 'Correlation matrix of the smart-building dataset, from the project notebook',
      fr: 'Matrice de corrélation du dataset de bâtiment intelligent, issue du notebook du projet',
    },
  },
  'iot-seaborn': {
    file: 'iot-seaborn.webp',
    alt: {
      en: 'Temperature distribution per building, from the project notebook',
      fr: 'Distribution des températures par bâtiment, issue du notebook du projet',
    },
  },
};

/* ─── Illustrations ──────────────────────────────────────────────────────
   Drawn on a 320 × 160 canvas. The icon badge covers the centre
   (x 128–192, y 48–112), so patterns live mostly around it. Classes:
   art__m muted line · art__l tinted line · art__f tinted fill · art__s solid. */

type Motif =
  | 'map' | 'services' | 'shop' | 'pipeline' | 'text' | 'food' | 'hotel' | 'calendar' | 'books'
  | 'weather' | 'desktop' | 'dictionary' | 'dashboard' | 'tiers' | 'cluster' | 'terminal'
  | 'layout' | 'lines' | 'table' | 'dots' | 'tree';

const motifs: Record<Motif, ReactNode> = {
  map: (
    <>
      <path className="art__m" d="M0 34h320M0 128h320M52 0v160M108 0v160M232 0v160M276 0v160" />
      <path className="art__l art__dash" d="M18 146c40-6 38-52 70-60s60 30 96 18 70-58 118-80" />
      <circle className="art__s" cx="18" cy="146" r="4" />
      <circle className="art__s" cx="88" cy="86" r="4" />
      <circle className="art__s" cx="302" cy="24" r="4" />
    </>
  ),
  services: (
    <>
      <rect className="art__f art__l" x="18" y="62" width="64" height="36" rx="7" />
      <path className="art__l" d="M82 80h46M192 80h22M214 30v100M214 30h24M214 80h24M214 130h24" />
      <rect className="art__f art__l" x="238" y="14" width="64" height="32" rx="7" />
      <rect className="art__f art__l" x="238" y="64" width="64" height="32" rx="7" />
      <rect className="art__f art__l" x="238" y="114" width="64" height="32" rx="7" />
    </>
  ),
  shop: (
    <>
      {[18, 70, 222, 274].map((x) =>
        [18, 88].map((y) => (
          <g key={`${x}-${y}`}>
            <rect className="art__m" x={x} y={y} width="40" height="54" rx="6" />
            <rect className="art__f" x={x + 6} y={y + 6} width="28" height="24" rx="4" />
            <path className="art__l" d={`M${x + 6} ${y + 40}h18`} />
          </g>
        )),
      )}
    </>
  ),
  pipeline: (
    <>
      <path className="art__l" d="M30 80h98M192 80h98" />
      {[30, 82, 238, 290].map((x) => (
        <circle key={x} className="art__f art__l" cx={x} cy="80" r="11" />
      ))}
      <path className="art__m" d="M30 40h40M82 120h40M238 40h40M250 120h40" />
    </>
  ),
  text: (
    <>
      {[24, 46, 68, 90, 112, 134].map((y, i) => (
        <path key={y} className="art__m" d={`M20 ${y}h${[92, 70, 96, 60, 88, 74][i]}M208 ${y}h${[92, 64, 84, 96, 58, 80][i]}`} />
      ))}
      <rect className="art__f art__l" x="44" y="40" width="34" height="12" rx="6" />
      <rect className="art__f art__l" x="232" y="84" width="40" height="12" rx="6" />
      <rect className="art__f art__l" x="20" y="106" width="30" height="12" rx="6" />
      <rect className="art__f art__l" x="262" y="18" width="34" height="12" rx="6" />
    </>
  ),
  food: (
    <>
      {[22, 66, 110].map((y) => (
        <g key={y}>
          <circle className="art__f art__l" cx="32" cy={y + 12} r="11" />
          <path className="art__m" d={`M52 ${y + 6}h56M52 ${y + 18}h36`} />
          <circle className="art__f art__l" cx="226" cy={y + 12} r="11" />
          <path className="art__m" d={`M246 ${y + 6}h56M246 ${y + 18}h40`} />
        </g>
      ))}
    </>
  ),
  hotel: (
    <>
      <path className="art__m" d="M0 146h320" />
      <rect className="art__f art__l" x="20" y="54" width="44" height="92" rx="3" />
      <rect className="art__f art__l" x="72" y="86" width="40" height="60" rx="3" />
      <rect className="art__f art__l" x="214" y="70" width="40" height="76" rx="3" />
      <rect className="art__f art__l" x="262" y="40" width="40" height="106" rx="3" />
      {[30, 46].map((x) => [66, 84, 102, 120].map((y) => <rect key={`${x}${y}`} className="art__s art__dim" x={x} y={y} width="7" height="7" rx="1" />))}
      {[272, 288].map((x) => [54, 72, 90, 108].map((y) => <rect key={`${x}${y}`} className="art__s art__dim" x={x} y={y} width="7" height="7" rx="1" />))}
    </>
  ),
  calendar: (
    <>
      {[0, 1, 2, 3].map((r) =>
        [0, 1, 2, 3, 4, 5, 6].map((c) => {
          const x = 14 + c * 44;
          const y = 16 + r * 34;
          const on = (r * 7 + c) % 5 === 1;
          return <rect key={`${r}${c}`} className={on ? 'art__f art__l' : 'art__m'} x={x} y={y} width="30" height="24" rx="5" />;
        }),
      )}
    </>
  ),
  books: (
    <>
      <path className="art__m" d="M10 140h300" />
      {[
        [18, 70], [34, 50], [50, 82], [66, 60], [84, 74], [100, 46],
        [208, 64], [224, 84], [240, 52], [258, 76], [274, 58], [290, 88],
      ].map(([x, h]) => (
        <rect key={x} className="art__f art__l" x={x} y={140 - h} width="12" height={h} rx="2" />
      ))}
    </>
  ),
  weather: (
    <>
      <circle className="art__f art__l" cx="270" cy="38" r="18" />
      <path className="art__l" d="M270 8v6M270 62v6M240 38h6M294 38h6M249 17l4 4M287 55l4 4M291 17l-4 4M253 55l-4 4" />
      <path className="art__f art__l" d="M28 66a18 18 0 0 1 34-8 14 14 0 1 1 6 28H34a14 14 0 0 1-6-20Z" />
      <path className="art__m" d="M14 140c40-30 70 10 110-6M200 132c34-24 66 8 106-12" />
    </>
  ),
  desktop: (
    <>
      <rect className="art__m" x="12" y="14" width="296" height="132" rx="8" />
      <path className="art__m" d="M12 32h296" />
      <circle className="art__s art__dim" cx="24" cy="23" r="3" />
      <circle className="art__s art__dim" cx="34" cy="23" r="3" />
      {[[30, 46], [52, 70], [74, 34], [96, 58], [220, 44], [242, 76], [264, 54], [286, 86]].map(([x, h]) => (
        <rect key={x} className="art__f art__l" x={x} y={134 - h} width="14" height={h} rx="2" />
      ))}
    </>
  ),
  dictionary: (
    <>
      {[26, 52, 78, 104, 130].map((y, i) => (
        <g key={y}>
          <path className="art__l" d={`M18 ${y}h${[54, 40, 62, 46, 58][i]}`} />
          <path className="art__m" d={`M90 ${y}h${[26, 30, 18, 28, 22][i]}`} />
          <path className="art__m" d={`M206 ${y}h${[26, 18, 30, 22, 28][i]}`} />
          <path className="art__l" d={`M246 ${y}h${[56, 44, 60, 50, 40][i]}`} />
        </g>
      ))}
    </>
  ),
  dashboard: (
    <>
      <circle className="art__m" cx="62" cy="80" r="34" strokeWidth="10" />
      <path className="art__l" d="M62 46a34 34 0 0 1 32 46" strokeWidth="10" />
      <path className="art__m" d="M214 140V24M214 140h96" />
      <path className="art__l" d="M220 118l22-26 20 12 22-36 20-14" />
      <circle className="art__s" cx="284" cy="68" r="3.5" />
    </>
  ),
  tiers: (
    <>
      {[18, 64, 110].map((y, i) => (
        <g key={y}>
          <rect className={i === 1 ? 'art__f art__l' : 'art__m'} x="14" y={y} width="292" height="32" rx="7" />
          <circle className="art__s art__dim" cx="30" cy={y + 16} r="3.5" />
          <path className="art__m" d={`M42 ${y + 16}h50M228 ${y + 16}h60`} />
        </g>
      ))}
    </>
  ),
  cluster: (
    <>
      <path className="art__m" d="M40 36 96 64M40 124l56-28M96 64v32M224 64l56-28M224 96l56 28M224 64v32M96 64h32M192 64h32M96 96h32M192 96h32" />
      {[[40, 36], [40, 124], [96, 64], [96, 96], [224, 64], [224, 96], [280, 36], [280, 124]].map(([x, y]) => (
        <circle key={`${x}${y}`} className="art__f art__l" cx={x} cy={y} r="9" />
      ))}
    </>
  ),
  terminal: (
    <>
      <rect className="art__m" x="12" y="14" width="296" height="132" rx="8" />
      <path className="art__m" d="M12 32h296" />
      {[52, 76, 100, 124].map((y, i) => (
        <g key={y}>
          <path className="art__l" d={`m24 ${y - 5} 6 5-6 5`} />
          <path className="art__m" d={`M38 ${y}h${[60, 76, 46, 66][i]}M226 ${y}h${[60, 40, 70, 52][i]}`} />
        </g>
      ))}
    </>
  ),
  layout: (
    <>
      <rect className="art__m" x="12" y="14" width="296" height="132" rx="8" />
      <rect className="art__f" x="12" y="14" width="58" height="132" rx="8" />
      <path className="art__l" d="M24 34h34M24 50h26M24 66h30M24 82h22" />
      <rect className="art__m" x="84" y="26" width="34" height="108" rx="6" />
      <rect className="art__f art__l" x="206" y="26" width="90" height="30" rx="6" />
      <rect className="art__m" x="206" y="66" width="90" height="68" rx="6" />
    </>
  ),
  lines: (
    <>
      <path className="art__m" d="M16 140h288M16 140V18" />
      <path className="art__l" d="M16 112c30-4 40-40 74-34s38 30 70 16 50-54 84-46 40 20 60 4" />
      <path className="art__m art__dash" d="M16 128c36 0 48-22 80-18s44 10 76 0 56-28 90-20 30 10 42 6" />
      {[[90, 78], [244, 52]].map(([x, y]) => (
        <circle key={x} className="art__s" cx={x} cy={y} r="3.5" />
      ))}
    </>
  ),
  table: (
    <>
      <rect className="art__m" x="12" y="16" width="296" height="128" rx="8" />
      <rect className="art__f" x="12" y="16" width="296" height="24" rx="8" />
      <path className="art__m" d="M12 64h296M12 88h296M12 112h296M86 16v128M234 16v128" />
      <path className="art__l" d="M24 28h40M246 28h44M24 76h46M246 100h40" />
    </>
  ),
  dots: (
    <>
      {[0, 1, 2, 3, 4].map((r) =>
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((c) => {
          const on = (r * 5 + c * 3) % 7 === 0;
          return <circle key={`${r}${c}`} className={on ? 'art__s' : 'art__s art__dim'} cx={20 + c * 25.5} cy={20 + r * 30} r={on ? 4 : 2.5} />;
        }),
      )}
    </>
  ),
  tree: (
    <>
      <path className="art__m" d="M30 22v112M30 44h28M30 72h28M30 100h28M30 128h28M232 30v96M232 54h28M232 78h28M232 102h28M232 126h28" />
      {[44, 72, 100, 128].map((y) => (
        <rect key={y} className="art__f art__l" x="62" y={y - 7} width="52" height="14" rx="4" />
      ))}
      {[54, 78, 102, 126].map((y) => (
        <rect key={y} className="art__f art__l" x="264" y={y - 7} width="42" height="14" rx="4" />
      ))}
      <rect className="art__s art__dim" x="22" y="14" width="16" height="12" rx="3" />
      <rect className="art__s art__dim" x="224" y="22" width="16" height="12" rx="3" />
    </>
  ),
};

/* Icons in the centre badge (24 × 24 stroke). */
type Glyph =
  | 'bus' | 'network' | 'cart' | 'workflow' | 'text' | 'utensils' | 'bed' | 'calendar' | 'book' | 'cloud'
  | 'monitor' | 'languages' | 'pie' | 'layers' | 'server' | 'database' | 'chat' | 'lineChart' | 'columns'
  | 'grid' | 'terminal';

const glyphs: Record<Glyph, ReactNode> = {
  bus: <path d="M6 17V6a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v11M6 17h12M6 17v2M18 17v2M6 11h12M9 14h.01M15 14h.01" />,
  network: <path d="M12 3v4M5 17v-3a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3M12 12V7M9 3h6v4H9zM2 17h6v4H2zM9 17h6v4H9zM16 17h6v4h-6zM12 17v-5" />,
  cart: <path d="M3 4h2l2.4 11.2a1 1 0 0 0 1 .8h8.8a1 1 0 0 0 1-.8L20 8H6.2M9 20h.01M17 20h.01" />,
  workflow: <path d="M4 4h6v6H4zM14 14h6v6h-6zM7 10v4a3 3 0 0 0 3 3h4M17 14v-4a3 3 0 0 0-3-3h-4" />,
  text: <path d="M4 6h16M4 10h10M4 14h16M4 18h8M17 17l1.5 1.5L21 16" />,
  utensils: <path d="M6 3v7a2 2 0 0 0 4 0V3M8 10v11M17 21V3c-2 1-3 4-3 7h3" />,
  bed: <path d="M3 18V6M3 13h18v5M21 18v-3a3 3 0 0 0-3-3h-7v1M7 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />,
  calendar: <path d="M4 6h16v14H4zM4 10h16M8 3v4M16 3v4M8 14h2M14 14h2M8 17h2" />,
  book: <path d="M4 5a2 2 0 0 1 2-2h13v15H6a2 2 0 0 0-2 2V5ZM4 20a2 2 0 0 0 2 1h13v-3M9 7h6" />,
  cloud: <path d="M12 4v2M5.6 6.6 7 8M4 13h2M18.4 6.6 17 8M8.5 13a3.5 3.5 0 0 1 6.9-1H16a3 3 0 0 1 0 6H9a3 3 0 0 1-.5-5Z" />,
  monitor: <path d="M3 4h18v12H3zM8 20h8M12 16v4M7 13v-3M11 13V8M15 13v-2" />,
  languages: <path d="M3 5h9M7.5 3v2M10 5c-.7 4-3.4 7-6.5 8.5M5 8c1 2.3 3 4 5.5 5M13 21l4-9 4 9M14.4 18h5.2" />,
  pie: <path d="M12 3v9h9a9 9 0 1 1-9-9ZM15 3.5A9 9 0 0 1 20.5 9H15V3.5Z" />,
  layers: <path d="m12 3 9 5-9 5-9-5 9-5ZM3 12.5l9 5 9-5M3 17l9 5 9-5" />,
  server: <path d="M4 4h16v6H4zM4 14h16v6H4zM8 7h.01M8 17h.01M12 10v4" />,
  database: <path d="M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3ZM4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" />,
  chat: <path d="M4 5h16v11H9l-5 4V5ZM8 9h8M8 12h5" />,
  lineChart: <path d="M4 4v16h16M7 15l4-5 3 3 5-6" />,
  columns: <path d="M4 4h16v16H4zM4 9h16M10 4v16M15 4v16" />,
  grid: <path d="M5 5h.01M12 5h.01M19 5h.01M5 12h.01M12 12h.01M19 12h.01M5 19h.01M12 19h.01M19 19h.01" />,
  terminal: <path d="m5 8 4 4-4 4M12 17h7M3 4h18v16H3z" />,
};

const art: Record<string, [Motif, Glyph]> = {
  sunutransport: ['map', 'bus'],
  'student-microservices': ['services', 'network'],
  'tech-assist-dakar': ['shop', 'cart'],
  'distributed-system': ['pipeline', 'workflow'],
  'review-text-preprocessing': ['text', 'text'],
  'km-food': ['food', 'utensils'],
  'red-product': ['hotel', 'bed'],
  'appointment-api': ['calendar', 'calendar'],
  'book-management': ['books', 'book'],
  'meteo-app': ['weather', 'cloud'],
  techassist: ['desktop', 'monitor'],
  'wolof-dictionary': ['dictionary', 'languages'],
  'donnees-decisions': ['dashboard', 'pie'],
  'openshift-3-tier': ['tiers', 'layers'],
  'cluster-network-lab': ['cluster', 'server'],
  'dataset-manager': ['terminal', 'database'],
  'ai-workspace-ui': ['layout', 'chat'],
  'iot-matplotlib': ['lines', 'lineChart'],
  'iot-pandas': ['table', 'columns'],
  'iot-numpy': ['dots', 'grid'],
  'linux-ai-setup': ['tree', 'terminal'],
};

/** Tint by main category, all drawn from the site's blue–cyan range. */
const tint: Record<Category, string> = {
  'ML & Data': 'cyan',
  'Deep Learning & CV': 'violet',
  'Backend & API': 'emerald',
  'Full Stack': 'indigo',
  Other: 'amber',
};

export const projectTone = (project: Project) => tint[project.categories[0]];

/**
 * The visual sits in a floating "window" (title bar with the repository
 * name) on a tinted, softly lit backdrop, so real images and illustrations
 * share one presentation.
 */
export default function ProjectCover({ project }: { project: Project }) {
  const { lang } = useLang();
  const image = images[project.slug];
  const [motif, glyph] = art[project.slug] ?? ['dots', 'grid'];

  return (
    <div className={`cover cover--${projectTone(project)}${image ? ' cover--image' : ' cover--art'}`}>
      <div className="cover__window">
        <div className="cover__bar" aria-hidden="true">
          <i />
          <i />
          <i />
          <span className="cover__url">{project.repo}</span>
        </div>
        <div className="cover__screen">
          {image ? (
            <img
              className="cover__img"
              src={IMG + image.file}
              alt={image.alt[lang]}
              width={640}
              height={360}
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div className="cover__art-wrap" aria-hidden="true">
              <svg className="cover__art" viewBox="0 0 320 160" preserveAspectRatio="xMidYMid slice" focusable="false">
                <g className="cover__motif">{motifs[motif]}</g>
              </svg>
              <span className="cover__badge">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" focusable="false">
                  {glyphs[glyph]}
                </svg>
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
