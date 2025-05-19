import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// Routes that require authentication
const protectedRoutes = [
  '/profile',
  '/settings',
  '/dashboard',
];

// Routes that are only accessible to non-authenticated users
const authRoutes = [
  '/auth/sign-in',
  '/auth/sign-up',
  '/auth/reset-password',
];

// Check if the route is protected
const isProtectedRoute = (path: string) =>
  protectedRoutes.some(route => path.startsWith(route));

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

  // Get the pathname from the URL
  const pathname = request.nextUrl.pathname;

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

  // Handle protected routes
  if (isProtectedRoute(pathname)) {
    if (!session) {
      // Redirect to sign in if trying to access protected route without auth
      const redirectUrl = new URL('/auth/sign-in', request.url);
      redirectUrl.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Handle auth routes (sign-in, sign-up, etc.)
  if (isAuthRoute(pathname)) {
    if (session) {
      // Redirect to dashboard if trying to access auth routes while authenticated
      return NextResponse.redirect(new URL('/dashboard', request.url));
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
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
