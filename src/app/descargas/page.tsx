'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Download, 
  FileText, 
  CheckCircle2, 
  ArrowLeft,
  Building2,
  TrendingUp,
  Target,
  Shield,
  Users,
  BarChart3,
  Clock,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { toast } from 'sonner';

interface Format {
  code: string;
  name: string;
  description: string;
  category: string;
  downloaded: boolean;
  downloadedAt?: string;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  'Financiero': TrendingUp,
  'Control': Shield,
  'Operativo': Target,
  'Branding': Building2,
  'Personal': Users,
  'Marketing': Target,
  'Estrategia': BarChart3
};

function DownloadsContent() {
  const searchParams = useSearchParams();
  const subscriberId = searchParams.get('id');
  
  const [formats, setFormats] = useState<Format[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingCode, setDownloadingCode] = useState<string | null>(null);

  useEffect(() => {
    if (!subscriberId) {
      setLoading(false);
      return;
    }
    fetchFormats();
  }, [subscriberId]);

  const fetchFormats = async () => {
    try {
      const response = await fetch(`/api/downloads?subscriberId=${subscriberId}`);
      const data = await response.json();
      setFormats(data.formats || []);
    } catch (error) {
      toast.error('Error al cargar los formatos');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (formatCode: string) => {
    if (!subscriberId) {
      toast.error('Debes estar registrado para descargar');
      return;
    }

    setDownloadingCode(formatCode);
    try {
      const response = await fetch(`/api/downloads?subscriberId=${subscriberId}&format=${formatCode}`);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al descargar');
      }

      // Crear blob y descargar
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${formatCode}-GFSM.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success('Formato descargado correctamente');
      
      // Actualizar estado local
      setFormats(prev => 
        prev.map(f => 
          f.code === formatCode 
            ? { ...f, downloaded: true, downloadedAt: new Date().toISOString() }
            : f
        )
      );
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al descargar');
    } finally {
      setDownloadingCode(null);
    }
  };

  if (!subscriberId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-amber-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Acceso requerido</h2>
            <p className="text-gray-600 mb-6">
              Debes registrarte y verificar tu email para acceder a los formatos.
            </p>
            <Link href="/#registro">
              <Button className="bg-amber-500 hover:bg-amber-600 text-white w-full">
                Ir al registro
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      {/* Header */}
      <header className="bg-white border-b border-amber-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-xl text-gray-900">GFSM<sup className="text-xs">™</sup></span>
            </Link>
            <Link href="/">
              <Button variant="ghost" className="text-gray-600">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al inicio
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Badge className="bg-green-100 text-green-800 mb-4">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Cuenta verificada
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Tus formatos GFSM™
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Descarga los 14 formatos profesionales para estructurar tu negocio con estándares de franquicia.
          </p>
        </motion.div>

        {/* Formats Grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(14)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
                <div className="h-6 bg-gray-200 rounded w-2/3 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {formats.map((format, i) => {
              const Icon = iconMap[format.category] || FileText;
              return (
                <motion.div
                  key={format.code}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className={`h-full hover:shadow-lg transition-all duration-300 ${
                    format.downloaded 
                      ? 'border-green-300 bg-green-50/30' 
                      : 'border-gray-200 hover:border-amber-300'
                  }`}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          format.downloaded ? 'bg-green-100' : 'bg-amber-100'
                        }`}>
                          <Icon className={`w-5 h-5 ${format.downloaded ? 'text-green-600' : 'text-amber-600'}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-sm font-bold ${format.downloaded ? 'text-green-600' : 'text-amber-600'}`}>
                              {format.code}
                            </span>
                            <Badge variant="secondary" className="text-xs">{format.category}</Badge>
                          </div>
                          <p className="font-medium text-gray-900 text-sm">{format.name}</p>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 text-xs mb-3">{format.description}</p>
                      
                      <Button
                        onClick={() => handleDownload(format.code)}
                        disabled={downloadingCode === format.code}
                        className={`w-full h-9 ${
                          format.downloaded
                            ? 'bg-green-600 hover:bg-green-700 text-white'
                            : 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white'
                        }`}
                        size="sm"
                      >
                        {downloadingCode === format.code ? (
                          'Descargando...'
                        ) : format.downloaded ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 mr-1" />
                            Descargar de nuevo
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4 mr-1" />
                            Descargar PDF
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* CTA Asesoría */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 bg-gradient-to-r from-amber-500 to-orange-600 rounded-3xl p-8 text-white text-center"
        >
          <h3 className="text-2xl font-bold mb-3">¿Quieres implementar estos formatos en tu negocio?</h3>
          <p className="text-amber-100 mb-6 max-w-2xl mx-auto">
            Nuestro equipo de asesores puede ayudarte a adaptar el sistema GFSM™ a las necesidades específicas de tu empresa.
          </p>
          <Button className="bg-white text-amber-600 hover:bg-amber-50 px-8">
            Solicitar asesoría personalizada
          </Button>
        </motion.div>
      </main>
    </div>
  );
}

export default function DownloadsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-amber-500 animate-spin" />
      </div>
    }>
      <DownloadsContent />
    </Suspense>
  );
}
