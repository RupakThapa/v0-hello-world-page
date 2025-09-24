"use client"
import { useState, useEffect } from "react"
import { ExternalLink, CheckCircle, AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"

export const GoogleConnection = () => {
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [configError, setConfigError] = useState<string | null>(null)

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
    if (!clientId) {
      setConfigError("NEXT_PUBLIC_GOOGLE_CLIENT_ID environment variable is not set")
    }

    // Check for auth errors in URL params
    const urlParams = new URLSearchParams(window.location.search)
    const googleError = urlParams.get("google_error")
    const googleConnected = urlParams.get("google_connected")

    if (googleError === "connection_failed") {
      setError("Failed to connect to Google. Please check your configuration and try again.")
    } else if (googleConnected === "true") {
      setIsConnected(true)
    }
  }, [])

  const handleConnect = () => {
    console.log("[v0] Starting Google OAuth connection")
    setIsConnecting(true)
    setError(null)

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

    if (!clientId) {
      console.error("[v0] Missing NEXT_PUBLIC_GOOGLE_CLIENT_ID")
      setError("Google OAuth is not configured. Missing client ID.")
      setIsConnecting(false)
      return
    }

    const redirectUri = `${window.location.origin}/api/google/auth`
    const scope = "openid email profile https://www.googleapis.com/auth/business.manage"
    const state = Math.random().toString(36).substring(2, 15)

    console.log("[v0] OAuth config:", { clientId, redirectUri, scope })

    const googleAuthUrl = new URL("https://accounts.google.com/oauth/authorize")
    googleAuthUrl.searchParams.set("client_id", clientId)
    googleAuthUrl.searchParams.set("redirect_uri", redirectUri)
    googleAuthUrl.searchParams.set("response_type", "code")
    googleAuthUrl.searchParams.set("scope", scope)
    googleAuthUrl.searchParams.set("access_type", "offline")
    googleAuthUrl.searchParams.set("prompt", "consent")
    googleAuthUrl.searchParams.set("state", state)

    console.log("[v0] Redirecting to:", googleAuthUrl.toString())

    // Redirect to Google OAuth
    window.location.href = googleAuthUrl.toString()
  }

  const handleDisconnect = () => {
    // In a real app, this would revoke the tokens and clear stored data
    setIsConnected(false)
    setError(null)
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-yellow-500 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Google Business Profile</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Connect your Google Business Profile to sync reviews and manage responses
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {isConnected ? (
            <Badge variant="secondary" className="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400">
              <CheckCircle className="h-3 w-3 mr-1" />
              Connected
            </Badge>
          ) : (
            <Badge variant="secondary" className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
              <AlertCircle className="h-3 w-3 mr-1" />
              Not Connected
            </Badge>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {configError && (
          <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700 dark:text-red-300">
              <strong>Configuration Error:</strong> {configError}
              <br />
              <span className="text-sm">
                Please add the required environment variables to your Vercel project settings.
              </span>
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700 dark:text-red-300">
              <strong>Connection Error:</strong> {error}
            </AlertDescription>
          </Alert>
        )}

        {!isConnected ? (
          <>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">What you'll get:</h4>
              <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <li>• Automatic review syncing from all your locations</li>
                <li>• AI-powered replies to 5-star reviews</li>
                <li>• Real-time notifications for new reviews</li>
                <li>• Centralized management of multiple locations</li>
              </ul>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
              <h4 className="font-medium text-yellow-900 dark:text-yellow-100 mb-2">Permissions Required:</h4>
              <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                <li>• Read your business profile information</li>
                <li>• View and manage customer reviews</li>
                <li>• Post replies to customer reviews</li>
              </ul>
            </div>

            {configError && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Setup Required:</h4>
                <ol className="text-sm text-gray-700 dark:text-gray-300 space-y-1 list-decimal list-inside">
                  <li>Go to your Vercel project settings</li>
                  <li>Add the following environment variables:</li>
                  <ul className="ml-4 mt-1 space-y-1 list-disc list-inside">
                    <li>
                      <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">GOOGLE_CLIENT_ID</code>
                    </li>
                    <li>
                      <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">GOOGLE_CLIENT_SECRET</code>
                    </li>
                    <li>
                      <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">NEXT_PUBLIC_APP_URL</code>
                    </li>
                    <li>
                      <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">NEXT_PUBLIC_GOOGLE_CLIENT_ID</code>
                    </li>
                  </ul>
                  <li>Redeploy your application</li>
                </ol>
              </div>
            )}

            <Button
              onClick={handleConnect}
              disabled={isConnecting || !!configError}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
            >
              {isConnecting ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Connect Google Business Profile
                </>
              )}
            </Button>
          </>
        ) : (
          <>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">Connection Active</h4>
              <p className="text-sm text-green-700 dark:text-green-300">
                Your Google Business Profile is connected and syncing reviews automatically.
              </p>
            </div>

            <div className="flex space-x-3">
              <Button variant="outline" className="flex-1 bg-transparent">
                <RefreshCw className="h-4 w-4 mr-2" />
                Sync Now
              </Button>
              <Button
                variant="outline"
                onClick={handleDisconnect}
                className="flex-1 text-red-600 hover:text-red-700 bg-transparent"
              >
                Disconnect
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
