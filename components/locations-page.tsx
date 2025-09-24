"use client"
import { useState, useEffect } from "react"
import {
  MapPin,
  Phone,
  Globe,
  Star,
  RefreshCw,
  Settings,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { GoogleConnection } from "./google-connection"

interface Location {
  id: string
  name: string
  address: string
  phoneNumber: string
  websiteUrl: string
  categories: string[]
  averageRating: number
  totalReviews: number
  isConnected: boolean
  lastSyncDate: string | null
}

export const LocationsPage = () => {
  const [locations, setLocations] = useState<Location[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [syncingLocation, setSyncingLocation] = useState<string | null>(null)

  useEffect(() => {
    fetchLocations()
  }, [])

  const fetchLocations = async () => {
    try {
      const response = await fetch("/api/google/locations")
      const data = await response.json()
      setLocations(data.locations || [])
    } catch (error) {
      console.error("Error fetching locations:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLocationToggle = async (locationId: string, currentStatus: boolean) => {
    try {
      const action = currentStatus ? "disconnect" : "connect"
      const response = await fetch("/api/google/locations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locationId, action }),
      })

      if (response.ok) {
        setLocations((prev) =>
          prev.map((loc) => (loc.id === locationId ? { ...loc, isConnected: !currentStatus } : loc)),
        )
      }
    } catch (error) {
      console.error("Error toggling location:", error)
    }
  }

  const handleSyncReviews = async (locationId: string) => {
    setSyncingLocation(locationId)
    try {
      const response = await fetch("/api/google/reviews/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locationId, forceSync: true }),
      })

      const data = await response.json()
      if (data.success) {
        // Update location with new sync data
        setLocations((prev) =>
          prev.map((loc) =>
            loc.id === locationId
              ? {
                  ...loc,
                  lastSyncDate: data.data.syncedAt,
                  totalReviews: data.data.totalReviews,
                  averageRating: data.data.averageRating,
                }
              : loc,
          ),
        )
      }
    } catch (error) {
      console.error("Error syncing reviews:", error)
    } finally {
      setSyncingLocation(null)
    }
  }

  const formatLastSync = (dateString: string | null) => {
    if (!dateString) return "Never"
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Locations</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your Google Business Profile locations and review settings
          </p>
        </div>
        <Button onClick={fetchLocations} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Google Connection */}
      <GoogleConnection />

      {/* Locations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {locations.map((location) => (
          <div
            key={location.id}
            className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Location Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">{location.name}</h3>
                  <div className="flex items-center space-x-1 mt-1">
                    {location.categories.map((category, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {location.isConnected ? (
                  <Badge
                    variant="secondary"
                    className="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                  >
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                    <XCircle className="h-3 w-3 mr-1" />
                    Inactive
                  </Badge>
                )}
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                  <MoreHorizontal className="h-4 w-4 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Location Details */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <MapPin className="h-4 w-4" />
                <span>{location.address}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <Phone className="h-4 w-4" />
                <span>{location.phoneNumber}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <Globe className="h-4 w-4" />
                <a href={location.websiteUrl} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                  {location.websiteUrl}
                </a>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {location.averageRating.toFixed(1)}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Average Rating</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{location.totalReviews}</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Total Reviews</p>
              </div>
            </div>

            {/* Last Sync */}
            <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Last sync: {formatLastSync(location.lastSyncDate)}
                </span>
              </div>
              {location.isConnected && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleSyncReviews(location.id)}
                  disabled={syncingLocation === location.id}
                >
                  {syncingLocation === location.id ? (
                    <RefreshCw className="h-3 w-3 animate-spin" />
                  ) : (
                    <RefreshCw className="h-3 w-3" />
                  )}
                </Button>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <Button
                onClick={() => handleLocationToggle(location.id, location.isConnected)}
                className={`flex-1 ${
                  location.isConnected
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
              >
                {location.isConnected ? "Disconnect" : "Connect"}
              </Button>
              <Button variant="outline" className="flex-1 bg-transparent">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {locations.length === 0 && (
        <div className="text-center py-12">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No locations found</h3>
          <p className="text-gray-500 dark:text-gray-400">
            Connect your Google Business Profile to see your locations here.
          </p>
        </div>
      )}
    </div>
  )
}
