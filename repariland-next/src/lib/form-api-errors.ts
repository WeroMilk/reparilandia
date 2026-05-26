import { formEmailNotConfiguredMessage } from '@/lib/form-email';

export function mapFormSendError(error: unknown): { status: number; message: string } {
  if (error instanceof Error) {
    switch (error.message) {
      case 'RESEND_NOT_CONFIGURED':
      case 'SMTP_NOT_CONFIGURED':
        return { status: 503, message: formEmailNotConfiguredMessage() };
      case 'SMTP_AUTH_FAILED':
        return {
          status: 503,
          message:
            'No se pudo autenticar el correo del taller. Revisa la contraseña de aplicación de Outlook en la configuración del servidor.',
        };
      case 'SMTP_BASIC_AUTH_DISABLED':
        return {
          status: 503,
          message:
            'Microsoft desactivó el acceso SMTP con contraseña en esta cuenta. Configura Resend (RESEND_API_KEY) u OAuth de Outlook (OUTLOOK_*).',
        };
      case 'OUTLOOK_OAUTH_NOT_CONFIGURED':
      case 'OUTLOOK_OAUTH_TOKEN_FAILED':
        return {
          status: 503,
          message:
            'No se pudo renovar el acceso OAuth de Outlook. Vuelve a autorizar la cuenta con scripts/outlook-oauth-setup.cjs.',
        };
      case 'RESEND_DOMAIN_REQUIRED':
        return {
          status: 503,
          message:
            'Resend aún no puede enviar a Hotmail: verifica el dominio reparilandia.com en resend.com/domains y configura RESEND_FROM_EMAIL con @reparilandia.com.',
        };
      case 'SMTP_CONNECTION_FAILED':
        return {
          status: 503,
          message: 'No se pudo conectar al servidor de correo. Intenta más tarde o escríbenos por WhatsApp.',
        };
      default:
        if (error.message.startsWith('RESEND_API_ERROR:')) {
          return {
            status: 502,
            message: 'El servicio de correo rechazó el envío. Intenta más tarde o por WhatsApp.',
          };
        }
        if (error.message.startsWith('OUTLOOK_GRAPH_ERROR:')) {
          return {
            status: 502,
            message: 'Outlook rechazó el envío del correo. Intenta más tarde o por WhatsApp.',
          };
        }
        break;
    }
  }

  return {
    status: 500,
    message: 'No se pudo completar el envío. Intenta de nuevo en unos minutos.',
  };
}
