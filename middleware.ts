import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if user is authenticated
  const accessToken = request.cookies.get("access_token")
  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/api/auth")
  const isProtectedPage = pathname.startsWith("/dashboard") || pathname === "/"

  // Redirect unauthenticated users to login
  if (isProtectedPage && !accessToken) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Redirect authenticated users away from login
  if (isAuthPage && accessToken && !pathname.startsWith("/api/auth")) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
