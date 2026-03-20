'use client';

import { useEffect, useState, useReducer } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Loader2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

type State = {
  status: 'loading' | 'success' | 'error';
  subscriber: { id: string; name: string; email: string } | null;
};

type Action = 
  | { type: 'SUCCESS'; payload: { id: string; name: string; email: string } }
  | { type: 'ERROR' };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SUCCESS':
      return { status: 'success', subscriber: action.payload };
    case 'ERROR':
      return { status: 'error', subscriber: null };
    default:
      return state;
  }
}

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [state, dispatch] = useReducer(reducer, { 
    status: 'loading', 
    subscriber: null 
  });

  useEffect(() => {
    if (!token) {
      dispatch({ type: 'ERROR' });
      return;
    }

    const controller = new AbortController();
    
    fetch(`/api/verify?token=${token}`, { signal: controller.signal })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.subscriber) {
          dispatch({ type: 'SUCCESS', payload: data.subscriber });
        } else {
          dispatch({ type: 'ERROR' });
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          dispatch({ type: 'ERROR' });
        }
      });

    return () => controller.abort();
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full"
      >
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center border border-amber-100">
          {state.status === 'loading' && (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                className="w-16 h-16 mx-auto mb-6"
              >
                <Loader2 className="w-16 h-16 text-amber-500" />
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Verificando tu email...</h2>
              <p className="text-gray-600">Por favor espera un momento.</p>
            </>
          )}

          {state.status === 'success' && state.subscriber && (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', duration: 0.5 }}
                className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Email verificado!</h2>
              <p className="text-gray-600 mb-6">
                Bienvenido/a, <strong>{state.subscriber.name}</strong>. Tu cuenta ha sido activada.
              </p>
              <div className="bg-amber-50 rounded-xl p-4 mb-6">
                <p className="text-amber-800 text-sm">
                  Ya puedes acceder a los 14 formatos del sistema GFSM™.
                </p>
              </div>
              <Link href={`/descargas?id=${state.subscriber.id}`}>
                <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white h-12">
                  <Download className="w-4 h-4 mr-2" />
                  Ir a descargas
                </Button>
              </Link>
            </>
          )}

          {state.status === 'error' && (
            <>
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle className="w-10 h-10 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Error de verificación</h2>
              <p className="text-gray-600 mb-6">
                El enlace es inválido o ha expirado. Por favor, solicita un nuevo registro.
              </p>
              <Link href="/#registro">
                <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white h-12">
                  Volver a registrarme
                </Button>
              </Link>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
