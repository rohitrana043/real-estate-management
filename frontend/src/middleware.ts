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
  '/properties', // Main properties listing is public
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

  // Get the 'from' parameter if it exists
  const from = request.nextUrl.searchParams.get('from');

  console.log(`Middleware processing: ${pathname}`);

  // STEP 1: Handle auth redirects for logged-in users
  // If user is logged in and tries to access auth pages, redirect to dashboard or 'from' parameter
  const isAuthPath =
    authPaths.includes(pathname) ||
    authPaths.some((path) => pathname.startsWith(`${path}/`));

  if (token && isAuthPath) {
    console.log('User is logged in and accessing auth path, redirecting');
    if (from) {
      console.log(`Redirecting to: ${from}`);
      return NextResponse.redirect(new URL(from, request.url));
    }
    console.log('Redirecting to dashboard');
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // STEP 2: Special case for property detail pages (protected)
  // This must come BEFORE the general public paths check
  if (pathname.startsWith('/properties/')) {
    console.log('Property detail page detected');

    if (!token) {
      console.log('No auth token, redirecting to login with from parameter');
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', pathname);

      // Log the complete redirect URL for debugging
      console.log(`Redirecting to: ${loginUrl.toString()}`);

      return NextResponse.redirect(loginUrl);
    }

    console.log('User is authenticated, allowing access to property detail');
    return NextResponse.next();
  }

  // STEP 3: Check if it's a public path (including the main properties page)
  const isPublicPath =
    publicPaths.includes(pathname) ||
    publicPaths.some((path) => path !== '/' && pathname.startsWith(`${path}/`));

  if (isPublicPath) {
    console.log(`Public path detected: ${pathname}, allowing access`);
    return NextResponse.next();
  }

  // STEP 4: At this point, it's a protected route that requires authentication
  if (!token) {
    console.log(
      `Protected route detected: ${pathname}, user not authenticated`
    );
    const loginUrl = new URL('/login', request.url);

    // Only set the 'from' parameter if it's not already a login redirect
    if (!pathname.startsWith('/login')) {
      loginUrl.searchParams.set('from', pathname);
    }

    console.log(`Redirecting to: ${loginUrl.toString()}`);
    return NextResponse.redirect(loginUrl);
  }

  // If we reach here, the user is authenticated and accessing a protected route
  console.log('User is authenticated, proceeding with request');
  return NextResponse.next();
}

// Update the matcher to include all paths that should be protected
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.ico).*)'],
};
