import { profile } from '../data/profile';
import { useLang } from '../i18n/LanguageContext';
import './Footer.css';

export default function Footer() {
  const { lang } = useLang();

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div>
          <p className="footer__name">{profile.name}</p>
          <p className="footer__role mono">
            {profile.role[lang]} · {profile.specialization[lang]}
          </p>
        </div>
        <ul className="footer__links mono">
          <li>
            <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          </li>
          <li>
            <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          </li>
        </ul>
        <p className="footer__copy mono">© 2026 {profile.name}</p>
      </div>
    </footer>
  );
}
