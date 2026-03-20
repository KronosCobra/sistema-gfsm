import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

// GET - Obtener todos los leads
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const verified = searchParams.get('verified');
    const wantsAdvice = searchParams.get('wantsAdvice');

    const skip = (page - 1) * limit;

    // Construir filtros
    const where: Record<string, unknown> = {};
    if (verified === 'true') where.isVerified = true;
    if (verified === 'false') where.isVerified = false;
    if (wantsAdvice === 'true') where.wantsAdvice = true;

    // Obtener total
    const total = await db.subscriber.count({ where });

    // Obtener suscriptores
    const subscribers = await db.subscriber.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      include: {
        _count: {
          select: { downloads: true }
        }
      }
    });

    // Estadísticas
    const stats = await db.subscriber.aggregate({
      _count: {
        id: true,
        isVerified: true,
        wantsAdvice: true
      }
    });

    const verifiedCount = await db.subscriber.count({
      where: { isVerified: true }
    });

    const wantsAdviceCount = await db.subscriber.count({
      where: { wantsAdvice: true }
    });

    return NextResponse.json({
      subscribers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      stats: {
        total: stats._count.id,
        verified: verifiedCount,
        pending: stats._count.id - verifiedCount,
        wantsAdvice: wantsAdviceCount
      }
    });

  } catch (error) {
    console.error('Error obteniendo leads:', error);
    return NextResponse.json(
      { error: 'Error al obtener los datos' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar un suscriptor
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID requerido' },
        { status: 400 }
      );
    }

    await db.subscriber.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error eliminando suscriptor:', error);
    return NextResponse.json(
      { error: 'Error al eliminar' },
      { status: 500 }
    );
  }
}
