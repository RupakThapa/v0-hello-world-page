import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const googleAuthUrl = new URL("https://accounts.google.com/oauth/authorize")

  googleAuthUrl.searchParams.set("client_id", process.env.GOOGLE_CLIENT_ID || "")
  googleAuthUrl.searchParams.set("redirect_uri", `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`)
  googleAuthUrl.searchParams.set("response_type", "code")
  googleAuthUrl.searchParams.set("scope", "openid email profile https://www.googleapis.com/auth/business.manage")
  googleAuthUrl.searchParams.set("access_type", "offline")
  googleAuthUrl.searchParams.set("prompt", "consent")

  return NextResponse.redirect(googleAuthUrl.toString())
}
