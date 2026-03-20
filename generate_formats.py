#!/usr/bin/env python3
"""
Generate all 14 GFSM™ Format PDFs
Global Franchise Structure Method™
"""

from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from reportlab.lib import colors
from reportlab.lib.units import inch, cm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import registerFontFamily
import os

# Register fonts
pdfmetrics.registerFont(TTFont('Times New Roman', '/usr/share/fonts/truetype/english/Times-New-Roman.ttf'))
registerFontFamily('Times New Roman', normal='Times New Roman', bold='Times New Roman')

# Output directory
OUTPUT_DIR = '/home/z/my-project/download/formats'

# Standard colors
HEADER_COLOR = colors.HexColor('#1F4E79')
ACCENT_COLOR = colors.HexColor('#F59E0B')
LIGHT_GRAY = colors.HexColor('#F5F5F5')

def create_styles():
    """Create document styles"""
    styles = getSampleStyleSheet()
    
    # Title style
    styles.add(ParagraphStyle(
        name='FormatTitle',
        fontName='Times New Roman',
        fontSize=24,
        textColor=HEADER_COLOR,
        alignment=TA_CENTER,
        spaceAfter=12
    ))
    
    # Subtitle
    styles.add(ParagraphStyle(
        name='FormatSubtitle',
        fontName='Times New Roman',
        fontSize=14,
        textColor=colors.gray,
        alignment=TA_CENTER,
        spaceAfter=24
    ))
    
    # Section header
    styles.add(ParagraphStyle(
        name='SectionHeader',
        fontName='Times New Roman',
        fontSize=14,
        textColor=HEADER_COLOR,
        spaceBefore=18,
        spaceAfter=12
    ))
    
    # Body text
    styles.add(ParagraphStyle(
        name='FormatBody',
        fontName='Times New Roman',
        fontSize=11,
        textColor=colors.black,
        alignment=TA_LEFT,
        spaceAfter=8,
        leading=16
    ))
    
    # Table header
    styles.add(ParagraphStyle(
        name='TableHeader',
        fontName='Times New Roman',
        fontSize=10,
        textColor=colors.white,
        alignment=TA_CENTER
    ))
    
    # Table cell
    styles.add(ParagraphStyle(
        name='TableCell',
        fontName='Times New Roman',
        fontSize=10,
        textColor=colors.black,
        alignment=TA_CENTER
    ))
    
    # Table cell left
    styles.add(ParagraphStyle(
        name='TableCellLeft',
        fontName='Times New Roman',
        fontSize=10,
        textColor=colors.black,
        alignment=TA_LEFT
    ))
    
    return styles

def create_header(styles, code, title, description):
    """Create document header"""
    elements = []
    
    # GFSM branding
    elements.append(Paragraph(
        '<b>GFSM™ - Global Franchise Structure Method</b>',
        styles['FormatSubtitle']
    ))
    
    elements.append(Spacer(1, 12))
    
    # Format code and title
    elements.append(Paragraph(
        f'<b>{code} - {title}</b>',
        styles['FormatTitle']
    ))
    
    elements.append(Paragraph(description, styles['FormatSubtitle']))
    elements.append(Spacer(1, 24))
    
    return elements

def create_table_style():
    """Create standard table style"""
    return TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), HEADER_COLOR),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, -1), 'Times New Roman'),
        ('FONTSIZE', (0, 0), (-1, 0), 10),
        ('FONTSIZE', (0, 1), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 10),
        ('TOPPADDING', (0, 0), (-1, 0), 10),
        ('BOTTOMPADDING', (0, 1), (-1, -1), 8),
        ('TOPPADDING', (0, 1), (-1, -1), 8),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.gray),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, LIGHT_GRAY]),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ])

def generate_f01():
    """F-01: Control Diario de Ventas y Costos"""
    doc = SimpleDocTemplate(
        os.path.join(OUTPUT_DIR, 'F-01.pdf'),
        pagesize=letter,
        title='F-01 - Control Diario de Ventas y Costos',
        author='Z.ai',
        creator='Z.ai',
        subject='Formato de control diario de ventas y costos GFSM'
    )
    
    styles = create_styles()
    elements = create_header(
        styles, 
        'F-01',
        'Control Diario de Ventas y Costos',
        'Mide el margen bruto diario de tu negocio'
    )
    
    elements.append(Paragraph('<b>Objetivo:</b> Medir el margen bruto diario y detectar fugas de dinero.', styles['FormatBody']))
    elements.append(Spacer(1, 12))
    
    # Table header
    header = ['Campo', 'Descripción', 'Ejemplo']
    
    # Table data
    data = [header]
    fields = [
        ['Fecha', 'Día de operación', '15/03/2024'],
        ['Ventas Totales', 'Suma de todas las ventas del día', '$25,000'],
        ['Ventas Alimentos', 'Ventas de alimentos únicamente', '$18,000'],
        ['Ventas Bebidas', 'Ventas de bebidas únicamente', '$5,000'],
        ['Ventas Postres', 'Ventas de postres únicamente', '$2,000'],
        ['Costo Materia Prima', 'Costo de insumos utilizados', '$8,500'],
        ['% Costo Alimentos', 'Ideal: 28-35%', '32%'],
        ['% Costo Bebidas', 'Ideal: 18-25%', '22%'],
        ['Margen Bruto', 'Ventas - Costo de ventas', '$16,500'],
        ['Observaciones', 'Notas importantes del día', ''],
    ]
    
    for row in fields:
        data.append([
            Paragraph(row[0], styles['TableCellLeft']),
            Paragraph(row[1], styles['TableCellLeft']),
            Paragraph(row[2], styles['TableCell'])
        ])
    
    table = Table(data, colWidths=[2*inch, 3*inch, 1.5*inch])
    table.setStyle(create_table_style())
    elements.append(table)
    
    elements.append(Spacer(1, 18))
    elements.append(Paragraph('<b>Indicador Clave:</b> Si el costo sube 3 puntos porcentuales en 30 días → Alerta operativa inmediata.', styles['FormatBody']))
    
    doc.build(elements)
    print('✓ F-01 generated')

