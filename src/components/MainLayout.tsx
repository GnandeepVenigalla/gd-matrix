'use client';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import PortalSidebar from './PortalSidebar';
import React from 'react';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPortal = pathname?.startsWith('/portal');

  return (
    <div className="app-layout">
      {isPortal ? <PortalSidebar /> : <Sidebar />}
      <main className="main-content">{children}</main>
    </div>
  );
}
