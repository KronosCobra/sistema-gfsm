import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import { Providers } from '@/components/providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'GFSM™ - Global Franchise Structure Method | Sistema de Gestión Empresarial',
  description: 'Descubre el método que utilizan las franquicias internacionales para estructurar negocios. Obtén los 14 formatos de gestión profesional.',
  keywords: 'franquicias, gestión empresarial, negocios, PyMEs, emprendimiento, GFSM',
  authors: [{ name: 'Eduardo Bravo' }],
  openGraph: {
    title: 'GFSM™ - Global Franchise Structure Method',
    description: 'El secreto de las franquicias internacionales ahora disponible para tu negocio.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster position="top-right" />
        </Providers>
      </body>
    </html>
  );
}
