import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  console.log("[v0] Google OAuth callback received")

  // Check environment variables first
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.NEXT_PUBLIC_APP_URL) {
    return NextResponse.json(
      {
        error: "Missing environment variables",
        debug: {
          GOOGLE_CLIENT_ID: !!process.env.GOOGLE_CLIENT_ID,
          GOOGLE_CLIENT_SECRET: !!process.env.GOOGLE_CLIENT_SECRET,
          NEXT_PUBLIC_APP_URL: !!process.env.NEXT_PUBLIC_APP_URL,
        },
      },
      { status: 500 },
    )
  }

  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")
  const error = searchParams.get("error")

  // Handle OAuth errors from Google
  if (error) {
    const redirectUrl = new URL("/dashboard", process.env.NEXT_PUBLIC_APP_URL)
    redirectUrl.searchParams.set("google_error", error)
    return NextResponse.redirect(redirectUrl)
  }

  if (!code) {
    return NextResponse.json({ error: "Authorization code not provided" }, { status: 400 })
  }

  try {
    // Exchange authorization code for access token
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        code,
        grant_type: "authorization_code",
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/google/auth`,
      }),
    })

    const tokenData = await tokenResponse.json()

    if (!tokenResponse.ok) {
      throw new Error(tokenData.error_description || "Failed to exchange code for token")
    }

    const redirectUrl = new URL("/dashboard", process.env.NEXT_PUBLIC_APP_URL)
    redirectUrl.searchParams.set("google_connected", "true")
    return NextResponse.redirect(redirectUrl)
  } catch (error) {
    console.error("Google OAuth error:", error)
    const redirectUrl = new URL("/dashboard", process.env.NEXT_PUBLIC_APP_URL)
    redirectUrl.searchParams.set("google_error", "connection_failed")
    return NextResponse.redirect(redirectUrl)
  }
}

export async function POST(request: NextRequest) {
  console.log("[v0] POST request received at OAuth callback")
  return GET(request)
}
