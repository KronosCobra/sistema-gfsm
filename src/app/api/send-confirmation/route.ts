import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: NextRequest) {
  try {
    const { email, name, verifyUrl } = await request.json();

    if (!email || !name || !verifyUrl) {
      return NextResponse.json(
        { error: 'Faltan datos requeridos' },
        { status: 400 }
      );
    }

    console.log('--- Diagnóstico de Envío ---');
    console.log('Email destino:', email);
    console.log('Tiene API Key:', !!process.env.RESEND_API_KEY);
    
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Enviar email usando Resend
    const result = await resend.emails.send({
      from: 'GFSM <onboarding@resend.dev>', // Usar dominio de prueba de Resend
      to: [email],
      subject: 'Confirma tu email - Sistema GFSM™',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h1 style="color: #f59e0b;">Bienvenido a GFSM™</h1>
          <p>Hola <strong>${name}</strong>,</p>
          <p>Gracias por suscribirte al <strong>Sistema GFSM™ (Global Franchise Structure Method)</strong>. Estamos emocionados de que comiences a estructurar tu negocio con estándares internacionales.</p>
          <p>Para acceder a los 14 formatos gratuitos, por favor confirma tu email haciendo clic en el siguiente enlace:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verifyUrl}" style="background-color: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Confirmar mi Email</a>
          </div>
          <p style="color: #666; font-size: 14px;">Si no puedes hacer clic en el botón, copia y pega este enlace en tu navegador:</p>
          <p style="color: #666; font-size: 14px; word-break: break-all;">${verifyUrl}</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 12px; color: #999;">Global Franchise Structure Method™ | Eduardo Bravo</p>
        </div>
      `
    });

    if (result.error) {
      console.error('❌ Error de Resend:', result.error);
      return NextResponse.json(
        { error: 'Error de Resend', details: result.error },
        { status: 500 }
      );
    }
    
    console.log('✅ Email enviado con éxito. ID:', result.data?.id);

    return NextResponse.json({
      success: true,
      message: 'Email de confirmación enviado',
      email,
      verifyUrl
    });

  } catch (error) {
    console.error('Error enviando email de confirmación:', error);
    return NextResponse.json(
      { error: 'Error al enviar el email' },
      { status: 500 }
    );
  }
}
