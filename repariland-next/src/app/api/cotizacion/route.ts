import { NextRequest, NextResponse } from 'next/server';
import { mapFormSendError } from '@/lib/form-api-errors';
import { formEmailNotConfiguredMessage, isFormEmailConfigured, sendFormEmail } from '@/lib/form-email';
import {
  isAllowedImageFile,
  isValidEmail,
  MAX_FILE_BYTES,
  MAX_FORM_FIELD,
  trimFormField,
} from '@/lib/form-validation';
import { escapeHtml } from '@/lib/resend';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

function requiredField(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === 'string' ? trimFormField(value, MAX_FORM_FIELD) : '';
}

export async function POST(request: NextRequest) {
  if (!isFormEmailConfigured()) {
    return NextResponse.json({ success: false, error: formEmailNotConfiguredMessage() }, { status: 503 });
  }

  try {
    const formData = await request.formData();

    const nombre = requiredField(formData, 'nombre');
    const email = requiredField(formData, 'email');
    const telefono = requiredField(formData, 'telefono');
    const servicio = requiredField(formData, 'servicio_seleccionado');
    const descripcion = requiredField(formData, 'descripcion');
    const foto = formData.get('foto');

    if (!nombre || !email || !telefono || !servicio || !descripcion) {
      return NextResponse.json({ success: false, error: 'Faltan campos obligatorios.' }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ success: false, error: 'Correo electrónico no válido.' }, { status: 400 });
    }

    if (!(foto instanceof File) || foto.size === 0) {
      return NextResponse.json({ success: false, error: 'La fotografía del equipo es obligatoria.' }, { status: 400 });
    }

    if (foto.size > MAX_FILE_BYTES) {
      return NextResponse.json({ success: false, error: 'La imagen no debe superar 4 MB.' }, { status: 400 });
    }

    if (!isAllowedImageFile(foto)) {
      return NextResponse.json(
        { success: false, error: 'Formato no válido. Usa JPG, PNG, WEBP, GIF o HEIC.' },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await foto.arrayBuffer());
    const attachmentContent = buffer.toString('base64');

    const html = `
      <h2>Nueva solicitud de cotización</h2>
      <p><strong>Servicio:</strong> ${escapeHtml(servicio)}</p>
      <p><strong>Nombre:</strong> ${escapeHtml(nombre)}</p>
      <p><strong>Correo:</strong> ${escapeHtml(email)}</p>
      <p><strong>Teléfono:</strong> ${escapeHtml(telefono)}</p>
      <p><strong>Descripción:</strong></p>
      <p>${escapeHtml(descripcion).replace(/\n/g, '<br>')}</p>
      <p><em>La fotografía del equipo va adjunta a este correo.</em></p>
    `;

    await sendFormEmail({
      replyTo: email,
      subject: `Cotización — ${servicio} — ${nombre}`,
      html,
      attachments: [
        {
          filename: foto.name || 'equipo.jpg',
          content: attachmentContent,
        },
      ],
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[api/cotizacion]', error);
    const mapped = mapFormSendError(error);
    return NextResponse.json({ success: false, error: mapped.message }, { status: mapped.status });
  }
}
