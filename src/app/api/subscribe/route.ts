import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { randomBytes } from 'crypto';
import { sendEmail, getConfirmationHtml } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      email, 
      name, 
      phone, 
      businessType, 
      businessSize, 
      message, 
      wantsAdvice 
    } = body;

    // Validación básica
    if (!email || !name) {
      return NextResponse.json(
        { error: 'Email y nombre son requeridos' },
        { status: 400 }
      );
    }

    // Verificar si ya existe
    const existing = await db.subscriber.findUnique({
      where: { email }
    });

    if (existing) {
      // Si ya existe pero no está verificado, reenviar verificación
      if (!existing.isVerified) {
        const verifyToken = randomBytes(32).toString('hex');
        await db.subscriber.update({
          where: { email },
          data: {
            name,
            phone,
            businessType,
            businessSize,
            message,
            wantsAdvice: wantsAdvice || false,
            verifyToken,
            updatedAt: new Date()
          }
        });

        // Enviar email de confirmación
        await sendConfirmationEmail(email, name, verifyToken);

        return NextResponse.json({
          success: true,
          message: 'Se ha enviado un nuevo correo de confirmación',
          requiresVerification: true
        });
      }

      // Ya está verificado
      return NextResponse.json({
        success: true,
        message: 'Ya estás registrado',
        requiresVerification: false,
        alreadyVerified: true
      });
    }

    // Crear nuevo suscriptor
    const verifyToken = randomBytes(32).toString('hex');
    const subscriber = await db.subscriber.create({
      data: {
        email,
        name,
        phone: phone || null,
        businessType: businessType || null,
        businessSize: businessSize || null,
        message: message || null,
        wantsAdvice: wantsAdvice || false,
        verifyToken,
        source: 'landing-page',
        ipAddress: request.headers.get('x-forwarded-for') || 
                   request.headers.get('x-real-ip') || 
                   'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown'
      }
    });

    // Enviar email de confirmación
    await sendConfirmationEmail(email, name, verifyToken);

    return NextResponse.json({
      success: true,
      message: 'Registro exitoso. Revisa tu correo para confirmar.',
      subscriberId: subscriber.id,
      requiresVerification: true
    });

  } catch (error) {
    console.error('Error en suscripción:', error);
    return NextResponse.json(
      { error: 'Error al procesar la suscripción' },
      { status: 500 }
    );
  }
}

async function sendConfirmationEmail(email: string, name: string, token: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const verifyUrl = `${baseUrl}/verificar?token=${token}`;
  
  console.log('--- Iniciando envío de email (Directo) ---');
  console.log('Destinatario:', email);
  console.log('URL de verificación:', verifyUrl);

  const result = await sendEmail({
    to: email,
    subject: 'Confirma tu email - Sistema GFSM™',
    html: getConfirmationHtml(name, verifyUrl)
  });

  return result.success;
}
