import { NextRequest, NextResponse } from 'next/server';

/**
 * Multi-tenant subdomain middleware for GD Matrix.
 *
 * A tenant subdomain (e.g. gd-enterprises.gdmatrix.com) serves the normal app
 * pages. The pages themselves read the tenant from the hostname
 * (see src/lib/tenantConfig.ts) to show the company branding.
 *
 * Routing rules on a tenant subdomain:
 *  - / or /login  → redirect to /auth/employee/login
 *  - /signup      → redirect to /auth/employee/signup
 *  - everything else → normal Next.js routing (query string preserved)
 *
 * Main domain (gdmatrix.com / www.gdmatrix.com / *.vercel.app / localhost) → normal routing.
 */

const ROOT_SUBDOMAINS = new Set(['www', 'app', 'api', 'mail', 'smtp']);

function getTenantSlug(host: string): string | null {
  const hostname = host.split(':')[0].toLowerCase();

  // Vercel preview/production URLs are never tenants
  if (hostname.endsWith('.vercel.app')) return null;

  const parts = hostname.split('.');

  // Local dev: acme.localhost
  if (parts.length === 2 && parts[1] === 'localhost') {
    return ROOT_SUBDOMAINS.has(parts[0]) ? null : parts[0];
  }

  // Need at least sub.domain.tld
  if (parts.length < 3) return null;

  const candidate = parts[0];
  return ROOT_SUBDOMAINS.has(candidate) ? null : candidate;
}

export function middleware(request: NextRequest) {
  const tenantSlug = getTenantSlug(request.headers.get('host') ?? '');

  // No subdomain → employer/main portal, normal routing
  if (!tenantSlug) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  const currentPath = url.pathname;

  if (currentPath === '/' || currentPath === '' || currentPath === '/login') {
    url.pathname = '/auth/employee/login';
    return NextResponse.redirect(url);
  }

  if (currentPath === '/signup') {
    url.pathname = '/auth/employee/signup';
    return NextResponse.redirect(url);
  }

  const response = NextResponse.next();
  response.headers.set('x-tenant-slug', tenantSlug);
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/).*)'],
};
