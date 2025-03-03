// Protecting routes with next-auth
// https://next-auth.js.org/configuration/nextjs#middleware
// https://nextjs.org/docs/app/building-your-application/routing/middleware

// import NextAuth from 'next-auth';
// import authConfig from './auth.config';

// const { auth } = NextAuth(authConfig);

// export default auth((req) => {
//   if (!req.auth) {
//     const url = req.url.replace(req.nextUrl.pathname, '/');
//     return Response.redirect(url);
//   }
// });

// export const config = { matcher: ['/dashboard/:path*'] };

// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'

// export function middleware(request: NextRequest) {
//   const path = request.nextUrl.pathname;
//   const isPublicPath = path === '/';

//   const token = request.cookies.get("token")?.value || ""; // Extract token from cookies

//   if (isPublicPath && token) {
//     // Redirect to home page if already logged in
//     return NextResponse.redirect(new URL("/dashboard", request.nextUrl))
//   }

//   if (!isPublicPath && !token) {
//     // Redirect to signin page if not logged in
//     return NextResponse.redirect(new URL("/", request.nextUrl));
//   }
// }

// export const config = {
//   matcher: [
//     "/",
//     "/auth/signin",
//     "/auth/signup",
//   ]
// }

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isPublicPath = path === '/' || path.startsWith('/auth');

  // Get the token from cookies to determine if the user is authenticated
  const token =
    request.cookies.get('next-auth.session-token')?.value ||
    request.cookies.get('__Secure-next-auth.session-token')?.value ||
    '';

  // Redirect authenticated users away from public paths to the dashboard
  if (isPublicPath && token) {
    return NextResponse.redirect(
      new URL('/dashboard/overview', request.nextUrl)
    );
  }

  // Redirect unauthenticated users from protected paths to the login page
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/', request.nextUrl));
  }

  // Continue with the request if no redirection is needed
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/dashboard/:path*', // Protecting the dashboard and all its subpaths
    '/auth/signin',
    '/auth/signup'
  ]
};
