import { useState, type CSSProperties } from 'react';
import { profile } from '../data/profile';
import { useT } from '../i18n/LanguageContext';
import './HeroPortrait.css';

/**
 * Official portrait (Orange Digital Center photo session), shown full frame
 * in its original 2:3 proportions: never cropped, filtered or retouched.
 * A thin frame and a soft offset outline sit behind it; the availability
 * badge rests on its lower edge. Until the photo loads, a monogram is shown.
 */
export default function HeroPortrait() {
  const t = useT();
  const [missing, setMissing] = useState(false);

  return (
    <div className="hp hero__in" style={{ '--i': 3 } as CSSProperties}>
      <figure className="hp__frame">
        {missing ? (
          <div className="hp__fallback" role="img" aria-label={t.seo.photoAlt}>
            <span aria-hidden="true">SFM</span>
          </div>
        ) : (
          <picture>
            <source
              type="image/webp"
              srcSet={profile.photoSources}
              sizes="(min-width: 960px) 26rem, (min-width: 600px) 22rem, 82vw"
            />
            <img
              className="hp__img"
              src={profile.photo}
              alt={t.seo.photoAlt}
              width={profile.photoSize.width}
              height={profile.photoSize.height}
              {...{ fetchpriority: 'high' }}
              decoding="async"
              onError={() => setMissing(true)}
            />
          </picture>
        )}
      </figure>

      <p className="hp__status">
        <span className="hp__status-dot" aria-hidden="true" />
        {t.hero.badge}
      </p>
    </div>
  );
}
