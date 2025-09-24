"use client"
import { useState } from "react"
import {
  Star,
  MessageSquare,
  AlertTriangle,
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ReplyGenerator } from "./reply-generator"

export const ReviewsPage = () => {
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedReview, setSelectedReview] = useState(null)
  const [showReplyGenerator, setShowReplyGenerator] = useState(false)

  const [reviews, setReviews] = useState([
    {
      id: 1,
      reviewer: "Sarah Mitchell",
      rating: 5,
      text: "Amazing service! The staff was incredibly helpful and went above and beyond to make sure I was satisfied. The quality of work exceeded my expectations and I couldn't be happier with the results. Will definitely be coming back!",
      date: "2024-01-15T10:30:00Z",
      location: "Downtown Location",
      status: "replied",
      replyText:
        "Thank you so much for your wonderful review, Sarah! We're thrilled to hear that our team exceeded your expectations. We look forward to serving you again soon!",
      replyDate: "2024-01-15T11:45:00Z",
      isAutoReply: true,
    },
    {
      id: 2,
      reviewer: "John Davis",
      rating: 5,
      text: "Best experience I've had in years. Highly recommend to anyone looking for professional service. The attention to detail was remarkable and the final outcome was perfect.",
      date: "2024-01-14T15:20:00Z",
      location: "Westside Branch",
      status: "pending",
      replyText: null,
      replyDate: null,
      isAutoReply: false,
    },
    {
      id: 3,
      reviewer: "Mike Rodriguez",
      rating: 4,
      text: "Good service overall, but could improve on communication during the process. The end result was satisfactory and the pricing was fair. Would consider using again.",
      date: "2024-01-14T09:15:00Z",
      location: "Downtown Location",
      status: "attention",
      replyText: null,
      replyDate: null,
      isAutoReply: false,
    },
    {
      id: 4,
      reviewer: "Lisa Kim",
      rating: 5,
      text: "Fantastic! Will definitely come back again. The team was professional, efficient, and delivered exactly what was promised. Couldn't ask for better service!",
      date: "2024-01-13T14:45:00Z",
      location: "Eastside Office",
      status: "replied",
      replyText:
        "We're so grateful for your kind words, Lisa! It was our pleasure to serve you, and we can't wait to welcome you back. Thank you for choosing us!",
      replyDate: "2024-01-13T16:20:00Z",
      isAutoReply: true,
    },
    {
      id: 5,
      reviewer: "Tom Brown",
      rating: 1,
      text: "Very disappointed with the service quality. The staff seemed unprofessional and the work was not completed to standard. Would not recommend and will not be returning.",
      date: "2024-01-12T11:30:00Z",
      location: "Westside Branch",
      status: "attention",
      replyText: null,
      replyDate: null,
      isAutoReply: false,
    },
    {
      id: 6,
      reviewer: "Emma Wilson",
      rating: 5,
      text: "Outstanding service from start to finish! The team was knowledgeable, friendly, and delivered exceptional results. This is exactly what customer service should look like.",
      date: "2024-01-11T16:10:00Z",
      location: "Downtown Location",
      status: "pending",
      replyText: null,
      replyDate: null,
      isAutoReply: false,
    },
  ])

  const handleReplyGenerated = (reviewId: number, reply: string) => {
    setReviews((prevReviews) =>
      prevReviews.map((review) =>
        review.id === reviewId
          ? {
              ...review,
              status: "replied",
              replyText: reply,
              replyDate: new Date().toISOString(),
              isAutoReply: true,
            }
          : review,
      ),
    )
  }

  const openReplyGenerator = (review) => {
    if (review.rating === 5) {
      setSelectedReview(review)
      setShowReplyGenerator(true)
    }
  }

  const filteredReviews = reviews.filter((review) => {
    const matchesFilter =
      selectedFilter === "all" ||
      (selectedFilter === "5-star" && review.rating === 5) ||
      (selectedFilter === "1-4-star" && review.rating < 5) ||
      (selectedFilter === "replied" && review.status === "replied") ||
      (selectedFilter === "pending" && review.status === "pending") ||
      (selectedFilter === "attention" && review.status === "attention")

    const matchesSearch =
      review.reviewer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.location.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesFilter && matchesSearch
  })

  const getStatusBadge = (status: string, isAutoReply: boolean) => {
    switch (status) {
      case "replied":
        return (
          <Badge variant="secondary" className="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400">
            {isAutoReply ? "Auto-replied" : "Replied"}
          </Badge>
        )
      case "pending":
        return (
          <Badge
            variant="secondary"
            className="bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400"
          >
            Pending Reply
          </Badge>
        )
      case "attention":
        return (
          <Badge variant="secondary" className="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400">
            Needs Attention
          </Badge>
        )
      default:
        return null
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Reviews</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage and respond to your Google Business reviews</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <MessageSquare className="h-4 w-4 mr-2" />
          Bulk Actions
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {[
            { key: "all", label: "All Reviews", count: reviews.length },
            { key: "5-star", label: "5-Star", count: reviews.filter((r) => r.rating === 5).length },
            { key: "1-4-star", label: "1-4 Star", count: reviews.filter((r) => r.rating < 5).length },
            { key: "replied", label: "Replied", count: reviews.filter((r) => r.status === "replied").length },
            { key: "pending", label: "Pending", count: reviews.filter((r) => r.status === "pending").length },
            { key: "attention", label: "Attention", count: reviews.filter((r) => r.status === "attention").length },
          ].map((filter) => (
            <button
              key={filter.key}
              onClick={() => setSelectedFilter(filter.key)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedFilter === filter.key
                  ? "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {filter.label} ({filter.count})
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search reviews, customers, locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <div
            key={review.id}
            className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Review Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {review.reviewer
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">{review.reviewer}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300 dark:text-gray-600"}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">•</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{review.location}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">•</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{formatDate(review.date)}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusBadge(review.status, review.isAutoReply)}
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                  <MoreHorizontal className="h-4 w-4 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Review Text */}
            <div className="mb-4">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{review.text}</p>
            </div>

            {/* Reply Section */}
            {review.status === "replied" && review.replyText && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                    <MessageSquare className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Your Reply</span>
                  {review.isAutoReply && (
                    <Badge variant="outline" className="text-xs">
                      AI Generated
                    </Badge>
                  )}
                  <span className="text-xs text-gray-500 dark:text-gray-400">{formatDate(review.replyDate!)}</span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{review.replyText}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2">
                {review.status === "pending" && review.rating === 5 && (
                  <Button
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => openReplyGenerator(review)}
                  >
                    <MessageSquare className="h-3 w-3 mr-1" />
                    Generate Reply
                  </Button>
                )}
                {review.status === "attention" && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-orange-200 text-orange-700 hover:bg-orange-50 bg-transparent"
                  >
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Review Manually
                  </Button>
                )}
                {review.status === "replied" && (
                  <Button size="sm" variant="outline">
                    <Edit className="h-3 w-3 mr-1" />
                    Edit Reply
                  </Button>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                  <Eye className="h-4 w-4 text-gray-400" />
                </button>
                {review.status === "replied" && (
                  <>
                    <button className="p-2 hover:bg-green-100 dark:hover:bg-green-900/20 rounded-lg transition-colors">
                      <ThumbsUp className="h-4 w-4 text-gray-400 hover:text-green-600" />
                    </button>
                    <button className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                      <ThumbsDown className="h-4 w-4 text-gray-400 hover:text-red-600" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredReviews.length === 0 && (
        <div className="text-center py-12">
          <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No reviews found</h3>
          <p className="text-gray-500 dark:text-gray-400">
            {searchQuery
              ? "Try adjusting your search terms or filters."
              : "Reviews will appear here once they are fetched from Google Business."}
          </p>
        </div>
      )}

      {/* Reply Generator Modal */}
      {showReplyGenerator && selectedReview && (
        <ReplyGenerator
          review={selectedReview}
          onReplyGenerated={handleReplyGenerated}
          onClose={() => {
            setShowReplyGenerator(false)
            setSelectedReview(null)
          }}
        />
      )}
    </div>
  )
}
