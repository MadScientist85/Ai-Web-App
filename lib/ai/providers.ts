import { openai } from "@ai-sdk/openai"
import { createOpenAI } from "@ai-sdk/openai"

// AI Provider Configuration
export interface AIProvider {
  name: string
  model: string
  client: any
  priority: number
}

// OpenAI Provider (Primary)
const openaiProvider: AIProvider = {
  name: "openai",
  model: "gpt-4o",
  client: openai,
  priority: 1,
}

// OpenRouter Provider (Fallback 1)
const openrouterProvider: AIProvider = {
  name: "openrouter",
  model: "openai/gpt-4o",
  client: createOpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
  }),
  priority: 2,
}

// GROQ Provider (Fallback 2)
const groqProvider: AIProvider = {
  name: "groq",
  model: "llama-3.1-70b-versatile",
  client: createOpenAI({
    baseURL: "https://api.groq.com/openai/v1",
    apiKey: process.env.GROQ_API_KEY,
  }),
  priority: 3,
}

// XAI Provider (Fallback 3)
const xaiProvider: AIProvider = {
  name: "xai",
  model: "grok-beta",
  client: createOpenAI({
    baseURL: "https://api.x.ai/v1",
    apiKey: process.env.XAI_API_KEY,
  }),
  priority: 4,
}

export const AI_PROVIDERS: AIProvider[] = [openaiProvider, openrouterProvider, groqProvider, xaiProvider].sort(
  (a, b) => a.priority - b.priority,
)

// Get available provider with fallback logic
export function getAvailableProvider(): AIProvider {
  // Check environment variables and return first available provider
  for (const provider of AI_PROVIDERS) {
    switch (provider.name) {
      case "openai":
        if (process.env.OPENAI_API_KEY) return provider
        break
      case "openrouter":
        if (process.env.OPENROUTER_API_KEY) return provider
        break
      case "groq":
        if (process.env.GROQ_API_KEY) return provider
        break
      case "xai":
        if (process.env.XAI_API_KEY) return provider
        break
    }
  }

  // Default to OpenAI if no keys found (will error gracefully)
  return openaiProvider
}

// Provider health check
export async function checkProviderHealth(provider: AIProvider): Promise<boolean> {
  try {
    // Simple health check - attempt a minimal generation
    const { generateText } = await import("ai")
    await generateText({
      model: provider.client(provider.model),
      prompt: "test",
      maxTokens: 1,
    })
    return true
  } catch (error) {
    console.error(`Provider ${provider.name} health check failed:`, error)
    return false
  }
}
