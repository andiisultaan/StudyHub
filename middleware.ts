import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const session = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  // Define which routes are public (don't require authentication)
  const publicPaths = ["/", "/api/auth"];

  // Define which routes are protected (require authentication)
  const protectedPaths = ["/create-roadmap"];

  const isPublicPath = publicPaths.some(path => request.nextUrl.pathname.startsWith(path));
  const isProtectedPath = protectedPaths.some(path => request.nextUrl.pathname.startsWith(path));

  if (!session && (isProtectedPath || (!isPublicPath && !request.nextUrl.pathname.startsWith("/sign-in")))) {
    // Redirect unauthenticated users to login page
    const loginUrl = new URL("/sign-in", request.url);
    loginUrl.searchParams.set("callbackUrl", request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (session && request.nextUrl.pathname.startsWith("/sign-in")) {
    // Redirect authenticated users away from login page
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Continue with the request if authenticated or accessing a public path
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
