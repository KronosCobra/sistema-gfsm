'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  FileText, 
  TrendingUp, 
  Users, 
  CheckCircle2, 
  ArrowRight,
  Download,
  Star,
  Shield,
  Target,
  BarChart3,
  Clock,
  HeartHandshake,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const formats = [
  { code: 'F-01', name: 'Control Diario de Ventas y Costos', category: 'Financiero', icon: BarChart3 },
  { code: 'F-02', name: 'Recepción de Mercancía', category: 'Control', icon: FileText },
  { code: 'F-03', name: 'Porcionamiento Estándar', category: 'Operativo', icon: Target },
  { code: 'F-04', name: 'Matriz de Gastos Operativos', category: 'Financiero', icon: TrendingUp },
  { code: 'F-05', name: 'Checklist de Apertura', category: 'Operativo', icon: Clock },
  { code: 'F-06', name: 'Checklist de Cierre', category: 'Operativo', icon: CheckCircle2 },
  { code: 'F-07', name: 'Arqueo de Caja', category: 'Control', icon: Shield },
  { code: 'F-08', name: 'Auditoría Financiera Mensual', category: 'Financiero', icon: TrendingUp },
  { code: 'F-09', name: 'Auditoría Operativa', category: 'Operativo', icon: CheckCircle2 },
  { code: 'F-10', name: 'Manual de Imagen', category: 'Branding', icon: Building2 },
  { code: 'F-11', name: 'Control de Turnos', category: 'Personal', icon: Users },
  { code: 'F-12', name: 'Plan de Marketing', category: 'Marketing', icon: Target },
  { code: 'F-13', name: 'Matriz de Crecimiento', category: 'Estrategia', icon: TrendingUp },
  { code: 'F-14', name: 'Signos Vitales KPIs', category: 'Estrategia', icon: BarChart3 },
];

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    businessType: '',
    businessSize: '',
    message: '',
    wantsAdvice: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setShowSuccess(true);
        toast.success('¡Registro exitoso! Revisa tu correo para confirmar.');
      } else {
        toast.error(data.error || 'Error al registrar');
      }
    } catch (error) {
      toast.error('Error de conexión. Intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center"
        >
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-amber-100">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">¡Ya casi estamos!</h2>
            <p className="text-gray-600 mb-6">
              Hemos enviado un correo de confirmación a <strong>{formData.email}</strong>. 
              Revisa tu bandeja de entrada (y la carpeta de spam) para confirmar tu email y acceder a los formatos.
            </p>
            <div className="bg-amber-50 rounded-xl p-4 text-sm text-amber-800">
              <p className="font-medium mb-2">¿Interesado en asesoría personalizada?</p>
              <p>Escríbenos directamente a: <strong>contacto@gfsm.com</strong></p>
            </div>
            <Button 
              className="mt-6 w-full bg-amber-500 hover:bg-amber-600"
              onClick={() => setShowSuccess(false)}
            >
              Registrar otro correo
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-amber-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-xl text-gray-900">GFSM<sup className="text-xs">™</sup></span>
            </div>
            
            <div className="hidden md:flex items-center gap-6">
              <a href="#beneficios" className="text-gray-600 hover:text-amber-600 transition-colors">Beneficios</a>
              <a href="#formatos" className="text-gray-600 hover:text-amber-600 transition-colors">Formatos</a>
              <a href="#registro" className="text-gray-600 hover:text-amber-600 transition-colors">Registro</a>
              <Button className="bg-amber-500 hover:bg-amber-600 text-white">
                Obtener Formatos
              </Button>
            </div>

            <button 
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-white border-b border-amber-100 px-4 py-4"
          >
            <div className="flex flex-col gap-3">
              <a href="#beneficios" className="text-gray-600 py-2">Beneficios</a>
              <a href="#formatos" className="text-gray-600 py-2">Formatos</a>
              <a href="#registro" className="text-gray-600 py-2">Registro</a>
              <Button className="bg-amber-500 hover:bg-amber-600 text-white w-full">
                Obtener Formatos
              </Button>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="bg-amber-100 text-amber-800 mb-4">
                Global Franchise Structure Method™
              </Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                El secreto de las{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">
                  franquicias exitosas
                </span>
                {' '}ahora en tus manos
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Un negocio sin sistema depende de la suerte. Un negocio con sistema depende de{' '}
                <strong className="text-amber-600">estructura</strong>. Obtén los 14 formatos 
                profesionales que utilizan las cadenas internacionales.
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center gap-2 text-gray-700">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span>14 formatos descargables</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span>Sin costo</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span>Acceso inmediato</span>
                </div>
              </div>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-lg px-8 py-6"
                onClick={() => document.getElementById('registro')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Quiero los formatos gratis
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-amber-200 to-orange-200 rounded-3xl transform rotate-3 scale-105 opacity-20" />
              <div className="relative bg-white rounded-3xl shadow-2xl p-6 border border-amber-100">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                      <FileText className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Sistema GFSM™</p>
                      <p className="text-sm text-gray-500">14 formatos profesionales</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    <Download className="w-3 h-3 mr-1" />
                    Disponible
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {formats.slice(0, 6).map((format, i) => (
                    <motion.div
                      key={format.code}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className="bg-gray-50 rounded-xl p-3 text-sm"
                    >
                      <p className="font-medium text-gray-900">{format.code}</p>
                      <p className="text-gray-500 text-xs truncate">{format.name}</p>
                    </motion.div>
                  ))}
                </div>
                <p className="text-center text-gray-500 text-sm mt-4">+ 8 formatos más</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              La mayoría de los negocios no fracasan por falta de clientes.
            </h2>
            <p className="text-xl text-gray-400 leading-relaxed">
              Fracasan por <strong className="text-amber-400">falta de procesos</strong>. 
              Cada decisión sin estructura es una fuga silenciosa de dinero. 
              Las franquicias internacionales saben esto y por eso operan con sistemas probados.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="beneficios" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="bg-amber-100 text-amber-800 mb-4">Beneficios</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Lo que obtienes con el sistema GFSM™
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Herramientas profesionales diseñadas para reducir errores, proteger tu dinero y crecer con control.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: 'Blindaje financiero',
                description: 'Formatos para controlar costos, detectar fugas y mantener márgenes saludables.'
              },
              {
                icon: Target,
                title: 'Estandarización total',
                description: 'Procesos claros que eliminan la improvisación y reducen errores humanos.'
              },
              {
                icon: Users,
                title: 'Equipo alineado',
                description: 'Manuales y checklists para que todos trabajen bajo los mismos estándares.'
              },
              {
                icon: TrendingUp,
                title: 'Crecimiento controlado',
                description: 'Indicadores clave para saber exactamente cuándo y cómo expandir.'
              },
              {
                icon: Clock,
                title: 'Ahorro de tiempo',
                description: 'Menos tiempo apagando incendios, más tiempo construyendo negocio.'
              },
              {
                icon: Star,
                title: 'Calidad de franquicia',
                description: 'Opera con los mismos estándares que las grandes cadenas internacionales.'
              }
            ].map((benefit, i) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
                  <CardContent className="p-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center mb-4">
                      <benefit.icon className="w-7 h-7 text-amber-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Formats Section */}
      <section id="formatos" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="bg-amber-100 text-amber-800 mb-4">Los 14 Formatos</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Sistema completo de gestión empresarial
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Cada formato está diseñado para resolver un problema específico de la operación diaria.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {formats.map((format, i) => (
              <motion.div
                key={format.code}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-amber-300 cursor-pointer group">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-amber-200 transition-colors">
                        <format.icon className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-bold text-amber-600">{format.code}</span>
                          <Badge variant="secondary" className="text-xs">{format.category}</Badge>
                        </div>
                        <p className="font-medium text-gray-900 text-sm">{format.name}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration Section */}
      <section id="registro" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-8 text-white text-center">
              <h2 className="text-3xl font-bold mb-2">
                Accede a los 14 formatos gratis
              </h2>
              <p className="text-amber-100">
                Regístrate y recibirás un correo de confirmación para acceder a las descargas.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre completo *</Label>
                  <Input
                    id="name"
                    placeholder="Tu nombre"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono (opcional)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+52 55 1234 5678"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessType">Tipo de negocio</Label>
                  <Select onValueChange={(value) => setFormData({ ...formData, businessType: value })}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Selecciona una opción" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="restaurante">Restaurante</SelectItem>
                      <SelectItem value="cafeteria">Cafetería</SelectItem>
                      <SelectItem value="farmacia">Farmacia</SelectItem>
                      <SelectItem value="retail">Retail / Tienda</SelectItem>
                      <SelectItem value="servicios">Servicios</SelectItem>
                      <SelectItem value="otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessSize">Tamaño de empresa</Label>
                  <Select onValueChange={(value) => setFormData({ ...formData, businessSize: value })}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Selecciona una opción" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="startup">Startup / Idea</SelectItem>
                      <SelectItem value="pequena">Pequeña (1-10 empleados)</SelectItem>
                      <SelectItem value="mediana">Mediana (11-50 empleados)</SelectItem>
                      <SelectItem value="grande">Grande (+50 empleados)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="message">Mensaje o consulta (opcional)</Label>
                  <Textarea
                    id="message"
                    placeholder="Cuéntanos sobre tu negocio o lo que necesitas..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>

              <div className="mt-6 flex items-start gap-3 p-4 bg-amber-50 rounded-xl">
                <Checkbox
                  id="wantsAdvice"
                  checked={formData.wantsAdvice}
                  onCheckedChange={(checked) => setFormData({ ...formData, wantsAdvice: checked as boolean })}
                  className="mt-1"
                />
                <div className="text-sm">
                  <Label htmlFor="wantsAdvice" className="font-medium text-gray-900 cursor-pointer">
                    Me interesa recibir asesoría personalizada para mi negocio
                  </Label>
                  <p className="text-gray-600 mt-1">
                    Un asesor se pondrá en contacto contigo para entender tus necesidades.
                  </p>
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full mt-6 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white h-14 text-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  'Procesando...'
                ) : (
                  <>
                    Registrar y obtener acceso
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </>
                )}
              </Button>

              <p className="text-center text-gray-500 text-sm mt-4">
                Al registrarte aceptas recibir comunicaciones relacionadas con el sistema GFSM™.
                No compartiremos tus datos con terceros.
              </p>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-gray-500 mb-8">Emprendedores de toda Latinoamérica están estructurando sus negocios</p>
            <div className="flex flex-wrap justify-center gap-8 items-center">
              <div className="text-center">
                <p className="text-4xl font-bold text-amber-600">14</p>
                <p className="text-gray-600 text-sm">Formatos profesionales</p>
              </div>
              <div className="w-px h-12 bg-gray-300 hidden sm:block" />
              <div className="text-center">
                <p className="text-4xl font-bold text-amber-600">5</p>
                <p className="text-gray-600 text-sm">Áreas clave cubiertas</p>
              </div>
              <div className="w-px h-12 bg-gray-300 hidden sm:block" />
              <div className="text-center">
                <p className="text-4xl font-bold text-amber-600">100%</p>
                <p className="text-gray-600 text-sm">Acceso gratuito</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              La estructura siempre gana.
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Solo existen dos tipos de negocios: los que improvisan, y los que operan como franquicia.
            </p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-lg px-8 py-6"
              onClick={() => document.getElementById('registro')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Quiero operar como franquicia
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white">GFSM<sup className="text-xs">™</sup></span>
            </div>
            <p className="text-sm text-center">
              Global Franchise Structure Method™ | Creado por Eduardo Bravo
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-amber-400 transition-colors">Términos</a>
              <a href="#" className="hover:text-amber-400 transition-colors">Privacidad</a>
              <a href="#" className="hover:text-amber-400 transition-colors">Contacto</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