def generate_f02():
    """F-02: Recepción de Mercancía"""
    doc = SimpleDocTemplate(
        os.path.join(OUTPUT_DIR, 'F-02.pdf'),
        pagesize=letter,
        title='F-02 - Recepción de Mercancía',
        author='Z.ai',
        creator='Z.ai',
        subject='Control de entrada de inventarios GFSM'
    )
    
    styles = create_styles()
    elements = create_header(
        styles, 
        'F-02',
        'Recepción de Mercancía',
        'Control de entrada de inventarios para evitar robos y mermas'
    )
    
    elements.append(Paragraph('<b>Objetivo:</b> Evitar robo, mermas y sobreprecios en la recepción de mercancía.', styles['FormatBody']))
    elements.append(Spacer(1, 12))
    
    header = ['Campo', 'Descripción', 'Responsable']
    data = [header]
    fields = [
        ['Fecha', 'Día de recepción', 'Almacenista'],
        ['Proveedor', 'Nombre del proveedor', 'Almacenista'],
        ['Orden de Compra #', 'Número de orden generada', 'Compras'],
        ['Producto', 'Descripción del producto', 'Almacenista'],
        ['Cantidad Solicitada', 'Cantidad en la orden', 'Compras'],
        ['Cantidad Recibida', 'Cantidad real entregada', 'Almacenista'],
        ['Precio Pactado', 'Precio acordado', 'Compras'],
        ['Precio Facturado', 'Precio en factura', 'Almacenista'],
        ['Diferencia', 'Variación entre pedido y recibido', 'Supervisor'],
        ['Firma Validación', 'Firma de aceptación', 'Gerente'],
    ]
    
    for row in fields:
        data.append([
            Paragraph(row[0], styles['TableCellLeft']),
            Paragraph(row[1], styles['TableCellLeft']),
            Paragraph(row[2], styles['TableCell'])
        ])
    
    table = Table(data, colWidths=[2*inch, 3*inch, 1.5*inch])
    table.setStyle(create_table_style())
    elements.append(table)
    
    elements.append(Spacer(1, 18))
    elements.append(Paragraph('<b>Regla GFSM™:</b> Nada entra a almacén sin orden de compra previa.', styles['FormatBody']))
    
    doc.build(elements)
    print('✓ F-02 generated')

def generate_f03():
    """F-03: Porcionamiento Estándar"""
    doc = SimpleDocTemplate(
        os.path.join(OUTPUT_DIR, 'F-03.pdf'),
        pagesize=letter,
        title='F-03 - Porcionamiento Estándar',
        author='Z.ai',
        creator='Z.ai',
        subject='Hoja estándar de porciones GFSM'
    )
    
    styles = create_styles()
    elements = create_header(
        styles, 
        'F-03',
        'Porcionamiento Estándar',
        'Hoja estándar de porciones para blindar tu margen'
    )
    
    elements.append(Paragraph('<b>Objetivo:</b> Estandarizar porciones para proteger el margen de ganancia.', styles['FormatBody']))
    elements.append(Spacer(1, 12))
    
    header = ['Ingrediente', 'Gramaje', 'Costo Unit.', 'Costo Total']
    data = [header]
    fields = [
        ['Carne (res)', '150g', '$0.50/100g', '$0.75'],
        ['Tortilla', '2 piezas', '$0.15 c/u', '$0.30'],
        ['Cebolla', '20g', '$0.20/100g', '$0.04'],
        ['Cilantro', '10g', '$0.30/100g', '$0.03'],
        ['Salsa', '30ml', '$0.10/30ml', '$0.10'],
        ['Limón', '1 pieza', '$0.05 c/u', '$0.05'],
        ['', '', 'COSTO TOTAL:', '$1.27'],
    ]
    
    for row in fields:
        data.append([
            Paragraph(row[0], styles['TableCellLeft']),
            Paragraph(row[1], styles['TableCell']),
            Paragraph(row[2], styles['TableCell']),
            Paragraph(row[3], styles['TableCell'])
        ])
    
    table = Table(data, colWidths=[2*inch, 1.5*inch, 1.5*inch, 1.5*inch])
    table.setStyle(create_table_style())
    elements.append(table)
    
    elements.append(Spacer(1, 18))
    elements.append(Paragraph('<b>Precio de Venta Sugerido:</b> $45.00 | <b>Margen Esperado:</b> 72%', styles['FormatBody']))
    elements.append(Paragraph('<b>Incluye:</b> Foto del emplatado estándar | Tiempo máximo de preparación', styles['FormatBody']))
    
    doc.build(elements)
    print('✓ F-03 generated')

