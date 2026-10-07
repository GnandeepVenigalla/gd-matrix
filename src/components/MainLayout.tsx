'use client';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from './Sidebar';
import PortalSidebar from './PortalSidebar';
import React, { useEffect, useState } from 'react';

// Reserved subdomains that are NOT tenant portals
const ROOT_SUBDOMAINS = new Set(['www', 'app', 'api', 'mail', 'localhost', '']);

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [isTenantDomain, setIsTenantDomain] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const hostname = window.location.hostname;
    const parts = hostname.split('.');
    if (parts.length >= 2 && !ROOT_SUBDOMAINS.has(parts[0])) {
      setIsTenantDomain(true);
    }
  }, []);

  const isPortal = pathname?.startsWith('/portal');
  const isAuthPath = pathname?.startsWith('/auth') || pathname === '/';

  useEffect(() => {
    // Client-side authentication guard
    if (!isAuthPath) {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      
      if (!token || !user) {
        router.replace('/auth');
      } else {
        setAuthChecked(true);
      }
    } else {
      setAuthChecked(true);
    }
  }, [pathname, isAuthPath, router]);

  // Prevent flashing unprotected content before redirecting
  if (!authChecked) {
    return <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;
  }

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
