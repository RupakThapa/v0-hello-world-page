import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  if (!process.env.GOOGLE_CLIENT_ID) {
    return NextResponse.json(
      { error: "Google OAuth is not configured. Please set GOOGLE_CLIENT_ID environment variable." },
      { status: 500 }
    )
  }

  if (!process.env.NEXT_PUBLIC_APP_URL) {
    return NextResponse.json(
      { error: "Application URL is not configured. Please set NEXT_PUBLIC_APP_URL environment variable." },
      { status: 500 }
    )
  }

  const state = Math.random().toString(36).substring(2, 15)

  const googleAuthUrl = new URL("https://accounts.google.com/oauth/authorize")
  googleAuthUrl.searchParams.set("client_id", process.env.GOOGLE_CLIENT_ID)
  googleAuthUrl.searchParams.set("redirect_uri", `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`)
  googleAuthUrl.searchParams.set("response_type", "code")
  googleAuthUrl.searchParams.set("scope", "openid email profile https://www.googleapis.com/auth/business.manage")
  googleAuthUrl.searchParams.set("access_type", "offline")
  googleAuthUrl.searchParams.set("prompt", "consent")
  googleAuthUrl.searchParams.set("state", state)

  return NextResponse.redirect(googleAuthUrl.toString())
}
