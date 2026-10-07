import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Consultant Portal – GD Matrix',
};

export default function TenantLayout({ children }: { children: React.ReactNode }) {
  // Tenant pages are full-screen — no sidebar
  return <>{children}</>;
}
