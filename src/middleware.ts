import { NextRequest, NextResponse } from 'next/server';

/**
 * Multi-tenant subdomain middleware for GD Matrix.
 *
 * Routing rules (when a tenant subdomain is detected):
 *  - /          → /tenant/[slug]/login   (show consultant login)
 *  - /login     → /tenant/[slug]/login
 *  - /signup    → /tenant/[slug]/signup
 *  - /portal/…  → pass through as-is     (consultant dashboard pages)
 *  - everything else on main domain → normal Next.js routing
 *
 * Local dev: use meta9.localhost:3001 to simulate meta9.matrix.com
 */

const ROOT_SUBDOMAINS = new Set(['www', 'app', 'api', 'mail', 'smtp']);

// Paths that should be served as-is on a tenant subdomain (not rewritten to /tenant/...)
const TENANT_PASSTHROUGH = ['/portal', '/_next', '/favicon', '/api'];

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host') ?? '';

  // ── Extract subdomain ──
  const hostWithoutPort = hostname.split(':')[0];
  const parts = hostWithoutPort.split('.');

  let tenantSlug: string | null = null;
  if (parts.length >= 2) {
    const candidate = parts[0];
    if (!ROOT_SUBDOMAINS.has(candidate)) {
      tenantSlug = candidate;
    }
  }

  // No subdomain → employer/main portal, normal routing
  if (!tenantSlug) {
    return NextResponse.next();
  }

  const currentPath = url.pathname;

  // ── Pass through portal pages and assets untouched ──
  // e.g. meta9.localhost:3001/portal/dashboard → serve /portal/dashboard normally
  if (TENANT_PASSTHROUGH.some((prefix) => currentPath.startsWith(prefix))) {
    return NextResponse.next();
  }

  // Already internally rewritten — don't double-rewrite
  if (currentPath.startsWith('/tenant')) {
    return NextResponse.next();
  }

  // ── Rewrite auth paths to tenant-specific pages ──
  // / or /login  → /tenant/[slug]/login
  // /signup      → /tenant/[slug]/signup
  let newPath: string;
  if (currentPath === '/' || currentPath === '' || currentPath === '/login') {
    newPath = `/tenant/${tenantSlug}/login`;
  } else if (currentPath === '/signup') {
    newPath = `/tenant/${tenantSlug}/signup`;
  } else {
    // Any other unrecognised path on a subdomain → send to login
    newPath = `/tenant/${tenantSlug}/login`;
  }

  url.pathname = newPath;
  const response = NextResponse.rewrite(url);
  response.headers.set('x-tenant-slug', tenantSlug);
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/).*)'],
};
