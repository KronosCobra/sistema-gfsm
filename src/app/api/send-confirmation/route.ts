import { NextRequest, NextResponse } from 'next/server';
import { sendEmail, getConfirmationHtml } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { email, name, verifyUrl } = await request.json();

    if (!email || !name || !verifyUrl) {
      return NextResponse.json(
        { error: 'Faltan datos requeridos' },
        { status: 400 }
      );
    }

    const result = await sendEmail({
      to: email,
      subject: 'Confirma tu email - Sistema GFSM™',
      html: getConfirmationHtml(name, verifyUrl)
    });

    if (!result.success) {
      return NextResponse.json(
        { error: 'Error de Resend', details: result.error },
        { status: 500 }
      );
    }
    
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
