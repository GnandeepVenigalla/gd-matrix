import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In – GD Matrix',
  description: 'Sign in or create your GD Matrix account.',
};

// Auth pages render full-screen – no sidebar needed.
// MainLayout already short-circuits for /auth routes,
// but this layout segment ensures clean metadata.
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
