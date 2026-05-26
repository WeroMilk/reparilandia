/** Solo flags de entorno (sin cargar nodemailer). */

export function isSmtpConfigured(): boolean {
  return Boolean(process.env.SMTP_USER?.trim() && process.env.SMTP_PASS?.trim());
}