def generate_f04():
    """F-04: Matriz de Gastos Operativos"""
    doc = SimpleDocTemplate(
        os.path.join(OUTPUT_DIR, 'F-04.pdf'),
        pagesize=letter,
        title='F-04 - Matriz de Gastos Operativos',
        author='Z.ai',
        creator='Z.ai',
        subject='Control de gastos fijos y variables GFSM'
    )
    
    styles = create_styles()
    elements = create_header(
        styles, 
        'F-04',
        'Matriz de Gastos Operativos',
        'Control de gastos fijos y variables mensuales'
    )
    
    elements.append(Paragraph('<b>Objetivo:</b> Controlar los gastos fijos y variables para mantener la rentabilidad.', styles['FormatBody']))
    elements.append(Spacer(1, 12))
    
    header = ['Gasto', 'Tipo', 'Monto Mensual', '% sobre Ventas']
    data = [header]
    fields = [
        ['Renta', 'Fijo', '$15,000', '15%'],
        ['Nómina', 'Fijo', '$25,000', '25%'],
        ['Luz', 'Variable', '$3,500', '3.5%'],
        ['Agua', 'Variable', '$800', '0.8%'],
        ['Gas', 'Variable', '$2,000', '2%'],
        ['Marketing', 'Variable', '$5,000', '5%'],
        ['Mantenimiento', 'Variable', '$1,500', '1.5%'],
        ['Imprevistos', 'Variable', '$2,000', '2%'],
        ['TOTAL MENSUAL', '', '$54,800', '54.8%'],
    ]
    
    for row in fields:
        data.append([
            Paragraph(row[0], styles['TableCellLeft']),
            Paragraph(row[1], styles['TableCell']),
            Paragraph(row[2], styles['TableCell']),
            Paragraph(row[3], styles['TableCell'])
        ])
    
    table = Table(data, colWidths=[2*inch, 1.2*inch, 1.5*inch, 1.5*inch])
    table.setStyle(create_table_style())
    elements.append(table)
    
    elements.append(Spacer(1, 18))
    elements.append(Paragraph('<b>Alerta Automática:</b> Si gastos fijos superan 55% de ventas → Riesgo estructural.', styles['FormatBody']))
    
    doc.build(elements)
    print('✓ F-04 generated')

def generate_f05():
    """F-05: Checklist de Apertura"""
    doc = SimpleDocTemplate(
        os.path.join(OUTPUT_DIR, 'F-05.pdf'),
        pagesize=letter,
        title='F-05 - Checklist de Apertura',
        author='Z.ai',
        creator='Z.ai',
        subject='Lista de apertura diaria GFSM'
    )
    
    styles = create_styles()
    elements = create_header(
        styles, 
        'F-05',
        'Checklist de Apertura',
        'Lista de apertura diaria para estandarizar el inicio'
    )
    
    elements.append(Paragraph('<b>Objetivo:</b> Estandarizar el proceso de apertura para evitar olvidos y errores.', styles['FormatBody']))
    elements.append(Spacer(1, 12))
    
    header = ['#', 'Actividad', 'Hora', 'Responsable', 'OK']
    data = [header]
    fields = [
        ['1', 'Limpieza general del local', '7:00 AM', 'Personal', '□'],
        ['2', 'Inventario de caja inicial', '7:15 AM', 'Cajero', '□'],
        ['3', 'Verificar temperaturas refrigeración', '7:20 AM', 'Cocina', '□'],
        ['4', 'Uniformes completos y limpios', '7:25 AM', 'Todos', '□'],
        ['5', 'Música ambiental activada', '7:30 AM', 'Encargado', '□'],
        ['6', 'Pantallas / menús funcionando', '7:35 AM', 'Encargado', '□'],
        ['7', 'Punto de venta activo', '7:40 AM', 'Cajero', '□'],
        ['8', 'Productos clave en stock', '7:45 AM', 'Almacenista', '□'],
        ['9', 'Revisión de reservaciones', '7:50 AM', 'Host', '□'],
        ['10', 'Briefing con equipo', '7:55 AM', 'Gerente', '□'],
    ]
    
    for row in fields:
        data.append([
            Paragraph(row[0], styles['TableCell']),
            Paragraph(row[1], styles['TableCellLeft']),
            Paragraph(row[2], styles['TableCell']),
            Paragraph(row[3], styles['TableCell']),
            Paragraph(row[4], styles['TableCell'])
        ])
    
    table = Table(data, colWidths=[0.4*inch, 2.5*inch, 1*inch, 1.2*inch, 0.5*inch])
    table.setStyle(create_table_style())
    elements.append(table)
    
    elements.append(Spacer(1, 18))
    elements.append(Paragraph('<b>Firma Responsable:</b> __________________ | <b>Fecha:</b> ________________', styles['FormatBody']))
    
    doc.build(elements)
    print('✓ F-05 generated')

