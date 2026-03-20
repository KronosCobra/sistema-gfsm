import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Token de verificación requerido' },
        { status: 400 }
      );
    }

    // Buscar suscriptor con el token
    const subscriber = await db.subscriber.findFirst({
      where: { verifyToken: token }
    });

    if (!subscriber) {
      return NextResponse.json(
        { error: 'Token inválido o expirado' },
        { status: 400 }
      );
    }

    // Si ya está verificado
    if (subscriber.isVerified) {
      return NextResponse.json({
        success: true,
        message: 'Tu email ya estaba verificado',
        alreadyVerified: true,
        subscriber: {
          id: subscriber.id,
          name: subscriber.name,
          email: subscriber.email
        }
      });
    }

    // Verificar el suscriptor
    await db.subscriber.update({
      where: { id: subscriber.id },
      data: {
        isVerified: true,
        verifiedAt: new Date(),
        verifyToken: null // Limpiar el token por seguridad
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Email verificado correctamente',
      subscriber: {
        id: subscriber.id,
        name: subscriber.name,
        email: subscriber.email
      }
    });

  } catch (error) {
    console.error('Error en verificación:', error);
    return NextResponse.json(
      { error: 'Error al verificar el email' },
      { status: 500 }
    );
  }
}
