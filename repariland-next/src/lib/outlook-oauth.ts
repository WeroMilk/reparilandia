const CONSUMER_TENANT = 'consumers';
const TOKEN_URL = `https://login.microsoftonline.com/${CONSUMER_TENANT}/oauth2/v2.0/token`;
const GRAPH_SCOPE = 'https://graph.microsoft.com/Mail.Send offline_access User.Read';

export function isOutlookOAuthConfigured(): boolean {
  return Boolean(
    process.env.OUTLOOK_CLIENT_ID?.trim() &&
      process.env.OUTLOOK_CLIENT_SECRET?.trim() &&
      process.env.OUTLOOK_REFRESH_TOKEN?.trim(),
  );
}

export function getOutlookMailbox(): string {
  return (
    process.env.OUTLOOK_MAILBOX?.trim() ||
    process.env.SMTP_USER?.trim() ||
    process.env.FORM_TO_EMAIL?.trim() ||
    ''
  );
}

type TokenResponse = {
  access_token?: string;
  refresh_token?: string;
  error?: string;
  error_description?: string;
};

export async function getOutlookAccessToken(): Promise<string> {
  const clientId = process.env.OUTLOOK_CLIENT_ID?.trim();
  const clientSecret = process.env.OUTLOOK_CLIENT_SECRET?.trim();
  const refreshToken = process.env.OUTLOOK_REFRESH_TOKEN?.trim();

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('OUTLOOK_OAUTH_NOT_CONFIGURED');
  }

  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken,
    grant_type: 'refresh_token',
    scope: GRAPH_SCOPE,
  });

  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  const data = (await response.json()) as TokenResponse;
  if (!response.ok || !data.access_token) {
    console.error('[outlook-oauth]', data.error, data.error_description);
    throw new Error('OUTLOOK_OAUTH_TOKEN_FAILED');
  }

  if (data.refresh_token?.trim()) {
    console.info('[outlook-oauth] Microsoft emitió un refresh token nuevo; actualízalo en el entorno.');
  }

  return data.access_token;
}
