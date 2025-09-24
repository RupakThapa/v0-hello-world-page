"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Star, TrendingUp, MessageSquare, Clock, LogOut } from "lucide-react"
import { SettingsPage } from "./settings-page"
import { ReviewsPage } from "./reviews-page"
import { LocationsPage } from "./locations-page"

export function ReviewDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      window.location.href = "/login"
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const stats = [
    {
      title: "5-Star Reviews",
      value: "127",
      change: "+12%",
      icon: Star,
      color: "text-yellow-500",
    },
    {
      title: "Auto-Replies Sent",
      value: "89",
      change: "+8%",
      icon: MessageSquare,
      color: "text-blue-500",
    },
    {
      title: "Response Rate",
      value: "94%",
      change: "+2%",
      icon: TrendingUp,
      color: "text-green-500",
    },
    {
      title: "Avg Response Time",
      value: "2.3h",
      change: "-15min",
      icon: Clock,
      color: "text-purple-500",
    },
  ]

  const recentActivity = [
    {
      id: 1,
      type: "reply_sent",
      customer: "Sarah Johnson",
      rating: 5,
      time: "2 minutes ago",
      location: "Downtown Location",
    },
    {
      id: 2,
      type: "review_received",
      customer: "Mike Chen",
      rating: 5,
      time: "15 minutes ago",
      location: "Mall Location",
    },
    {
      id: 3,
      type: "reply_approved",
      customer: "Emma Davis",
      rating: 5,
      time: "1 hour ago",
      location: "Downtown Location",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Monitor your Google Reviews and auto-reply performance</p>
        </div>
        <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2 bg-transparent">
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">{stat.change}</span> from last month
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest review interactions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {activity.type === "reply_sent" && <MessageSquare className="h-4 w-4 text-blue-500" />}
                      {activity.type === "review_received" && <Star className="h-4 w-4 text-yellow-500" />}
                      {activity.type === "reply_approved" && <TrendingUp className="h-4 w-4 text-green-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{activity.customer}</p>
                      <div className="flex items-center space-x-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < activity.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">{activity.location}</span>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">{activity.time}</div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
                <CardDescription>This month's performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Auto-Reply Success Rate</span>
                    <span className="font-medium">96%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: "96%" }} />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Customer Satisfaction</span>
                    <span className="font-medium">4.8/5</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "96%" }} />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Active Locations</span>
                    <span className="font-medium">3/3</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: "100%" }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reviews">
          <ReviewsPage />
        </TabsContent>

        <TabsContent value="locations">
          <LocationsPage />
        </TabsContent>

        <TabsContent value="settings">
          <SettingsPage />
        </TabsContent>
      </Tabs>
    </div>
  )
}
