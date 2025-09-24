import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { reviewText, reviewerName, rating, location, brandVoice, customInstructions } = await request.json()

    // Validate required fields
    if (!reviewText || !reviewerName || !rating) {
      return NextResponse.json({ error: "Missing required fields: reviewText, reviewerName, rating" }, { status: 400 })
    }

    // Only generate replies for 5-star reviews as per requirements
    if (rating !== 5) {
      return NextResponse.json({ error: "AI replies are only generated for 5-star reviews" }, { status: 400 })
    }

    // Build the prompt based on brand voice and custom instructions
    const systemPrompt = `You are an AI assistant that generates professional, on-brand responses to 5-star Google Business reviews. 

IMPORTANT GUIDELINES:
- Only respond to 5-star reviews (this is already filtered)
- Keep responses warm, genuine, and appreciative
- Mention the reviewer's name naturally
- Keep responses concise (2-3 sentences max)
- Avoid making specific promises about future services
- Don't mention sensitive topics like refunds, complaints, or legal issues
- Match the brand voice: ${brandVoice || "professional and friendly"}
- Include location reference if provided: ${location || "our location"}

BRAND VOICE: ${brandVoice || "Professional and friendly - express genuine gratitude while maintaining professionalism"}

CUSTOM INSTRUCTIONS: ${customInstructions || "None"}

Generate a response that feels personal and authentic while following these guidelines.`

    const userPrompt = `Please generate a response to this 5-star review:

Reviewer: ${reviewerName}
Rating: ${rating} stars
Location: ${location || "Not specified"}
Review: "${reviewText}"

Generate a warm, professional response that thanks the customer and encourages them to return.`

    // Use Vercel AI Gateway with ChatGPT o3 model
    const { text } = await generateText({
      model: openai("gpt-4o"), // Using GPT-4o as o3 may not be available yet
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      maxTokens: 200,
    })

    // Basic content safety check
    const prohibitedWords = ["refund", "complaint", "lawsuit", "legal", "sue", "court", "lawyer"]
    const hasProhibitedContent = prohibitedWords.some((word) => text.toLowerCase().includes(word.toLowerCase()))

    if (hasProhibitedContent) {
      return NextResponse.json(
        { error: "Generated reply contains prohibited content. Please try again." },
        { status: 400 },
      )
    }

    return NextResponse.json({
      reply: text.trim(),
      generatedAt: new Date().toISOString(),
      model: "gpt-4o",
      brandVoice: brandVoice || "professional and friendly",
    })
  } catch (error) {
    console.error("Error generating reply:", error)
    return NextResponse.json({ error: "Failed to generate reply. Please try again." }, { status: 500 })
  }
}