def generate_f06():
    """F-06: Checklist de Cierre"""
    doc = SimpleDocTemplate(
        os.path.join(OUTPUT_DIR, 'F-06.pdf'),
        pagesize=letter,
        title='F-06 - Checklist de Cierre',
        author='Z.ai',
        creator='Z.ai',
        subject='Protocolo de cierre diario GFSM'
    )
    
    styles = create_styles()
    elements = create_header(
        styles, 
        'F-06',
        'Checklist de Cierre',
        'Protocolo de cierre diario'
    )
    
    elements.append(Paragraph('<b>Objetivo:</b> Estandarizar el proceso de cierre para asegurar el control.', styles['FormatBody']))
    elements.append(Spacer(1, 12))
    
    header = ['#', 'Actividad', 'Hora', 'Responsable', 'OK']
    data = [header]
    fields = [
        ['1', 'Corte de caja terminal', '10:00 PM', 'Cajero', '□'],
        ['2', 'Conteo físico vs sistema', '10:15 PM', 'Gerente', '□'],
        ['3', 'Limpieza profunda cocina', '10:00 PM', 'Cocina', '□'],
        ['4', 'Limpieza área de comensales', '10:15 PM', 'Personal', '□'],
        ['5', 'Inventario rápido críticos', '10:30 PM', 'Almacenista', '□'],
        ['6', 'Cierre de llaves de gas', '10:45 PM', 'Encargado', '□'],
        ['7', 'Cierre cajas registradoras', '10:50 PM', 'Cajero', '□'],
        ['8', 'Respaldo ventas del día', '10:55 PM', 'Gerente', '□'],
        ['9', 'Revisión cámaras seguridad', '11:00 PM', 'Gerente', '□'],
        ['10', 'Cierre general y alarma', '11:05 PM', 'Gerente', '□'],
    ]
    
    for row in fields:
        data.append([
            Paragraph(row[0], styles['TableCell']),
            Paragraph(row[1], styles['TableCellLeft']),
            Paragraph(row[2], styles['TableCell']),
            Paragraph(row[3], styles['TableCell']),
            Paragraph(row[4], styles['TableCell'])
        ])
    
    table = Table(data, colWidths=[0.4*inch, 2.5*inch, 1*inch, 1.2*inch, 0.5*inch])
    table.setStyle(create_table_style())
    elements.append(table)
    
    elements.append(Spacer(1, 18))
    elements.append(Paragraph('<b>Firma Responsable:</b> __________________ | <b>Fecha:</b> ________________', styles['FormatBody']))
    
    doc.build(elements)
    print('✓ F-06 generated')

def generate_f07():
    """F-07: Arqueo de Caja"""
    doc = SimpleDocTemplate(
        os.path.join(OUTPUT_DIR, 'F-07.pdf'),
        pagesize=letter,
        title='F-07 - Arqueo de Caja',
        author='Z.ai',
        creator='Z.ai',
        subject='Control diario de efectivo GFSM'
    )
    
    styles = create_styles()
    elements = create_header(
        styles, 
        'F-07',
        'Arqueo de Caja',
        'Control diario de efectivo'
    )
    
    elements.append(Paragraph('<b>Objetivo:</b> Controlar el efectivo y detectar diferencias inmediatamente.', styles['FormatBody']))
    elements.append(Spacer(1, 12))
    
    header = ['Concepto', 'Efectivo', 'Tarjeta', 'Total']
    data = [header]
    fields = [
        ['Fondo Inicial', '$2,000', '-', '$2,000'],
        ['Ventas del Día', '$18,500', '$6,500', '$25,000'],
        ['Gastos Pagados en Caja', '-$500', '-', '-$500'],
        ['TOTAL ESPERADO', '$20,000', '$6,500', '$26,500'],
        ['TOTAL CONTADO', '$19,950', '-', '$19,950'],
        ['DIFERENCIA', '-$50', '-', '-$50'],
    ]
    
    for row in fields:
        data.append([
            Paragraph(row[0], styles['TableCellLeft']),
            Paragraph(row[1], styles['TableCell']),
            Paragraph(row[2], styles['TableCell']),
            Paragraph(row[3], styles['TableCell'])
        ])
    
    table = Table(data, colWidths=[2.2*inch, 1.3*inch, 1.3*inch, 1.3*inch])
    table.setStyle(create_table_style())
    elements.append(table)
    
    elements.append(Spacer(1, 18))
    elements.append(Paragraph('<b>Política:</b> Diferencias mayores al 1% requieren reporte inmediato al gerente.', styles['FormatBody']))
    elements.append(Paragraph('<b>Firma Gerente:</b> __________________ | <b>Fecha:</b> ________________', styles['FormatBody']))
    
    doc.build(elements)
    print('✓ F-07 generated')

