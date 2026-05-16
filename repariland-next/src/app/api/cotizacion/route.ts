import { NextRequest, NextResponse } from 'next/server';

const MAX_FILE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/heic', 'image/heif']);

function requiredField(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === 'string' ? value.trim() : '';
}

async function sendQuoteEmail(payload: {
  nombre: string;
  email: string;
  telefono: string;
  servicio: string;
  descripcion: string;
  foto: File;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.QUOTE_TO_EMAIL || 'hola@reparilandia.com';
  const from = process.env.QUOTE_FROM_EMAIL || 'Reparilandia <cotizaciones@reparilandia.com>';

  if (!apiKey) {
    console.info('[cotización]', {
      ...payload,
      foto: `${payload.foto.name} (${payload.foto.size} bytes)`,
    });
    return;
  }

  const buffer = Buffer.from(await payload.foto.arrayBuffer());
  const attachmentContent = buffer.toString('base64');

  const html = `
    <h2>Nueva solicitud de cotización</h2>
    <p><strong>Servicio:</strong> ${payload.servicio}</p>
    <p><strong>Nombre:</strong> ${payload.nombre}</p>
    <p><strong>Correo:</strong> ${payload.email}</p>
    <p><strong>Teléfono:</strong> ${payload.telefono}</p>
    <p><strong>Descripción:</strong></p>
    <p>${payload.descripcion.replace(/\n/g, '<br>')}</p>
    <p><em>La fotografía del equipo va adjunta a este correo.</em></p>
  `;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: payload.email,
      subject: `Cotización — ${payload.servicio} — ${payload.nombre}`,
      html,
      attachments: [
        {
          filename: payload.foto.name || 'equipo.jpg',
          content: attachmentContent,
        },
      ],
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Resend error ${response.status}: ${detail}`);
  }
}

export async function POST(request: NextRequest) {
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

    if (!(foto instanceof File) || foto.size === 0) {
      return NextResponse.json({ success: false, error: 'La fotografía del equipo es obligatoria.' }, { status: 400 });
    }

    if (foto.size > MAX_FILE_BYTES) {
      return NextResponse.json({ success: false, error: 'La imagen no debe superar 5 MB.' }, { status: 400 });
    }

    if (!ALLOWED_IMAGE_TYPES.has(foto.type)) {
      return NextResponse.json(
        { success: false, error: 'Formato no válido. Usa JPG, PNG o WEBP.' },
        { status: 400 },
      );
    }

    await sendQuoteEmail({ nombre, email, telefono, servicio, descripcion, foto });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[cotización]', error);
    return NextResponse.json({ success: false, error: 'No se pudo enviar la solicitud.' }, { status: 500 });
  }
}
