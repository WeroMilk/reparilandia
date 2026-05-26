import { isOutlookOAuthConfigured } from '@/lib/outlook-oauth';
import { isResendConfigured, sendResendEmail } from '@/lib/resend';
import { isSmtpConfigured } from '@/lib/smtp-config';

export type FormEmailPayload = {
  subject: string;
  html: string;
  replyTo?: string;
  to?: string;
  attachments?: Array<{ filename: string; content: string }>;
};

export type FormEmailProvider = 'resend' | 'outlook-oauth' | 'smtp';

const PROVIDER_ORDER: FormEmailProvider[] = ['resend', 'outlook-oauth', 'smtp'];

function isProviderConfigured(provider: FormEmailProvider): boolean {
  switch (provider) {
    case 'resend':
      return isResendConfigured();
    case 'outlook-oauth':
      return isOutlookOAuthConfigured();
    case 'smtp':
      return isSmtpConfigured();
    default:
      return false;
  }
}

export function getConfiguredFormEmailProviders(): FormEmailProvider[] {
  return PROVIDER_ORDER.filter(isProviderConfigured);
}

/** Proveedor activo (el primero disponible según prioridad). */
export function getFormEmailProvider(): FormEmailProvider | null {
  return getConfiguredFormEmailProviders()[0] ?? null;
}

function isRecoverableProviderError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  if (error.message === 'RESEND_DOMAIN_REQUIRED') return false;
  if (error.message.startsWith('RESEND_API_ERROR:')) {
    const status = Number(error.message.split(':')[1]);
    return status >= 500 || status === 429;
  }
  return (
    error.message === 'SMTP_AUTH_FAILED' ||
    error.message === 'SMTP_BASIC_AUTH_DISABLED' ||
    error.message === 'SMTP_CONNECTION_FAILED' ||
    error.message === 'OUTLOOK_OAUTH_TOKEN_FAILED' ||
    error.message.startsWith('OUTLOOK_GRAPH_ERROR:')
  );
}

async function sendViaProvider(provider: FormEmailProvider, options: FormEmailPayload): Promise<void> {
  switch (provider) {
    case 'resend':
      await sendResendEmail(options);
      return;
    case 'outlook-oauth': {
      const { sendMicrosoftGraphEmail } = await import('@/lib/microsoft-mail');
      await sendMicrosoftGraphEmail(options);
      return;
    }
    case 'smtp': {
      const { sendSmtpEmail } = await import('@/lib/smtp');
      await sendSmtpEmail(options);
      return;
    }
    default:
      throw new Error('SMTP_NOT_CONFIGURED');
  }
}

/**
 * Envía correo de formularios con cadena de respaldo:
 * Resend → Outlook OAuth (Graph) → SMTP contraseña.
 */
export async function sendFormEmail(options: FormEmailPayload): Promise<void> {
  const providers = getConfiguredFormEmailProviders();
  if (providers.length === 0) {
    throw new Error('SMTP_NOT_CONFIGURED');
  }

  let lastError: unknown;
  for (let index = 0; index < providers.length; index += 1) {
    const provider = providers[index];
    const hasFallback = index < providers.length - 1;
    try {
      await sendViaProvider(provider, options);
      return;
    } catch (error) {
      lastError = error;
      console.error(`[form-email] ${provider} failed`, error);
      if (!hasFallback || !isRecoverableProviderError(error)) {
        throw error;
      }
    }
  }

  throw lastError instanceof Error ? lastError : new Error('SMTP_NOT_CONFIGURED');
}

export function isFormEmailConfigured(): boolean {
  return getConfiguredFormEmailProviders().length > 0;
}

export function formEmailNotConfiguredMessage(): string {
  return 'El envío por correo no está disponible en este momento. Intenta más tarde o escríbenos por WhatsApp.';
}