def generate_f08():
    """F-08: Auditoría Financiera Mensual"""
    doc = SimpleDocTemplate(
        os.path.join(OUTPUT_DIR, 'F-08.pdf'),
        pagesize=letter,
        title='F-08 - Auditoría Financiera Mensual',
        author='Z.ai',
        creator='Z.ai',
        subject='Evaluación de salud financiera GFSM'
    )
    
    styles = create_styles()
    elements = create_header(
        styles, 
        'F-08',
        'Auditoría Financiera Mensual',
        'Evaluación de salud financiera'
    )
    
    elements.append(Paragraph('<b>Objetivo:</b> Evaluar la salud financiera mensual del negocio.', styles['FormatBody']))
    elements.append(Spacer(1, 12))
    
    header = ['Indicador', 'Valor', 'Meta', 'Estado']
    data = [header]
    fields = [
        ['Margen Bruto', '65%', '60-70%', '🟢 Saludable'],
        ['Punto de Equilibrio', '$65,000', '-', '🟢 Saludable'],
        ['EBITDA Operativo', '$35,000', '$30,000', '🟢 Saludable'],
        ['Rotación Inventario', '4.2 veces', '4 veces', '🟢 Saludable'],
        ['% Costo Laboral', '28%', '25-30%', '🟢 Saludable'],
        ['Flujo de Efectivo', '+$8,000', 'Positivo', '🟢 Saludable'],
        ['Endeudamiento', '15%', '<25%', '🟢 Saludable'],
    ]
    
    for row in fields:
        data.append([
            Paragraph(row[0], styles['TableCellLeft']),
            Paragraph(row[1], styles['TableCell']),
            Paragraph(row[2], styles['TableCell']),
            Paragraph(row[3], styles['TableCell'])
        ])
    
    table = Table(data, colWidths=[2*inch, 1.3*inch, 1.3*inch, 1.5*inch])
    table.setStyle(create_table_style())
    elements.append(table)
    
    elements.append(Spacer(1, 18))
    elements.append(Paragraph('<b>Semáforo:</b> 🟢 Saludable | 🟡 Riesgo controlable | 🔴 Intervención urgente', styles['FormatBody']))
    
    doc.build(elements)
    print('✓ F-08 generated')

def generate_f09():
    """F-09: Auditoría Operativa"""
    doc = SimpleDocTemplate(
        os.path.join(OUTPUT_DIR, 'F-09.pdf'),
        pagesize=letter,
        title='F-09 - Auditoría Operativa',
        author='Z.ai',
        creator='Z.ai',
        subject='Evaluación de cumplimiento operativo GFSM'
    )
    
    styles = create_styles()
    elements = create_header(
        styles, 
        'F-09',
        'Auditoría Operativa',
        'Evaluación de cumplimiento operativo'
    )
    
    elements.append(Paragraph('<b>Objetivo:</b> Evaluar el cumplimiento de estándares operativos.', styles['FormatBody']))
    elements.append(Spacer(1, 12))
    
    header = ['Área', 'Calificación (1-5)', 'Observaciones']
    data = [header]
    fields = [
        ['Imagen del local', '4', 'Excelente presentación'],
        ['Uniforme del personal', '5', 'Todo en orden'],
        ['Tiempo promedio de servicio', '4', '12 minutos promedio'],
        ['Calidad del producto', '5', 'Sin quejas'],
        ['Experiencia del cliente', '4', 'Comentarios positivos'],
        ['Limpieza visible', '5', 'Muy limpio'],
        ['Protocolos de atención', '4', 'Cumplimiento del 90%'],
    ]
    
    for row in fields:
        data.append([
            Paragraph(row[0], styles['TableCellLeft']),
            Paragraph(row[1], styles['TableCell']),
            Paragraph(row[2], styles['TableCellLeft'])
        ])
    
    table = Table(data, colWidths=[2*inch, 1.3*inch, 3*inch])
    table.setStyle(create_table_style())
    elements.append(table)
    
    elements.append(Spacer(1, 18))
    elements.append(Paragraph('<b>Resultado Final:</b> 31/35 = 88.6% cumplimiento franquicia estándar', styles['FormatBody']))
    
    doc.build(elements)
    print('✓ F-09 generated')

