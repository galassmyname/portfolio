import type { ReactNode } from 'react';
import { profile } from '../data/profile';
import { revealDelay } from '../hooks/useReveal';
import { useT } from '../i18n/LanguageContext';
import ContactForm from './ContactForm';
import SectionHeader from './SectionHeader';
import { ArrowIcon, DownloadIcon, GitHubIcon, LinkedInIcon, PhoneIcon } from './Icons';
import './Contact.css';

type Channel = {
  label: string;
  value: ReactNode;
  href: string;
  icon: ReactNode;
  external: boolean;
  download?: string;
  note?: string;
};

export default function Contact() {
  const t = useT();
  // The email address is deliberately not shown on the site; visitors write through the form.
  const channels: Channel[] = [
    { label: t.contact.phone, value: profile.phone.display, href: profile.phone.href, icon: <PhoneIcon />, external: false },
    {
      label: t.contact.cv,
      value: t.contact.cvValue,
      href: profile.cv.url,
      icon: <DownloadIcon />,
      external: false,
      download: profile.cv.fileName,
      note: t.contact.cvNote,
    },
    { label: 'GitHub', value: `github.com/${profile.githubUser}`, href: profile.githubUrl, icon: <GitHubIcon />, external: true },
    { label: 'LinkedIn', value: profile.name, href: profile.linkedinUrl, icon: <LinkedInIcon />, external: true },
  ];

  return (
    <section id="contact" className="section contact" aria-labelledby="contact-title">
      <div className="container">
        <SectionHeader
          index="05"
          label={t.contact.label}
          titleId="contact-title"
          title={
            <>
              {t.contact.titleStart} <em>{t.contact.titleEnd}</em>
            </>
          }
          lede={t.contact.lede}
        />

        <div className="contact__layout">
          <div data-reveal>
            <ContactForm />
          </div>

          <div className="contact__direct" data-reveal style={revealDelay(120)}>
            <h3 className="contact__direct-title mono">{t.contact.direct}</h3>
            <ul className="contact__channels">
              {channels.map((c) => (
                <li key={c.href}>
                  <a
                    href={c.href}
                    download={c.download}
                    {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  >
                    <span className="contact__icon" aria-hidden="true">
                      {c.icon}
                    </span>
                    <span className="contact__label mono">
                      {c.label}
                      {c.note && <span className="contact__note"> · {c.note}</span>}
                    </span>
                    <span className="contact__value">
                      {c.value}
                      {c.external && <span className="sr-only"> {t.newTab}</span>}
                    </span>
                    {c.download ? (
                      <DownloadIcon className="contact__arrow" />
                    ) : (
                      <ArrowIcon direction={c.external ? 'up-right' : 'right'} className="contact__arrow" />
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
