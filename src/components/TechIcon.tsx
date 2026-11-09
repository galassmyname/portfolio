import { techIcon } from '../data/techIcons';

const SPRITE = `${import.meta.env.BASE_URL}icons/tech.svg`;

/** Logo of a technology from the shared sprite, or nothing when it has none. */
export default function TechIcon({ tech, className = 'tech-icon' }: { tech: string; className?: string }) {
  const id = techIcon(tech);
  if (!id) return null;
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
      <use href={`${SPRITE}#${id}`} />
    </svg>
  );
}
