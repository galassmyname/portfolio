/**
 * Sends the contact form through Web3Forms (https://web3forms.com), which
 * forwards each submission to the inbox the access key was created for.
 * No backend is involved: the browser posts directly to the Web3Forms API.
 *
 * The access key is read from VITE_WEB3FORMS_ACCESS_KEY (see .env.example).
 * It is a public identifier, not a secret: it can only deliver messages to
 * that one inbox, which is why Web3Forms requires calls from a browser.
 */
const ENDPOINT = 'https://api.web3forms.com/submit';
const ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY?.trim() ?? '';
const TIMEOUT_MS = 15_000;

export type ContactMessage = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export type SendResult = 'sent' | 'not-configured' | 'failed';

export const isContactFormConfigured = ACCESS_KEY.length > 0;

export async function sendMessage(msg: ContactMessage): Promise<SendResult> {
  if (!isContactFormConfigured) return 'not-configured';

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: ACCESS_KEY,
        subject: `[Portfolio] ${msg.subject}`,
        from_name: `${msg.name} (portfolio)`,
        name: msg.name,
        email: msg.email,
        message: msg.message,
        botcheck: false,
      }),
      signal: controller.signal,
    });
    const data: { success?: boolean } | null = await res.json().catch(() => null);
    return res.ok && data?.success ? 'sent' : 'failed';
  } catch {
    return 'failed';
  } finally {
    clearTimeout(timer);
  }
}
