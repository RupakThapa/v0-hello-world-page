import { type NextRequest, NextResponse } from "next/server"

// Mock data for demonstration - in a real app, this would fetch from Google My Business API
const mockLocations = [
  {
    id: "locations/12345",
    name: "Downtown Location",
    address: "123 Main St, Downtown, NY 10001",
    phoneNumber: "+1-555-0123",
    websiteUrl: "https://example.com",
    categories: ["Restaurant", "Italian"],
    averageRating: 4.6,
    totalReviews: 127,
    isConnected: true,
    lastSyncDate: "2024-01-15T10:30:00Z",
  },
  {
    id: "locations/67890",
    name: "Westside Branch",
    address: "456 Oak Ave, Westside, NY 10002",
    phoneNumber: "+1-555-0456",
    websiteUrl: "https://example.com/westside",
    categories: ["Restaurant", "Italian"],
    averageRating: 4.4,
    totalReviews: 89,
    isConnected: true,
    lastSyncDate: "2024-01-15T09:15:00Z",
  },
  {
    id: "locations/11111",
    name: "Eastside Office",
    address: "789 Pine St, Eastside, NY 10003",
    phoneNumber: "+1-555-0789",
    websiteUrl: "https://example.com/eastside",
    categories: ["Restaurant", "Italian"],
    averageRating: 4.8,
    totalReviews: 156,
    isConnected: false,
    lastSyncDate: null,
  },
]

export async function GET(request: NextRequest) {
  try {
    // In a real app, you would:
    // 1. Verify the user's authentication
    // 2. Use their stored Google access token
    // 3. Make requests to Google My Business API
    // 4. Handle pagination and rate limiting

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return NextResponse.json({
      locations: mockLocations,
      totalCount: mockLocations.length,
    })
  } catch (error) {
    console.error("Error fetching locations:", error)
    return NextResponse.json({ error: "Failed to fetch locations" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { locationId, action } = await request.json()

    if (!locationId || !action) {
      return NextResponse.json({ error: "Missing locationId or action" }, { status: 400 })
    }

    // In a real app, this would enable/disable review syncing for the location
    console.log(`${action} location: ${locationId}`)

    return NextResponse.json({
      success: true,
      message: `Location ${action === "connect" ? "connected" : "disconnected"} successfully`,
    })
  } catch (error) {
    console.error("Error updating location:", error)
    return NextResponse.json({ error: "Failed to update location" }, { status: 500 })
  }
}
