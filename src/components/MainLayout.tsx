'use client';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import PortalSidebar from './PortalSidebar';
import React, { useEffect, useState } from 'react';

// Reserved subdomains that are NOT tenant portals
const ROOT_SUBDOMAINS = new Set(['www', 'app', 'api', 'mail', 'localhost', '']);

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Detect if we're on a tenant subdomain (e.g. meta9.localhost:3001 or meta9.matrix.com).
  // usePathname() returns the browser URL path which is '/' after a middleware rewrite,
  // so we also check the hostname directly.
  const [isTenantDomain, setIsTenantDomain] = useState(false);

  useEffect(() => {
    const hostname = window.location.hostname;
    const parts = hostname.split('.');
    if (parts.length >= 2 && !ROOT_SUBDOMAINS.has(parts[0])) {
      setIsTenantDomain(true);
    }
  }, []);

  const isPortal = pathname?.startsWith('/portal');
  const isAuthPath = pathname?.startsWith('/auth') || pathname?.startsWith('/tenant');

  // /portal/... pages always get the PortalSidebar — on any domain or subdomain
  if (isPortal) {
    return (
      <div className="app-layout">
        <PortalSidebar />
        <main className="main-content">{children}</main>
      </div>
    );
  }

  // Auth & tenant login pages → full-screen, no sidebar
  if (isAuthPath || isTenantDomain) {
    return <>{children}</>;
  }

  // Main employer portal pages → admin Sidebar
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">{children}</main>
    </div>
  );
}