def generate_f10():
    """F-10: Manual de Imagen"""
    doc = SimpleDocTemplate(
        os.path.join(OUTPUT_DIR, 'F-10.pdf'),
        pagesize=letter,
        title='F-10 - Manual de Imagen',
        author='Z.ai',
        creator='Z.ai',
        subject='Estándares de marca y presentación GFSM'
    )
    
    styles = create_styles()
    elements = create_header(
        styles, 
        'F-10',
        'Manual de Imagen',
        'Estándares de marca y presentación'
    )
    
    elements.append(Paragraph('<b>Objetivo:</b> Mantener consistencia en la imagen de marca.', styles['FormatBody']))
    elements.append(Spacer(1, 12))
    
    header = ['Elemento', 'Especificación', 'Responsable']
    data = [header]
    fields = [
        ['Colores Oficiales', 'Primario: #F59E0B | Secundario: #1F4E79', 'Marketing'],
        ['Uso de Logotipo', 'Fondo blanco o negro, nunca coloreado', 'Todos'],
        ['Uniformes', 'Camisa blanca, mandil negro con logo', 'Personal'],
        ['Presentación Personal', 'Baño diario, uñas limpias, sin joyas excesivas', 'Personal'],
        ['Iluminación', 'Luz cálida 3000K, 500 lux mínimo', 'Mantenimiento'],
        ['Música Ambiente', 'Volumen 60%, playlist corporativa', 'Encargado'],
        ['Aroma Corporativo', 'Esencia cítrica sutil', 'Limpieza'],
        ['Protocolo de Saludo', '"¡Bienvenido a [Nombre]!"', 'Todos'],
    ]
    
    for row in fields:
        data.append([
            Paragraph(row[0], styles['TableCellLeft']),
            Paragraph(row[1], styles['TableCellLeft']),
            Paragraph(row[2], styles['TableCell'])
        ])
    
    table = Table(data, colWidths=[1.8*inch, 3*inch, 1.2*inch])
    table.setStyle(create_table_style())
    elements.append(table)
    
    doc.build(elements)
    print('✓ F-10 generated')

def generate_f11():
    """F-11: Control de Turnos"""
    doc = SimpleDocTemplate(
        os.path.join(OUTPUT_DIR, 'F-11.pdf'),
        pagesize=letter,
        title='F-11 - Control de Turnos',
        author='Z.ai',
        creator='Z.ai',
        subject='Matriz de roles y turnos GFSM'
    )
    
    styles = create_styles()
    elements = create_header(
        styles, 
        'F-11',
        'Control de Turnos',
        'Matriz de roles y turnos del personal'
    )
    
    elements.append(Paragraph('<b>Objetivo:</b> Optimizar la asignación de turnos y medir productividad.', styles['FormatBody']))
    elements.append(Spacer(1, 12))
    
    header = ['Colaborador', 'Horario', 'Función', 'Ventas', 'Productividad']
    data = [header]
    fields = [
        ['María García', '7:00 - 15:00', 'Cajera', '$8,500', '85%'],
        ['Juan Pérez', '7:00 - 15:00', 'Cocina', '-', '90%'],
        ['Ana López', '15:00 - 23:00', 'Mesera', '$12,000', '92%'],
        ['Carlos Ruiz', '15:00 - 23:00', 'Cocina', '-', '88%'],
        ['Laura Sánchez', '7:00 - 23:00', 'Gerente', '$25,000', '95%'],
    ]
    
    for row in fields:
        data.append([
            Paragraph(row[0], styles['TableCellLeft']),
            Paragraph(row[1], styles['TableCell']),
            Paragraph(row[2], styles['TableCell']),
            Paragraph(row[3], styles['TableCell']),
            Paragraph(row[4], styles['TableCell'])
        ])
    
    table = Table(data, colWidths=[1.5*inch, 1.2*inch, 1*inch, 1*inch, 1.2*inch])
    table.setStyle(create_table_style())
    elements.append(table)
    
    elements.append(Spacer(1, 18))
    elements.append(Paragraph('<b>Incidencias:</b> Registrar cualquier ausencia, retardo o novedad del turno.', styles['FormatBody']))
    
    doc.build(elements)
    print('✓ F-11 generated')

