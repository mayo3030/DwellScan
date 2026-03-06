import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Paths that don't require authentication
const PUBLIC_PATHS = ['/', '/login', '/register', '/marketplace', '/pricing', '/about', '/api/stripe/webhook', '/api/inspectors/search'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (PUBLIC_PATHS.some(p => pathname === p || pathname.startsWith(p + '/'))) {
    return NextResponse.next();
  }

  // Allow API routes (they handle their own auth)
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Allow static files
  if (pathname.startsWith('/_next/') || pathname.startsWith('/favicon') || pathname.includes('.')) {
    return NextResponse.next();
  }

  // Check for auth cookie
  const token = request.cookies.get('dwellscan-session')?.value;
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
