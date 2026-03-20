import { Resend } from 'resend';

// Solo si lo llamas desde un Action de React, descomenta la siguiente línea:
// 'use server';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  if (!process.env.RESEND_API_KEY) {
    console.error('❌ Error: RESEND_API_KEY no está configurada');
    return { success: false, error: 'API Key missing' };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'GFSM <hola@demo.seguridades.mx>', // Tu dominio verificado
      to: [to], // Resend exige un array aquí, está perfecto
      subject,
      html
    });

    if (error) {
      console.error('❌ Error de Resend:', error);
      // Retornar explícitamente el mensaje de error ayuda a debuggear en el frontend
      return { success: false, error: error.message }; 
    }

    console.log('✅ Email enviado con éxito. ID:', data?.id);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Error inesperado en sendEmail:', error);
    return { success: false, error: 'Error interno del servidor' };
  }
}

export function getConfirmationHtml(name: string, verifyUrl: string) {
  return `
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
  `;
}