def generate_f12():
    """F-12: Plan de Marketing"""
    doc = SimpleDocTemplate(
        os.path.join(OUTPUT_DIR, 'F-12.pdf'),
        pagesize=letter,
        title='F-12 - Plan de Marketing',
        author='Z.ai',
        creator='Z.ai',
        subject='Calendario comercial mensual GFSM'
    )
    
    styles = create_styles()
    elements = create_header(
        styles, 
        'F-12',
        'Plan de Marketing',
        'Calendario comercial mensual'
    )
    
    elements.append(Paragraph('<b>Objetivo:</b> Planificar y medir el impacto de las acciones de marketing.', styles['FormatBody']))
    elements.append(Spacer(1, 12))
    
    header = ['Campaña', 'Objetivo', 'Presupuesto', 'KPI', 'Resultado']
    data = [header]
    fields = [
        ['Promo 2x1 Martes', 'Incrementar ventas martes', '$1,000', '+30% ventas', '+35%'],
        ['Instagram Ads', 'Nuevos clientes', '$3,000', '50 leads', '62 leads'],
        ['Email Marketing', 'Fidelización', '$500', '20% apertura', '25%'],
        ['Google My Business', 'Visibilidad local', '$0', '50 reseñas', '45 reseñas'],
        ['Influencer Local', 'Alcance', '$2,000', '10K alcance', '15K alcance'],
    ]
    
    for row in fields:
        data.append([
            Paragraph(row[0], styles['TableCellLeft']),
            Paragraph(row[1], styles['TableCellLeft']),
            Paragraph(row[2], styles['TableCell']),
            Paragraph(row[3], styles['TableCell']),
            Paragraph(row[4], styles['TableCell'])
        ])
    
    table = Table(data, colWidths=[1.5*inch, 1.5*inch, 1*inch, 1.2*inch, 1*inch])
    table.setStyle(create_table_style())
    elements.append(table)
    
    elements.append(Spacer(1, 18))
    elements.append(Paragraph('<b>Responsable:</b> __________________ | <b>Mes:</b> ________________', styles['FormatBody']))
    
    doc.build(elements)
    print('✓ F-12 generated')

def generate_f13():
    """F-13: Matriz de Crecimiento"""
    doc = SimpleDocTemplate(
        os.path.join(OUTPUT_DIR, 'F-13.pdf'),
        pagesize=letter,
        title='F-13 - Matriz de Crecimiento',
        author='Z.ai',
        creator='Z.ai',
        subject='Evaluación para expansión del negocio GFSM'
    )
    
    styles = create_styles()
    elements = create_header(
        styles, 
        'F-13',
        'Matriz de Crecimiento',
        'Evaluación para expansión del negocio'
    )
    
    elements.append(Paragraph('<b>Objetivo:</b> Evaluar si el negocio está listo para expandirse.', styles['FormatBody']))
    elements.append(Spacer(1, 12))
    
    header = ['Indicador', 'Valor Actual', 'Requisito', '¿Cumple?']
    data = [header]
    fields = [
        ['Ventas promedio 6 meses', '$100,000', '>$80,000', '✓ Sí'],
        ['Margen neto estable', '12%', '>10%', '✓ Sí'],
        ['Procesos documentados', '85%', '>80%', '✓ Sí'],
        ['Equipo capacitado', '2 líderes', 'Mín. 2', '✓ Sí'],
        ['Capital de resperva', '$50,000', '>$40,000', '✓ Sí'],
        ['Capacidad instalada', '75%', '>70%', '✓ Sí'],
        ['Ticket promedio', '$150', 'Creciente', '✓ Sí'],
        ['Rotación de personal', '10%', '<20%', '✓ Sí'],
    ]
    
    for row in fields:
        data.append([
            Paragraph(row[0], styles['TableCellLeft']),
            Paragraph(row[1], styles['TableCell']),
            Paragraph(row[2], styles['TableCell']),
            Paragraph(row[3], styles['TableCell'])
        ])
    
    table = Table(data, colWidths=[2*inch, 1.3*inch, 1.3*inch, 1*inch])
    table.setStyle(create_table_style())
    elements.append(table)
    
    elements.append(Spacer(1, 18))
    elements.append(Paragraph('<b>Evaluación:</b> 8/8 requisitos cumplidos = LISTO PARA SEGUNDA SUCURSAL', styles['FormatBody']))
    
    doc.build(elements)
    print('✓ F-13 generated')

