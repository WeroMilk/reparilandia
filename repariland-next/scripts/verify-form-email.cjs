/**
 * Verifica configuración y conectividad de correo (contacto + cotización).
 *
 * Uso:
 *   node scripts/verify-form-email.cjs
 *   node scripts/verify-form-email.cjs --api http://localhost:3000
 *   node scripts/verify-form-email.cjs --send-test   # envía correos de prueba reales
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const PROVIDER_ORDER = ['resend', 'outlook-oauth', 'smtp'];

function loadEnvFile(name) {
  const filePath = path.join(root, name);
  if (!fs.existsSync(filePath)) return false;
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
  return true;
}

function maskEmail(email) {
  const at = email.indexOf('@');
  if (at < 2) return '***';
  return `${email.slice(0, 2)}***${email.slice(at)}`;
}

function isProviderConfigured(name) {
  switch (name) {
    case 'resend':
      return Boolean(process.env.RESEND_API_KEY?.trim());
    case 'outlook-oauth':
      return Boolean(
        process.env.OUTLOOK_CLIENT_ID?.trim() &&
          process.env.OUTLOOK_CLIENT_SECRET?.trim() &&
          process.env.OUTLOOK_REFRESH_TOKEN?.trim(),
      );
    case 'smtp':
      return Boolean(process.env.SMTP_USER?.trim() && process.env.SMTP_PASS?.trim());
    default:
      return false;
  }
}

function getConfiguredProviders() {
  return PROVIDER_ORDER.filter(isProviderConfigured);
}

async function verifySmtp() {
  const nodemailer = require('nodemailer');
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  if (!user || !pass) return { ok: false, reason: 'missing_credentials' };

  const host = process.env.SMTP_HOST?.trim() || 'smtp-mail.outlook.com';
  const port = Number(process.env.SMTP_PORT?.trim() || 587);

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    requireTLS: port === 587,
    auth: { user, pass },
    tls: { minVersion: 'TLSv1.2' },
  });

  try {
    await transporter.verify();
    return { ok: true, host, port, user: maskEmail(user) };
  } catch (err) {
    const code = err && typeof err === 'object' && 'code' in err ? String(err.code) : '';
    const response =
      err && typeof err === 'object' && 'response' in err ? String(err.response) : '';
    const basicDisabled = /basic authentication is disabled/i.test(response);
    return {
      ok: false,
      reason: basicDisabled ? 'basic_auth_disabled' : code || err?.message || 'verify_failed',
      host,
      port,
    };
  }
}

async function verifyOutlookOAuth() {
  const clientId = process.env.OUTLOOK_CLIENT_ID?.trim();
  const clientSecret = process.env.OUTLOOK_CLIENT_SECRET?.trim();
  const refreshToken = process.env.OUTLOOK_REFRESH_TOKEN?.trim();
  if (!clientId || !clientSecret || !refreshToken) {
    return { ok: false, reason: 'missing_credentials' };
  }

  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken,
    grant_type: 'refresh_token',
    scope: 'https://graph.microsoft.com/Mail.Send offline_access User.Read',
  });

  const res = await fetch('https://login.microsoftonline.com/consumers/oauth2/v2.0/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  const data = await res.json();
  if (!res.ok || !data.access_token) {
    return { ok: false, reason: data.error || 'token_failed', detail: data.error_description };
  }
  return { ok: true };
}

async function verifyResend() {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) return { ok: false, reason: 'missing_api_key' };
  const res = await fetch('https://api.resend.com/domains', {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  if (res.status === 401 || res.status === 403) {
    return { ok: false, reason: `http_${res.status}` };
  }
  return { ok: true, status: res.status };
}

async function probeApi(baseUrl, route, init) {
  const url = `${baseUrl.replace(/\/$/, '')}${route}`;
  const res = await fetch(url, init);
  const text = await res.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = { raw: text.slice(0, 200) };
  }
  return { url, status: res.status, json };
}

async function main() {
  const args = process.argv.slice(2);
  const apiBase = args.includes('--api')
    ? args[args.indexOf('--api') + 1]
    : process.env.VERIFY_API_BASE || 'http://localhost:3000';
  const sendTest = args.includes('--send-test');

  loadEnvFile('.env');
  loadEnvFile('.env.local');

  const providers = getConfiguredProviders();
  const formTo = process.env.FORM_TO_EMAIL?.trim() || 'reparilandia@hotmail.com';

  console.log('=== Reparilandia — verificación de correo ===\n');
  console.log('Archivos env:', {
    '.env': fs.existsSync(path.join(root, '.env')),
    '.env.local': fs.existsSync(path.join(root, '.env.local')),
  });
  console.log('Variables:', {
    RESEND_API_KEY: isProviderConfigured('resend') ? '(definida)' : '(vacía)',
    OUTLOOK_OAUTH: isProviderConfigured('outlook-oauth') ? '(completo)' : '(incompleto)',
    SMTP_USER: Boolean(process.env.SMTP_USER?.trim()),
    SMTP_PASS: Boolean(process.env.SMTP_PASS?.trim()) ? '(definida)' : '(vacía)',
    FORM_TO_EMAIL: maskEmail(formTo),
  });

  if (providers.length === 0) {
    console.log('\n❌ Correo NO configurado. Copia .env.example → .env.local');
    console.log('   Usa Resend, Outlook OAuth o SMTP (legacy).');
    process.exitCode = 1;
  } else {
    console.log(`\nProveedores configurados: ${providers.join(' → ')}`);
    console.log(`Proveedor activo (prioridad): ${providers[0]}`);
  }

  for (const provider of providers) {
    if (provider === 'resend') {
      console.log('\nComprobando Resend...');
      const resend = await verifyResend();
      console.log(resend.ok ? '✅ Resend OK' : '❌ Resend falló', resend);
      if (!resend.ok) process.exitCode = 1;
    }
    if (provider === 'outlook-oauth') {
      console.log('\nComprobando Outlook OAuth...');
      const outlook = await verifyOutlookOAuth();
      console.log(outlook.ok ? '✅ Outlook OAuth OK' : '❌ Outlook OAuth falló', outlook);
      if (!outlook.ok) process.exitCode = 1;
    }
    if (provider === 'smtp') {
      console.log('\nComprobando SMTP (verify)...');
      const smtp = await verifySmtp();
      if (smtp.ok) {
        console.log('✅ SMTP OK', smtp);
      } else {
        console.log('❌ SMTP falló', smtp);
        if (smtp.reason === 'basic_auth_disabled') {
          console.log(
            '   Microsoft bloqueó SMTP con contraseña. Usa Resend o Outlook OAuth (scripts/outlook-oauth-setup.cjs).',
          );
        }
        if (providers.length === 1) process.exitCode = 1;
      }
    }
  }

  console.log(`\nComprobando API (${apiBase})...`);
  try {
    const health = await probeApi(apiBase, '/api/form-email/health', { method: 'GET' });
    console.log('GET /api/form-email/health →', health.status, health.json);
  } catch (err) {
    console.log('⚠️  No se pudo contactar el servidor:', err.message);
    console.log('   Arranca con: npm run dev');
  }

  try {
    const contactEmpty = await probeApi(apiBase, '/api/contacto', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    console.log(
      'POST /api/contacto (vacío) →',
      contactEmpty.status,
      contactEmpty.json?.error || contactEmpty.json,
    );
    const expectedContact = providers.length > 0 ? 400 : 503;
    if (contactEmpty.status === expectedContact) {
      console.log('✅ Validación de contacto responde como se espera');
    }
  } catch (err) {
    console.log('⚠️  POST contacto:', err.message);
  }

  if (sendTest && providers.length > 0) {
    console.log('\nEnviando correos de prueba (reales vía API)...');
    const stamp = new Date().toISOString();
    const contact = await probeApi(apiBase, '/api/contacto', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: 'Prueba automática',
        email: 'prueba@example.com',
        motivo: `Verificación ${stamp}`,
        mensaje: 'Mensaje de prueba desde verify-form-email.cjs',
      }),
    });
    console.log('POST /api/contacto (prueba) →', contact.status, contact.json);

    const boundary = '----verify' + Date.now();
    const tinyPng = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
      'base64',
    );
    const parts = [
      `--${boundary}\r\nContent-Disposition: form-data; name="nombre"\r\n\r\nPrueba automática\r\n`,
      `--${boundary}\r\nContent-Disposition: form-data; name="email"\r\n\r\nprueba@example.com\r\n`,
      `--${boundary}\r\nContent-Disposition: form-data; name="telefono"\r\n\r\n6620000000\r\n`,
      `--${boundary}\r\nContent-Disposition: form-data; name="servicio_seleccionado"\r\n\r\nVerificación\r\n`,
      `--${boundary}\r\nContent-Disposition: form-data; name="descripcion"\r\n\r\nCotización de prueba ${stamp}\r\n`,
      `--${boundary}\r\nContent-Disposition: form-data; name="foto"; filename="prueba.png"\r\nContent-Type: image/png\r\n\r\n`,
    ];
    const body = Buffer.concat([
      Buffer.from(parts.join('')),
      tinyPng,
      Buffer.from(`\r\n--${boundary}--\r\n`),
    ]);
    const quote = await probeApi(apiBase, '/api/cotizacion', {
      method: 'POST',
      headers: { 'Content-Type': `multipart/form-data; boundary=${boundary}` },
      body,
    });
    console.log('POST /api/cotizacion (prueba) →', quote.status, quote.json);
    if (contact.status === 200 && quote.status === 200) {
      console.log('\n✅ Ambos envíos de prueba OK — revisa la bandeja de', formTo);
    } else {
      process.exitCode = 1;
    }
  } else if (sendTest) {
    console.log('\nOmitido --send-test: falta configuración de correo.');
  } else {
    console.log('\nPara enviar correos reales de prueba: node scripts/verify-form-email.cjs --send-test');
  }

  console.log('\nListo.');
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
