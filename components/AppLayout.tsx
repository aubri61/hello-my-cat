"use client";

import { ReactNode } from "react";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen gradient-dreamy flex items-center justify-center p-4 sm:p-6">
      <div
        className="app-container bg-card shadow-float rounded-3xl overflow-hidden flex flex-col w-full"
        style={{ height: "90vh" }}
      >
        {" "}
        {children}
      </div>
    </div>
  );
}
