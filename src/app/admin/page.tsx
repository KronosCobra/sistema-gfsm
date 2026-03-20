'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Users, 
  Mail, 
  CheckCircle2, 
  XCircle, 
  Clock,
  Download,
  Star,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Building2,
  Eye,
  Trash2,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

interface Subscriber {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  businessType: string | null;
  businessSize: string | null;
  message: string | null;
  wantsAdvice: boolean;
  isVerified: boolean;
  verifiedAt: string | null;
  createdAt: string;
  _count: {
    downloads: number;
  };
}

interface Stats {
  total: number;
  verified: number;
  pending: number;
  wantsAdvice: number;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, verified: 0, pending: 0, wantsAdvice: 0 });
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterVerified, setFilterVerified] = useState<string>('all');
  const [selectedSubscriber, setSelectedSubscriber] = useState<Subscriber | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchSubscribers();
    }
  }, [pagination.page, filterVerified, status]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-amber-500 animate-spin" />
      </div>
    );
  }

  if (!session) return null;

  const fetchSubscribers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });
      if (filterVerified !== 'all') {
        params.append('verified', filterVerified);
      }
      if (filterVerified === 'advice') {
        params.delete('verified');
        params.append('wantsAdvice', 'true');
      }

      const response = await fetch(`/api/admin?${params}`);
      const data = await response.json();
      
      setSubscribers(data.subscribers || []);
      setStats(data.stats);
      setPagination(prev => ({
        ...prev,
        total: data.pagination.total,
        totalPages: data.pagination.totalPages
      }));
    } catch (error) {
      toast.error('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getBusinessTypeLabel = (type: string | null) => {
    const labels: Record<string, string> = {
      'restaurante': 'Restaurante',
      'cafeteria': 'Cafetería',
      'farmacia': 'Farmacia',
      'retail': 'Retail',
      'servicios': 'Servicios',
      'otro': 'Otro'
    };
    return type ? labels[type] || type : '-';
  };

  const getBusinessSizeLabel = (size: string | null) => {
    const labels: Record<string, string> = {
      'startup': 'Startup',
      'pequena': 'Pequeña',
      'mediana': 'Mediana',
      'grande': 'Grande'
    };
    return size ? labels[size] || size : '-';
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este registro?')) return;
    
    try {
      const response = await fetch(`/api/admin?id=${id}`, { method: 'DELETE' });
      if (response.ok) {
        toast.success('Registro eliminado');
        fetchSubscribers();
      }
    } catch (error) {
      toast.error('Error al eliminar');
    }
  };

  const filteredSubscribers = subscribers.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="font-bold text-xl text-gray-900">GFSM<sup className="text-xs">™</sup></span>
                <span className="text-gray-500 ml-2">Panel de Administración</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">Hola, {session.user?.name || 'Admin'}</span>
              <Button 
                variant="outline" 
                onClick={fetchSubscribers}
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Actualizar
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Leads</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Verificados</p>
                    <p className="text-3xl font-bold text-green-600">{stats.verified}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Pendientes</p>
                    <p className="text-3xl font-bold text-amber-600">{stats.pending}</p>
                  </div>
                  <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Interesados en Asesoría</p>
                    <p className="text-3xl font-bold text-purple-600">{stats.wantsAdvice}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Star className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por nombre o email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterVerified} onValueChange={setFilterVerified}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="true">Verificados</SelectItem>
                  <SelectItem value="false">Pendientes</SelectItem>
                  <SelectItem value="advice">Quieren asesoría</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Lista de Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Negocio</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Asesoría</TableHead>
                    <TableHead>Descargas</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    [...Array(5)].map((_, i) => (
                      <TableRow key={i}>
                        {[...Array(8)].map((_, j) => (
                          <TableCell key={j}>
                            <div className="h-4 bg-gray-200 rounded animate-pulse" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : filteredSubscribers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-gray-500 py-8">
                        No se encontraron registros
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredSubscribers.map((subscriber) => (
                      <TableRow key={subscriber.id}>
                        <TableCell className="font-medium">{subscriber.name}</TableCell>
                        <TableCell className="text-gray-600">{subscriber.email}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p>{getBusinessTypeLabel(subscriber.businessType)}</p>
                            <p className="text-gray-400">{getBusinessSizeLabel(subscriber.businessSize)}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {subscriber.isVerified ? (
                            <Badge className="bg-green-100 text-green-800">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Verificado
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                              <Clock className="w-3 h-3 mr-1" />
                              Pendiente
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {subscriber.wantsAdvice ? (
                            <Badge className="bg-purple-100 text-purple-800">
                              <Star className="w-3 h-3 mr-1" />
                              Sí
                            </Badge>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Download className="w-4 h-4 text-gray-400" />
                            <span>{subscriber._count.downloads}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {formatDate(subscriber.createdAt)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => setSelectedSubscriber(subscriber)}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-lg">
                                <DialogHeader>
                                  <DialogTitle>Detalle del Lead</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <p className="text-sm text-gray-500">Nombre</p>
                                      <p className="font-medium">{subscriber.name}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-gray-500">Email</p>
                                      <p className="font-medium">{subscriber.email}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-gray-500">Teléfono</p>
                                      <p className="font-medium">{subscriber.phone || '-'}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-gray-500">Tipo de Negocio</p>
                                      <p className="font-medium">{getBusinessTypeLabel(subscriber.businessType)}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-gray-500">Tamaño</p>
                                      <p className="font-medium">{getBusinessSizeLabel(subscriber.businessSize)}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-gray-500">Descargas</p>
                                      <p className="font-medium">{subscriber._count.downloads}</p>
                                    </div>
                                  </div>
                                  {subscriber.message && (
                                    <div>
                                      <p className="text-sm text-gray-500 mb-1">Mensaje</p>
                                      <p className="bg-gray-50 p-3 rounded-lg text-sm">{subscriber.message}</p>
                                    </div>
                                  )}
                                  <div className="flex gap-2 pt-4">
                                    <Button className="flex-1 bg-amber-500 hover:bg-amber-600">
                                      Contactar
                                    </Button>
                                    <Button 
                                      variant="destructive"
                                      onClick={() => handleDelete(subscriber.id)}
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDelete(subscriber.id)}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-gray-500">
                  Mostrando {(pagination.page - 1) * pagination.limit + 1} a{' '}
                  {Math.min(pagination.page * pagination.limit, pagination.total)} de {pagination.total}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={pagination.page === 1}
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={pagination.page === pagination.totalPages}
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