def generate_f14():
    """F-14: Signos Vitales KPIs"""
    doc = SimpleDocTemplate(
        os.path.join(OUTPUT_DIR, 'F-14.pdf'),
        pagesize=letter,
        title='F-14 - Signos Vitales KPIs',
        author='Z.ai',
        creator='Z.ai',
        subject='Tablero de indicadores clave GFSM'
    )
    
    styles = create_styles()
    elements = create_header(
        styles, 
        'F-14',
        'Signos Vitales KPIs',
        'Tablero de indicadores clave de negocio'
    )
    
    elements.append(Paragraph('<b>Objetivo:</b> Monitorear los indicadores críticos del negocio como si fueran signos vitales.', styles['FormatBody']))
    elements.append(Spacer(1, 12))
    
    # RENTABILIDAD
    elements.append(Paragraph('<b>I. SIGNOS VITALES DE RENTABILIDAD</b>', styles['SectionHeader']))
    
    header = ['KPI', 'Fórmula', 'Meta', 'Actual', 'Estado']
    data = [header]
    fields = [
        ['Margen Bruto', '(Ventas - Costo) / Ventas', '60-70%', '65%', '🟢'],
        ['Margen Neto', 'Utilidad / Ventas', '10-20%', '12%', '🟢'],
        ['Punto de Equilibrio', 'Gastos Fijos / Margen', 'Referencia', '$65,000', '🟢'],
        ['EBITDA', 'Ganancia antes de impuestos', '15-25%', '18%', '🟢'],
    ]
    
    for row in fields:
        data.append([
            Paragraph(row[0], styles['TableCellLeft']),
            Paragraph(row[1], styles['TableCellLeft']),
            Paragraph(row[2], styles['TableCell']),
            Paragraph(row[3], styles['TableCell']),
            Paragraph(row[4], styles['TableCell'])
        ])
    
    table = Table(data, colWidths=[1.3*inch, 2*inch, 0.9*inch, 0.9*inch, 0.6*inch])
    table.setStyle(create_table_style())
    elements.append(table)
    
    elements.append(Spacer(1, 12))
    
    # LIQUIDEZ
    elements.append(Paragraph('<b>II. SIGNOS VITALES DE LIQUIDEZ</b>', styles['SectionHeader']))
    
    data2 = [header]
    fields2 = [
        ['Flujo Efectivo', 'Entradas - Salidas', 'Positivo', '+$8,000', '🟢'],
        ['Días de Caja', 'Efectivo / Gasto diario', '30-60 días', '45 días', '🟢'],
    ]
    
    for row in fields2:
        data2.append([
            Paragraph(row[0], styles['TableCellLeft']),
            Paragraph(row[1], styles['TableCellLeft']),
            Paragraph(row[2], styles['TableCell']),
            Paragraph(row[3], styles['TableCell']),
            Paragraph(row[4], styles['TableCell'])
        ])
    
    table2 = Table(data2, colWidths=[1.3*inch, 2*inch, 0.9*inch, 0.9*inch, 0.6*inch])
    table2.setStyle(create_table_style())
    elements.append(table2)
    
    elements.append(Spacer(1, 12))
    
    # OPERATIVOS
    elements.append(Paragraph('<b>III. SIGNOS VITALES OPERATIVOS</b>', styles['SectionHeader']))
    
    data3 = [header]
    fields3 = [
        ['% Costo Alimentos', 'Costo / Ventas', '28-35%', '32%', '🟢'],
        ['Rotación Inventario', 'Costo ventas / Inv. prom', '>4 veces', '4.2', '🟢'],
        ['Ticket Promedio', 'Ventas / Clientes', 'Creciente', '$150', '🟢'],
        ['Tiempo de Servicio', 'Pedido a entrega', '<15 min', '12 min', '🟢'],
    ]
    
    for row in fields3:
        data3.append([
            Paragraph(row[0], styles['TableCellLeft']),
            Paragraph(row[1], styles['TableCellLeft']),
            Paragraph(row[2], styles['TableCell']),
            Paragraph(row[3], styles['TableCell']),
            Paragraph(row[4], styles['TableCell'])
        ])
    
    table3 = Table(data3, colWidths=[1.3*inch, 2*inch, 0.9*inch, 0.9*inch, 0.6*inch])
    table3.setStyle(create_table_style())
    elements.append(table3)
    
    elements.append(Spacer(1, 12))
    
    # PERSONAL
    elements.append(Paragraph('<b>IV. SIGNOS VITALES DE PERSONAL</b>', styles['SectionHeader']))
    
    data4 = [header]
    fields4 = [
        ['% Costo Laboral', 'Nómina / Ventas', '20-30%', '28%', '🟢'],
        ['Ventas por Empleado', 'Ventas / Empleados', 'Alto', '$25,000', '🟢'],
        ['Rotación Personal', 'Salidas / Total', '<20%', '10%', '🟢'],
    ]
    
    for row in fields4:
        data4.append([
            Paragraph(row[0], styles['TableCellLeft']),
            Paragraph(row[1], styles['TableCellLeft']),
            Paragraph(row[2], styles['TableCell']),
            Paragraph(row[3], styles['TableCell']),
            Paragraph(row[4], styles['TableCell'])
        ])
    
    table4 = Table(data4, colWidths=[1.3*inch, 2*inch, 0.9*inch, 0.9*inch, 0.6*inch])
    table4.setStyle(create_table_style())
    elements.append(table4)
    
    elements.append(Spacer(1, 18))
    elements.append(Paragraph('<b>Índice Integral de Salud Empresarial (IISE):</b> 🟢 80-100 = Empresa estructurada | 🟡 60-79 = Riesgo moderado | 🔴 <60 = Intervención urgente', styles['FormatBody']))
    
    doc.build(elements)
    print('✓ F-14 generated')

def main():
    """Generate all 14 formats"""
    print('Generating GFSM™ Format PDFs...\n')
    
    # Create output directory if it doesn't exist
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    # Generate all formats
    generate_f01()
    generate_f02()
    generate_f03()
    generate_f04()
    generate_f05()
    generate_f06()
    generate_f07()
    generate_f08()
    generate_f09()
    generate_f10()
    generate_f11()
    generate_f12()
    generate_f13()
    generate_f14()
    
    print('\n✓ All 14 GFSM™ Format PDFs generated successfully!')
    print(f'Output directory: {OUTPUT_DIR}')

if __name__ == '__main__':
    main()
