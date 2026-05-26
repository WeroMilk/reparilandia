/** Envío de correos vía Resend (cotización y contacto). */

export const DEFAULT_FORM_TO_EMAIL = 'reparilandia@hotmail.com';

export function getFormToEmail(): string {
  return (
    process.env.FORM_TO_EMAIL?.trim() ||
    process.env.QUOTE_TO_EMAIL?.trim() ||
    DEFAULT_FORM_TO_EMAIL
  );
}

const SAFE_RESEND_FROM = 'Reparilandia <onboarding@resend.dev>';

/** Solo usar @reparilandia.com cuando el dominio está verificado en Resend (DNS en Vercel). */
export function getResendFrom(): string {
  const domainVerified = process.env.RESEND_DOMAIN_VERIFIED === 'true';
  if (!domainVerified) {
    return SAFE_RESEND_FROM;
  }
  return (
    process.env.RESEND_FROM_EMAIL?.trim() ||
    process.env.QUOTE_FROM_EMAIL?.trim() ||
    'Reparilandia <notificaciones@reparilandia.com>'
  );
}

export function isResendConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim());
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export { isValidEmail } from '@/lib/form-validation';

export async function sendResendEmail(options: {
  subject: string;
  html: string;
  replyTo?: string;
  to?: string;
  from?: string;
  attachments?: Array<{ filename: string; content: string }>;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    throw new Error('RESEND_NOT_CONFIGURED');
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: options.from ?? getResendFrom(),
      to: [options.to ?? getFormToEmail()],
      ...(options.replyTo ? { reply_to: [options.replyTo] } : {}),
      subject: options.subject,
      html: options.html,
      attachments: options.attachments,
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    console.error('[resend]', response.status, detail);
    if (response.status === 403 && /verify a domain|testing emails to your own/i.test(detail)) {
      throw new Error('RESEND_DOMAIN_REQUIRED');
    }
    throw new Error(`RESEND_API_ERROR:${response.status}`);
  }
}
