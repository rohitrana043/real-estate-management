import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Public paths that don't require authentication
const publicPaths = [
  '/',
  '/images',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
  '/about',
  '/contact',
  '/services',
  '/properties',
  '/newsletter',
];

// Auth paths that should redirect to dashboard if already logged in
const authPaths = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  const { pathname } = request.nextUrl;

  // Handle property detail routes separately (protected)
  if (pathname.startsWith('/properties/')) {
    if (!token) {
      console.log('Redirecting to login from protected property detail route');
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // Main properties listing page is public
  if (pathname === '/properties') {
    return NextResponse.next();
  }

  // Get the 'from' parameter if it exists
  const from = request.nextUrl.searchParams.get('from');

  // Check if the current path is an auth page
  const isAuthPath =
    authPaths.includes(pathname) ||
    authPaths.some((path) => pathname.startsWith(`${path}/`));

  // Check if the current path is one of the public paths
  const isPublicPath =
    publicPaths.includes(pathname) ||
    publicPaths.some((path) => path !== '/' && pathname.startsWith(`${path}/`));

  // If user is logged in and tries to access auth pages, redirect to dashboard
  if (token && isAuthPath) {
    if (from) {
      return NextResponse.redirect(new URL(from, request.url));
    }
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If user is not logged in and tries to access protected routes
  if (!token && !isPublicPath) {
    console.log('Redirecting to login from protected route');
    const loginUrl = new URL('/login', request.url);

    // Only set the 'from' parameter if it's not already a login redirect
    if (!pathname.startsWith('/login')) {
      loginUrl.searchParams.set('from', pathname);
    }

    return NextResponse.redirect(loginUrl);
  }

  // Special handling for the home route - always allow
  if (pathname === '/') {
    console.log('Allowing access to home route');
    return NextResponse.next();
  }

  console.log('Proceeding with request');
  return NextResponse.next();
}

// Update the matcher to include all paths that should be protected
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.ico).*)'],
};
