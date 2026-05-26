import nodemailer from 'nodemailer';
import { getFormToEmail } from '@/lib/resend';

const DEFAULT_SMTP_HOST = 'smtp-mail.outlook.com';
const DEFAULT_SMTP_PORT = 587;

export function isSmtpConfigured(): boolean {
  return Boolean(process.env.SMTP_USER?.trim() && process.env.SMTP_PASS?.trim());
}

export async function sendSmtpEmail(options: {
  subject: string;
  html: string;
  replyTo?: string;
  to?: string;
  attachments?: Array<{ filename: string; content: string }>;
}): Promise<void> {
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  if (!user || !pass) {
    throw new Error('SMTP_NOT_CONFIGURED');
  }

  const host = process.env.SMTP_HOST?.trim() || DEFAULT_SMTP_HOST;
  const port = Number(process.env.SMTP_PORT?.trim() || DEFAULT_SMTP_PORT);

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    requireTLS: port === 587,
    auth: { user, pass },
    tls: { minVersion: 'TLSv1.2' },
  });

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM?.trim() || `Reparilandia Web <${user}>`,
      to: options.to ?? getFormToEmail(),
      replyTo: options.replyTo,
      subject: options.subject,
      html: options.html,
      attachments: options.attachments?.map((file) => ({
        filename: file.filename,
        content: Buffer.from(file.content, 'base64'),
      })),
    });
  } catch (err: unknown) {
    const code =
      err && typeof err === 'object' && 'code' in err ? String((err as { code: string }).code) : '';
    const response =
      err && typeof err === 'object' && 'response' in err ? String((err as { response: string }).response) : '';
    if (code === 'EAUTH') {
      if (/basic authentication is disabled/i.test(response)) {
        throw new Error('SMTP_BASIC_AUTH_DISABLED');
      }
      throw new Error('SMTP_AUTH_FAILED');
    }
    if (code === 'ESOCKET' || code === 'ECONNECTION' || code === 'ETIMEDOUT') {
      throw new Error('SMTP_CONNECTION_FAILED');
    }
    console.error('[smtp]', err);
    throw err;
  }
}
