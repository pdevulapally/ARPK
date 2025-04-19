import { NextResponse } from "next/server"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"

export async function POST(request: Request) {
  try {
    const { projectDescription } = await request.json()

    if (!projectDescription || typeof projectDescription !== "string") {
      return NextResponse.json({ error: "Project description is required" }, { status: 400 })
    }

    const { text } = await generateText({
      model: groq("llama3-70b-8192"),
      prompt: `You are a web development pricing assistant for ARPK Web Development. 
      Based on the following project description, recommend one of our three plans:
      1. Simple Website (£100-£200): 1-3 pages, clean design, ideal for portfolios, takes 2-4 days
      2. Medium Website (£250-£400): 4-8 pages, custom animations, forms, optional blog, takes 5-7 days
      3. Complex Website (£500-£1000+): Logins, dashboards, admin panels, Stripe integration, takes 10-20 days
      
      Project description: ${projectDescription}
      
      Provide a friendly, concise recommendation with:
      1. Which plan is best suited (Simple, Medium, or Complex)
      2. Estimated price range within that plan's range
      3. Estimated timeline
      4. Brief explanation of why this plan fits their needs
      5. 1-2 suggestions for features they might want to consider
      
      Keep your response under 150 words and make it conversational.`,
    })

    return NextResponse.json({ text })
  } catch (error) {
    console.error("Error in AI suggestion:", error)
    return NextResponse.json({ error: "Failed to generate suggestion" }, { status: 500 })
  }
}
