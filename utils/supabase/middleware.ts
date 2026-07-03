import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// This runs on every request via middleware.ts. It refreshes the Supabase
// auth session (so tokens don't silently expire) and enforces login-required
// access: any route other than /auth requires a logged-in user, and gets
// redirected to /auth otherwise. This is real, server-enforced gating --
// not just hiding UI on the client.
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: do not run any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake here can make it very hard to
  // debug issues with users being randomly logged out.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthRoute = request.nextUrl.pathname.startsWith('/auth');

  if (!user && !isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/auth';
    return NextResponse.redirect(url);
  }

  if (user && isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}