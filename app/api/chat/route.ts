import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { groq } from "@ai-sdk/groq"
import { xai } from "@ai-sdk/xai"

const AI_PROVIDERS = [
  {
    name: "OpenAI",
    model: openai("gpt-4o-mini"),
    provider: "openai",
  },
  {
    name: "Groq",
    model: groq("llama-3.1-70b-versatile"),
    provider: "groq",
  },
  {
    name: "XAI",
    model: xai("grok-beta"),
    provider: "xai",
  },
]

async function generateWithFallback(messages: any[], systemPrompt: string) {
  for (const provider of AI_PROVIDERS) {
    try {
      console.log(`[v0] Attempting to use ${provider.name}`)

      const { text } = await generateText({
        model: provider.model,
        system: systemPrompt,
        messages: messages.map((msg: any) => ({
          role: msg.role,
          content: msg.content,
        })),
      })

      console.log(`[v0] Successfully generated response using ${provider.name}`)

      return {
        content: text,
        provider: provider.name,
        model:
          provider.provider === "openai"
            ? "gpt-4o-mini"
            : provider.provider === "groq"
              ? "llama-3.1-70b-versatile"
              : "grok-beta",
      }
    } catch (error) {
      console.error(`[v0] ${provider.name} failed:`, error)

      // If this is the last provider, throw the error
      if (provider === AI_PROVIDERS[AI_PROVIDERS.length - 1]) {
        throw error
      }

      // Otherwise, continue to next provider
      continue
    }
  }

  throw new Error("All AI providers failed")
}

export async function POST(request: NextRequest) {
  try {
    const { messages, systemPrompt } = await request.json()

    const result = await generateWithFallback(messages, systemPrompt)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 })
  }
}
