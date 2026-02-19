'use client';

import { ReactNode } from 'react';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen gradient-dreamy flex items-center justify-center p-0 sm:p-4">
      <div className="app-container bg-card shadow-float sm:rounded-3xl overflow-hidden min-h-screen sm:min-h-[90vh] sm:max-h-[900px] flex flex-col">
        {children}
      </div>
    </div>
  );
}
