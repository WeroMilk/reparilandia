/**
 * Autoriza Outlook/Hotmail para enviar correos vía Microsoft Graph (OAuth2).
 * Microsoft desactivó SMTP con contraseña de aplicación en cuentas personales.
 *
 * Requisitos previos (una sola vez en Azure):
 * 1. https://portal.azure.com → App registrations → New registration
 * 2. Nombre: Reparilandia Web
 * 3. Supported account types: "Personal Microsoft accounts only"
 * 4. Redirect URI: Web → http://localhost (opcional para device code)
 * 5. Certificates & secrets → New client secret → copia OUTLOOK_CLIENT_SECRET
 * 6. API permissions → Microsoft Graph → Delegated → Mail.Send, User.Read, offline_access
 *
 * Uso:
 *   OUTLOOK_CLIENT_ID=... OUTLOOK_CLIENT_SECRET=... node scripts/outlook-oauth-setup.cjs
 */
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const root = path.join(__dirname, '..');
const TENANT = 'consumers';
const DEVICE_CODE_URL = `https://login.microsoftonline.com/${TENANT}/oauth2/v2.0/devicecode`;
const TOKEN_URL = `https://login.microsoftonline.com/${TENANT}/oauth2/v2.0/token`;
const SCOPES = 'https://graph.microsoft.com/Mail.Send offline_access User.Read';

function loadEnvFile(name) {
  const filePath = path.join(root, name);
  if (!fs.existsSync(filePath)) return;
  const text = fs.readFileSync(filePath, 'utf8');
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = val;
  }
}

async function requestDeviceCode(clientId) {
  const body = new URLSearchParams({ client_id: clientId, scope: SCOPES });
  const res = await fetch(DEVICE_CODE_URL, { method: 'POST', body });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error_description || data.error || 'device_code_failed');
  return data;
}

async function pollToken(clientId, deviceCode, intervalSec, expiresIn) {
  const deadline = Date.now() + expiresIn * 1000;
  const intervalMs = Math.max(5, intervalSec) * 1000;

  while (Date.now() < deadline) {
    await new Promise((r) => setTimeout(r, intervalMs));
    const body = new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
      client_id: clientId,
      device_code: deviceCode,
    });
    const res = await fetch(TOKEN_URL, { method: 'POST', body });
    const data = await res.json();
    if (res.ok && data.access_token) return data;
    if (data.error === 'authorization_pending') continue;
    if (data.error === 'slow_down') {
      await new Promise((r) => setTimeout(r, intervalMs));
      continue;
    }
    throw new Error(data.error_description || data.error || 'token_failed');
  }
  throw new Error('authorization_timeout');
}

async function main() {
  loadEnvFile('.env.local');
  loadEnvFile('.env');

  const clientId = process.env.OUTLOOK_CLIENT_ID?.trim();
  const clientSecret = process.env.OUTLOOK_CLIENT_SECRET?.trim();
  if (!clientId || !clientSecret) {
    console.error('Define OUTLOOK_CLIENT_ID y OUTLOOK_CLIENT_SECRET en .env.local');
    process.exit(1);
  }

  console.log('=== Outlook OAuth — autorización única ===\n');
  const device = await requestDeviceCode(clientId);
  console.log(device.message);
  console.log('\nCuando termines en el navegador, este script continuará solo...\n');

  const token = await pollToken(clientId, device.device_code, device.interval, device.expires_in);
  const refreshToken = token.refresh_token;
  if (!refreshToken) {
    console.error('No se recibió refresh_token. Repite el flujo.');
    process.exit(1);
  }

  console.log('✅ Autorización completada.\n');
  console.log('Añade o actualiza en .env.local y en Vercel (Production):\n');
  console.log(`OUTLOOK_CLIENT_ID=${clientId}`);
  console.log(`OUTLOOK_CLIENT_SECRET=${clientSecret}`);
  console.log(`OUTLOOK_REFRESH_TOKEN=${refreshToken}`);
  console.log(`OUTLOOK_MAILBOX=reparilandia@hotmail.com`);
  console.log('\nOpcional: puedes quitar SMTP_PASS si solo usarás OAuth o Resend.');

  const envPath = path.join(root, '.env.local');
  if (fs.existsSync(envPath)) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const answer = await new Promise((resolve) => {
      rl.question('\n¿Guardar OUTLOOK_REFRESH_TOKEN en .env.local? (s/N) ', resolve);
    });
    rl.close();
    if (/^s/i.test(String(answer).trim())) {
      let text = fs.readFileSync(envPath, 'utf8');
      const upsert = (key, value) => {
        const re = new RegExp(`^${key}=.*$`, 'm');
        const line = `${key}=${value}`;
        text = re.test(text) ? text.replace(re, line) : `${text.replace(/\s*$/, '')}\n${line}\n`;
      };
      upsert('OUTLOOK_CLIENT_ID', clientId);
      upsert('OUTLOOK_CLIENT_SECRET', clientSecret);
      upsert('OUTLOOK_REFRESH_TOKEN', refreshToken);
      upsert('OUTLOOK_MAILBOX', 'reparilandia@hotmail.com');
      fs.writeFileSync(envPath, text, 'utf8');
      console.log('Guardado en .env.local');
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
