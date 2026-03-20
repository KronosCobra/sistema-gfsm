import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import fs from 'fs';
import path from 'path';

// GET - Listar formatos disponibles
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const subscriberId = searchParams.get('subscriberId');
    const formatCode = searchParams.get('format');

    // Si se solicita un formato específico para descargar
    if (formatCode && subscriberId) {
      return await downloadFormat(subscriberId, formatCode);
    }

    // Si solo se listan los formatos
    const formats = await getFormatsWithStatus(subscriberId);
    return NextResponse.json({ formats });

  } catch (error) {
    console.error('Error en descargas:', error);
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
}

async function getFormatsWithStatus(subscriberId: string | null) {
  // Formatos del sistema GFSM™
  const allFormats = [
    { code: 'F-01', name: 'Control Diario de Ventas y Costos', description: 'Mide el margen bruto diario de tu negocio', category: 'financiero' },
    { code: 'F-02', name: 'Recepción de Mercancía', description: 'Control de entrada de inventarios para evitar robos y mermas', category: 'control' },
    { code: 'F-03', name: 'Porcionamiento Estándar', description: 'Hoja estándar de porciones para blindar tu margen', category: 'operativo' },
    { code: 'F-04', name: 'Matriz de Gastos Operativos', description: 'Control de gastos fijos y variables mensuales', category: 'financiero' },
    { code: 'F-05', name: 'Checklist de Apertura', description: 'Lista de apertura diaria para estandarizar el inicio', category: 'operativo' },
    { code: 'F-06', name: 'Checklist de Cierre', description: 'Protocolo de cierre diario', category: 'operativo' },
    { code: 'F-07', name: 'Arqueo de Caja', description: 'Control diario de efectivo', category: 'control' },
    { code: 'F-08', name: 'Auditoría Financiera Mensual', description: 'Evaluación de salud financiera', category: 'financiero' },
    { code: 'F-09', name: 'Auditoría Operativa', description: 'Evaluación de cumplimiento operativo', category: 'operativo' },
    { code: 'F-10', name: 'Manual de Imagen', description: 'Estándares de marca y presentación', category: 'branding' },
    { code: 'F-11', name: 'Control de Turnos', description: 'Matriz de roles y turnos del personal', category: 'personal' },
    { code: 'F-12', name: 'Plan de Marketing', description: 'Calendario comercial mensual', category: 'marketing' },
    { code: 'F-13', name: 'Matriz de Crecimiento', description: 'Evaluación para expansión del negocio', category: 'estrategia' },
    { code: 'F-14', name: 'Signos Vitales KPIs', description: 'Tablero de indicadores clave de negocio', category: 'estrategia' }
  ];

  if (!subscriberId) {
    return allFormats.map(f => ({ ...f, downloaded: false }));
  }

  // Obtener descargas del usuario
  const downloads = await db.download.findMany({
    where: { subscriberId },
    select: { formatCode: true, downloadedAt: true }
  });

  const downloadedCodes = new Set(downloads.map(d => d.formatCode));

  return allFormats.map(f => ({
    ...f,
    downloaded: downloadedCodes.has(f.code),
    downloadedAt: downloads.find(d => d.formatCode === f.code)?.downloadedAt || null
  }));
}

async function downloadFormat(subscriberId: string, formatCode: string) {
  // Verificar que el suscriptor existe y está verificado
  const subscriber = await db.subscriber.findUnique({
    where: { id: subscriberId }
  });

  if (!subscriber) {
    return NextResponse.json(
      { error: 'Suscriptor no encontrado' },
      { status: 404 }
    );
  }

  if (!subscriber.isVerified) {
    return NextResponse.json(
      { error: 'Debes verificar tu email primero' },
      { status: 403 }
    );
  }

  // Registrar la descarga
  const formatInfo = await getFormatInfo(formatCode);
  
  await db.download.create({
    data: {
      subscriberId,
      formatCode,
      formatName: formatInfo?.name || formatCode
    }
  });

  // Buscar el archivo PDF
  const filePath = path.join(process.cwd(), 'download', 'formats', `${formatCode}.pdf`);
  
  // Verificar si existe el archivo
  if (fs.existsSync(filePath)) {
    const fileBuffer = fs.readFileSync(filePath);
    
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${formatCode}-${formatInfo?.name?.replace(/\s+/g, '-')}.pdf"`,
        'Content-Length': fileBuffer.length.toString()
      }
    });
  }

  // Si no existe el archivo, generar uno en memoria
  const pdfContent = generatePdfContent(formatCode, formatInfo);
  
  return new NextResponse(pdfContent, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${formatCode}-${formatInfo?.name?.replace(/\s+/g, '-')}.pdf"`
    }
  });
}

async function getFormatInfo(code: string) {
  const formats: Record<string, { name: string; description: string }> = {
    'F-01': { name: 'Control Diario de Ventas y Costos', description: 'Mide el margen bruto diario' },
    'F-02': { name: 'Recepción de Mercancía', description: 'Control de entrada de inventarios' },
    'F-03': { name: 'Porcionamiento Estándar', description: 'Hoja estándar de porciones' },
    'F-04': { name: 'Matriz de Gastos Operativos', description: 'Control de gastos fijos y variables' },
    'F-05': { name: 'Checklist de Apertura', description: 'Lista de apertura diaria' },
    'F-06': { name: 'Checklist de Cierre', description: 'Protocolo de cierre' },
    'F-07': { name: 'Arqueo de Caja', description: 'Control diario de efectivo' },
    'F-08': { name: 'Auditoría Financiera Mensual', description: 'Evaluación de salud financiera' },
    'F-09': { name: 'Auditoría Operativa', description: 'Evaluación de cumplimiento operativo' },
    'F-10': { name: 'Manual de Imagen', description: 'Estándares de marca' },
    'F-11': { name: 'Control de Turnos', description: 'Matriz de roles y turnos' },
    'F-12': { name: 'Plan de Marketing', description: 'Calendario comercial mensual' },
    'F-13': { name: 'Matriz de Crecimiento', description: 'Evaluación para expansión' },
    'F-14': { name: 'Signos Vitales KPIs', description: 'Tablero de indicadores clave' }
  };

  return formats[code];
}

function generatePdfContent(code: string, info: { name: string; description: string } | undefined): Buffer {
  // Contenido HTML simple que se convierte a PDF
  // En producción, usarías una biblioteca como PDFKit o similar
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${code} - ${info?.name || 'Formato GFSM™'}</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 40px; }
    h1 { color: #1a1a1a; }
    .header { border-bottom: 3px solid #f59e0b; padding-bottom: 20px; margin-bottom: 30px; }
    .logo { font-size: 14px; color: #666; }
    .content { line-height: 1.6; }
  </style>
</head>
<body>
  <div class="header">
    <p class="logo">GFSM™ - Global Franchise Structure Method</p>
    <h1>${code} - ${info?.name || 'Formato'}</h1>
    <p>${info?.description || ''}</p>
  </div>
  <div class="content">
    <p>Este formato es parte del sistema GFSM™ diseñado para estructurar tu negocio con estándares de franquicia internacional.</p>
  </div>
</body>
</html>
  `;

  return Buffer.from(html, 'utf-8');
}
