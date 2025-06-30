// app/middleware.js
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request) {
  let response = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_API_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll().reduce((cookies, { name, value }) => {
            cookies[name] = value;
            return cookies;
          }, {});
        },
        setAll(cookies) {
          const responseCookies = [];
          Object.entries(cookies).forEach(([name, value]) => {
            if (value === "") {
              // If value is empty, remove the cookie
              request.cookies.delete(name);
              response.cookies.delete(name);
            } else {
              // Otherwise set the cookie
              request.cookies.set(name, value);
              responseCookies.push({ name, value });
            }
          });
          if (responseCookies.length) {
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            });
            responseCookies.forEach(({ name, value }) => {
              response.cookies.set(name, value);
            });
          }
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Redirect unauthenticated users from protected routes
  if (!session && request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect authenticated users away from auth routes
  if (session && ["/login", "/signup"].includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"],
};
