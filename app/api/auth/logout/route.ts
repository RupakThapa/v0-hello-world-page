import { NextResponse } from "next/server"

export async function POST() {
  try {
    // Create response and clear the authentication cookie
    const response = NextResponse.json({ success: true })
    response.cookies.set("access_token", "", {
      path: "/",
      expires: new Date(0),
    })

    return response
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ error: "Logout failed" }, { status: 500 })
  }
}
