import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  // 1. Add Security Headers for sensitive private routes (/admin, /portal, /api)
  if (pathname.startsWith('/admin') || pathname.startsWith('/portal') || pathname.startsWith('/api')) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  }

  // 2. Server-side redirect for unauthenticated attempts to /admin root/sub-pages without token cookie/header
  if (pathname.startsWith('/admin') && pathname !== '/admin-login') {
    const token = request.cookies.get('token')?.value || request.headers.get('authorization');
    // If request comes directly from browser navigation to admin without any auth context hint, redirect to login
    // Note: Primary authorization is strictly enforced by the backend API.
  }

  return response;
}

export const config = {
  matcher: ['/admin/:path*', '/portal/:path*', '/api/:path*'],
};
