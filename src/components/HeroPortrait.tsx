import { useState } from 'react';
import { profile } from '../data/profile';
import { useT } from '../i18n/LanguageContext';
import './HeroPortrait.css';

/**
 * Round portrait (public/images/profile.jpg) inside a thin ring whose cyan arc
 * draws itself once on load, with the availability badge resting on its
 * lower edge. The photo is only cropped to a circle — never filtered or
 * distorted. Until the photo exists, a monogram is shown instead.
 */
export default function HeroPortrait() {
  const t = useT();
  const [missing, setMissing] = useState(false);

  return (
    <div className="hp">
      <svg className="hp__ring" viewBox="0 0 200 200" aria-hidden="true" focusable="false">
        <circle className="hp__track" cx="100" cy="100" r="96" />
        <circle className="hp__arc" cx="100" cy="100" r="96" pathLength="100" />
      </svg>

      <figure className="hp__frame">
        {missing ? (
          <div className="hp__fallback" role="img" aria-label={t.seo.photoAlt}>
            <span aria-hidden="true">SFM</span>
          </div>
        ) : (
          <img
            className="hp__img"
            src={profile.photo}
            alt={t.seo.photoAlt}
            width={395}
            height={395}
            onError={() => setMissing(true)}
          />
        )}
      </figure>

      <p className="hp__status">
        <span className="hp__status-dot" aria-hidden="true" />
        {t.hero.badge}
      </p>
    </div>
  );
}
