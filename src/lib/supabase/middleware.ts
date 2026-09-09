import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const ATTENDEE_ROUTES = [
  '/dashboard',
  '/map',
  '/itinerary',
  '/alternatives',
  '/booking-confirmation',
  '/help',
  '/notifications',
  '/onboarding',
  '/profile',
  '/trip-summary',
];

const ORGANIZER_ROUTES = [
  '/command-center',
  '/accommodation',
  '/alerts',
  '/simulation',
  '/transport',
  '/venues',
];

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    'placeholder-anon-key';

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // Refresh auth session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  const isAttendeeRoute = ATTENDEE_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
  const isOrganizerRoute = ORGANIZER_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // Protected route check: unauthenticated users redirect to /login
  if ((isAttendeeRoute || isOrganizerRoute) && !user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/login';
    redirectUrl.searchParams.set('next', pathname);
    const redirectResponse = NextResponse.redirect(redirectUrl);
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value);
    });
    return redirectResponse;
  }

  // If already logged in, visiting login or signup redirects to respective dashboard
  if (user && (pathname === '/login' || pathname === '/signup')) {
    const role = user.user_metadata?.role;
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = role === 'organizer' ? '/command-center' : '/dashboard';
    redirectUrl.searchParams.delete('next');
    const redirectResponse = NextResponse.redirect(redirectUrl);
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value);
    });
    return redirectResponse;
  }

  return supabaseResponse;
}

