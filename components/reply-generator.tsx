"use client"
import type React from "react"
import { useState } from "react"
import { Wand2, RefreshCw, Check, X, Copy, ThumbsUp, ThumbsDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

interface ReplyGeneratorProps {
  review: {
    id: number
    reviewer: string
    rating: number
    text: string
    location: string
  }
  onReplyGenerated: (reviewId: number, reply: string) => void
  onClose: () => void
}

export const ReplyGenerator: React.FC<ReplyGeneratorProps> = ({ review, onReplyGenerated, onClose }) => {
  const [generatedReply, setGeneratedReply] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [editedReply, setEditedReply] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [error, setError] = useState("")

  const generateReply = async () => {
    setIsGenerating(true)
    setError("")

    try {
      const response = await fetch("/api/generate-reply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reviewText: review.text,
          reviewerName: review.reviewer,
          rating: review.rating,
          location: review.location,
          brandVoice: "professional and friendly",
          customInstructions: "Express genuine gratitude and encourage future visits",
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate reply")
      }

      setGeneratedReply(data.reply)
      setEditedReply(data.reply)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate reply")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleApprove = () => {
    const finalReply = isEditing ? editedReply : generatedReply
    onReplyGenerated(review.id, finalReply)
    onClose()
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(isEditing ? editedReply : generatedReply)
  }

  const provideFeedback = (isPositive: boolean) => {
    // In a real app, this would send feedback to improve the AI model
    console.log(`Feedback for reply: ${isPositive ? "positive" : "negative"}`)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Wand2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Generate AI Reply</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Create a professional response to this 5-star review
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Review Display */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {review.reviewer
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">{review.reviewer}</h3>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`text-sm ${i < review.rating ? "text-yellow-400" : "text-gray-300"}`}>
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">•</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{review.location}</span>
                </div>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{review.text}</p>
          </div>

          {/* Generate Button */}
          {!generatedReply && (
            <div className="text-center">
              <Button
                onClick={generateReply}
                disabled={isGenerating}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Generating Reply...
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4 mr-2" />
                    Generate AI Reply
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
              <Button onClick={generateReply} variant="outline" size="sm" className="mt-2 bg-transparent">
                Try Again
              </Button>
            </div>
          )}

          {/* Generated Reply */}
          {generatedReply && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-900 dark:text-gray-100">Generated Reply</h3>
                <div className="flex items-center space-x-2">
                  <Badge
                    variant="secondary"
                    className="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                  >
                    AI Generated
                  </Badge>
                  <button
                    onClick={copyToClipboard}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    title="Copy to clipboard"
                  >
                    <Copy className="h-4 w-4 text-gray-400" />
                  </button>
                </div>
              </div>

              {!isEditing ? (
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{generatedReply}</p>
                </div>
              ) : (
                <Textarea
                  value={editedReply}
                  onChange={(e) => setEditedReply(e.target.value)}
                  className="min-h-[100px]"
                  placeholder="Edit the generated reply..."
                />
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button onClick={() => setIsEditing(!isEditing)} variant="outline" size="sm">
                    {isEditing ? "Preview" : "Edit Reply"}
                  </Button>
                  <Button onClick={generateReply} variant="outline" size="sm" disabled={isGenerating}>
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Regenerate
                  </Button>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => provideFeedback(true)}
                    className="p-2 hover:bg-green-100 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                    title="Good reply"
                  >
                    <ThumbsUp className="h-4 w-4 text-gray-400 hover:text-green-600" />
                  </button>
                  <button
                    onClick={() => provideFeedback(false)}
                    className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Poor reply"
                  >
                    <ThumbsDown className="h-4 w-4 text-gray-400 hover:text-red-600" />
                  </button>
                </div>
              </div>

              {/* Approve/Cancel Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button onClick={onClose} variant="outline">
                  Cancel
                </Button>
                <Button onClick={handleApprove} className="bg-green-600 hover:bg-green-700 text-white">
                  <Check className="h-4 w-4 mr-2" />
                  Approve & Post Reply
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
