import { NextRequest, NextResponse } from 'next/server';
import { mapFormSendError } from '@/lib/form-api-errors';
import { formEmailNotConfiguredMessage, isFormEmailConfigured, sendFormEmail } from '@/lib/form-email';
import { isValidEmail, MAX_FORM_FIELD, trimFormField } from '@/lib/form-validation';
import { escapeHtml } from '@/lib/resend';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 15;

function requiredField(body: Record<string, unknown>, key: string): string {
  const value = body[key];
  return typeof value === 'string' ? trimFormField(value, MAX_FORM_FIELD) : '';
}

export async function POST(request: NextRequest) {
  if (!isFormEmailConfigured()) {
    return NextResponse.json({ success: false, error: formEmailNotConfiguredMessage() }, { status: 503 });
  }

  try {
    let body: Record<string, unknown>;
    try {
      body = (await request.json()) as Record<string, unknown>;
    } catch {
      return NextResponse.json({ success: false, error: 'Cuerpo de la petición no válido.' }, { status: 400 });
    }

    const nombre = requiredField(body, 'nombre');
    const email = requiredField(body, 'email');
    const motivo = requiredField(body, 'motivo');
    const mensaje = requiredField(body, 'mensaje');

    if (!nombre || !email || !motivo || !mensaje) {
      return NextResponse.json({ success: false, error: 'Faltan campos obligatorios.' }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ success: false, error: 'Correo electrónico no válido.' }, { status: 400 });
    }

    const html = `
      <h2>Nuevo mensaje de contacto</h2>
      <p><strong>Nombre:</strong> ${escapeHtml(nombre)}</p>
      <p><strong>Correo:</strong> ${escapeHtml(email)}</p>
      <p><strong>Motivo:</strong> ${escapeHtml(motivo)}</p>
      <p><strong>Mensaje:</strong></p>
      <p>${escapeHtml(mensaje).replace(/\n/g, '<br>')}</p>
    `;

    await sendFormEmail({
      replyTo: email,
      subject: `Contacto — ${motivo} — ${nombre}`,
      html,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[api/contacto]', error);
    const mapped = mapFormSendError(error);
    return NextResponse.json({ success: false, error: mapped.message }, { status: mapped.status });
  }
}
