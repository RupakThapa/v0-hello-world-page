import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")
  const state = searchParams.get("state")

  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.NEXT_PUBLIC_APP_URL) {
    console.error("Missing required environment variables for Google OAuth")
    return NextResponse.json(
      { error: "Google OAuth is not configured. Please check environment variables." },
      { status: 500 }
    )
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
      const errorData = await tokenResponse.text()
      console.error("Token exchange failed:", errorData)
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
