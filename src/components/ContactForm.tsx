import { useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { profile } from '../data/profile';
import { useT } from '../i18n/LanguageContext';
import type { UI } from '../i18n/ui';
import { sendMessage, type ContactMessage, type SendResult } from '../lib/sendMessage';
import { ArrowIcon } from './Icons';

type Field = keyof ContactMessage;
type ErrorKey = keyof UI['contact']['form']['errors'];
type Errors = Partial<Record<Field, ErrorKey>>;
type Status = 'idle' | 'sending' | SendResult;

const EMPTY: ContactMessage = { name: '', email: '', subject: '', message: '' };
const FIELDS: Field[] = ['name', 'email', 'subject', 'message'];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MAX_LENGTH: Record<Field, number> = { name: 100, email: 254, subject: 150, message: 5000 };

function validate(v: ContactMessage): Errors {
  const errors: Errors = {};
  if (!v.name.trim()) errors.name = 'nameRequired';
  if (!v.email.trim()) errors.email = 'emailRequired';
  else if (!EMAIL_RE.test(v.email.trim())) errors.email = 'emailInvalid';
  if (!v.subject.trim()) errors.subject = 'subjectRequired';
  if (!v.message.trim()) errors.message = 'messageRequired';
  else if (v.message.trim().length < 10) errors.message = 'messageTooShort';
  return errors;
}

export default function ContactForm() {
  const t = useT();
  const f = t.contact.form;
  const [values, setValues] = useState<ContactMessage>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [honeypot, setHoneypot] = useState(false);
  const refs = useRef<Partial<Record<Field, HTMLInputElement | HTMLTextAreaElement | null>>>({});

  const sending = status === 'sending';

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const next = { ...values, [e.target.name]: e.target.value };
    setValues(next);
    // Re-validate live only after a first submit attempt, so users aren't nagged while typing.
    if (submitted) setErrors(validate(next));
    if (status !== 'idle' && status !== 'sending') setStatus('idle');
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (sending) return;

    setSubmitted(true);
    const found = validate(values);
    setErrors(found);
    const firstInvalid = FIELDS.find((field) => found[field]);
    if (firstInvalid) {
      refs.current[firstInvalid]?.focus();
      return;
    }

    // Bots fill the hidden checkbox; drop those submissions silently.
    if (honeypot) {
      setStatus('sent');
      return;
    }

    setStatus('sending');
    const trimmed = Object.fromEntries(FIELDS.map((k) => [k, values[k].trim()])) as ContactMessage;
    const result = await sendMessage(trimmed);
    setStatus(result);
    if (result === 'sent') {
      setValues(EMPTY);
      setSubmitted(false);
      setErrors({});
    }
  };

  const hasErrors = submitted && Object.keys(errors).length > 0;

  const field = (name: Field, opts: { type?: string; autoComplete?: string; multiline?: boolean; wide?: boolean }) => {
    const id = `contact-${name}`;
    const errorId = `${id}-error`;
    const error = errors[name];
    const common = {
      id,
      name,
      value: values[name],
      onChange,
      maxLength: MAX_LENGTH[name],
      required: true,
      disabled: sending,
      placeholder: f[`${name}Placeholder`],
      'aria-invalid': error ? true : undefined,
      'aria-describedby': error ? errorId : undefined,
      className: `cform__input${error ? ' cform__input--invalid' : ''}`,
    } as const;

    return (
      <div className={`cform__field${opts.wide ? ' cform__field--wide' : ''}`}>
        <label className="cform__label mono" htmlFor={id}>
          {f[name]}
        </label>
        {opts.multiline ? (
          <textarea {...common} ref={(el) => (refs.current[name] = el)} rows={6} />
        ) : (
          <input
            {...common}
            ref={(el) => (refs.current[name] = el)}
            type={opts.type ?? 'text'}
            autoComplete={opts.autoComplete}
            spellCheck={name === 'email' ? false : undefined}
          />
        )}
        {error && (
          <p className="cform__error" id={errorId}>
            {f.errors[error]}
          </p>
        )}
      </div>
    );
  };

  // Fallback contact when the form cannot send (the email address is not shown on the site).
  const directLink = (
    <>
      <a className="cform__mail" href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer">
        LinkedIn
        <span className="sr-only"> {t.newTab}</span>
      </a>{' '}
      {f.orPhone}{' '}
      <a className="cform__mail" href={profile.phone.href}>
        {profile.phone.display}
      </a>
    </>
  );

  return (
    <form className="cform spot" noValidate onSubmit={onSubmit} aria-labelledby="contact-form-title" aria-busy={sending}>
      <div className="cform__head">
        <h3 id="contact-form-title" className="cform__title">
          {f.title}
        </h3>
        <p className="cform__hint mono">{f.allRequired}</p>
      </div>

      <div className="cform__grid">
        {field('name', { autoComplete: 'name' })}
        {field('email', { type: 'email', autoComplete: 'email' })}
        {field('subject', { wide: true })}
        {field('message', { multiline: true, wide: true })}
      </div>

      {/* Honeypot for spam bots — hidden from people and assistive technology. */}
      <input
        type="checkbox"
        name="botcheck"
        className="cform__honeypot"
        tabIndex={-1}
        aria-hidden="true"
        checked={honeypot}
        onChange={(e) => setHoneypot(e.target.checked)}
      />

      <div className="cform__footer">
        <button type="submit" className="btn btn--primary cform__submit" disabled={sending}>
          {sending ? (
            <>
              <span className="cform__spinner" aria-hidden="true" />
              {f.sending}
            </>
          ) : (
            <>
              {f.submit}
              <ArrowIcon />
            </>
          )}
        </button>

        <div className="cform__status" aria-live="polite">
          {hasErrors && <p className="cform__notice cform__notice--error">{f.fixErrors}</p>}
          {status === 'sent' && (
            <p className="cform__notice cform__notice--success" role="status">
              <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
                <path d="m3 8.5 3 3 7-7" fill="none" stroke="currentColor" strokeWidth="1.6" />
              </svg>
              {f.success}
            </p>
          )}
          {(status === 'failed' || status === 'not-configured') && (
            <p className="cform__notice cform__notice--error" role="alert">
              {status === 'failed' ? f.failed : f.notConfigured} {directLink}.
            </p>
          )}
        </div>
      </div>
    </form>
  );
}
