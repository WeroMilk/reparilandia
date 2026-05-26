import { NextResponse } from 'next/server';
import {
  getConfiguredFormEmailProviders,
  getFormEmailProvider,
  isFormEmailConfigured,
} from '@/lib/form-email';
import { getFormToEmail } from '@/lib/resend';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Diagnóstico sin secretos: ¿están configurados los formularios de correo? */
export async function GET() {
  const configured = isFormEmailConfigured();
  const providers = getConfiguredFormEmailProviders();

  return NextResponse.json({
    configured,
    provider: configured ? getFormEmailProvider() : null,
    providers,
    routes: {
      contacto: '/api/contacto',
      cotizacion: '/api/cotizacion',
    },
    to: configured ? getFormToEmail() : null,
  });
}
