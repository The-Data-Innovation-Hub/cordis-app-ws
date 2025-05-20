import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// Routes that require authentication
const protectedRoutes = [
  '/profile',
  '/settings',
  // Exclude dashboard routes from middleware redirection checks
  // (handled by client-side router)
];

// Routes that are only accessible to non-authenticated users
const authRoutes = [
  '/auth/login',
  '/auth/signup',
  '/auth/forgot-password',
  '/auth/reset-password',
];

// Check if the route is protected
const isProtectedRoute = (path: string) =>
  protectedRoutes.some(route => path.startsWith(route));
  
// Paths that should bypass middleware checks
const isExcludedRoute = (path: string) =>
  path.startsWith('/dashboard') || 
  path.startsWith('/admin/dashboard') || 
  path.startsWith('/manager/dashboard') || 
  path.startsWith('/router');

// Check if the route is an auth route
const isAuthRoute = (path: string) =>
  authRoutes.some(route => path.startsWith(route));


export async function middleware(request: NextRequest) {
  // Create response with the original request headers
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Get the pathname and search params from the URL
  const { pathname, searchParams } = request.nextUrl;

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  // Get the session
  const { data: { session } } = await supabase.auth.getSession();

  // Skip middleware checks for dashboard and router routes
  if (isExcludedRoute(pathname)) {
    console.log(`Middleware: Bypassing checks for ${pathname}`);
    return response;
  }
  
  // Handle protected routes
  if (isProtectedRoute(pathname)) {
    // If the user is not signed in and the route is protected, redirect to the login page
    if (!session) {
      const redirectUrl = new URL('/auth/login', request.url);
      redirectUrl.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // If the user is signed in and tries to access an auth route, redirect to the router
  if (isAuthRoute(pathname) && session) {
    console.log('Middleware: User is signed in and accessing auth route');
    return NextResponse.redirect(new URL('/router', request.url));
  }

  // Handle password reset flow
  if (pathname === '/auth/reset-password' && !session) {
    const type = searchParams.get('type');
    if (type !== 'recovery') {
      return NextResponse.redirect(new URL('/auth/forgot-password', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api (API routes)
     * - static files (.png, .jpg, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api/|_next/data/).*)',
  ],
};
