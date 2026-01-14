'use client';

import { AuthProvider } from '@/contexts/AuthContext';
import { EventProvider } from '@/contexts/EventContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <EventProvider>
        <ToastProvider>
          {children}
        </ToastProvider>
      </EventProvider>
    </AuthProvider>
  );
}
