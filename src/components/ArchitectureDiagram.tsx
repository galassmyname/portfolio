import type { ArchitectureLayer } from '../data/projects';
import { useT } from '../i18n/LanguageContext';

/** Layered architecture rendered as stacked rows of nodes. */
export default function ArchitectureDiagram({ layers, caption }: { layers: ArchitectureLayer[]; caption: string }) {
  const t = useT();
  return (
    <figure className="arch">
      <ol className="arch__layers" aria-label={t.caseStudy.architectureList}>
        {layers.map((layer, i) => (
          <li key={layer.label} className="arch__layer">
            <span className="arch__label mono">
              L{i} · {layer.label}
            </span>
            <ul className="arch__nodes">
              {layer.nodes.map((n) => (
                <li key={n} className="arch__node mono">
                  {n}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
      <figcaption className="arch__caption mono">{caption}</figcaption>
    </figure>
  );
}
