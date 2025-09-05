import { generateText, streamText } from "ai"
import { getAvailableProvider, checkProviderHealth, AI_PROVIDERS } from "./providers"
import { createClient } from "@/lib/supabase/server"

export interface ChatMessage {
  id?: string
  role: "user" | "assistant" | "system"
  content: string
  provider?: string
  model?: string
  created_at?: string
  user_id?: string
}

export interface ChatOptions {
  messages: ChatMessage[]
  userId?: string
  systemPrompt?: string
  maxTokens?: number
  temperature?: number
}

// Generate text with fallback logic
export async function generateChatResponse(options: ChatOptions): Promise<{
  content: string
  provider: string
  model: string
}> {
  let lastError: Error | null = null

  // Try each provider in order of priority
  for (const provider of AI_PROVIDERS) {
    try {
      // Check if provider is configured
      const isHealthy = await checkProviderHealth(provider)
      if (!isHealthy) continue

      const { text } = await generateText({
        model: provider.client(provider.model),
        messages: options.messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
        system: options.systemPrompt,
        maxTokens: options.maxTokens || 2000,
        temperature: options.temperature || 0.7,
      })

      return {
        content: text,
        provider: provider.name,
        model: provider.model,
      }
    } catch (error) {
      console.error(`Provider ${provider.name} failed:`, error)
      lastError = error as Error
      continue
    }
  }

  throw new Error(`All AI providers failed. Last error: ${lastError?.message}`)
}

// Stream text with fallback logic
export async function streamChatResponse(options: ChatOptions) {
  const provider = getAvailableProvider()

  return streamText({
    model: provider.client(provider.model),
    messages: options.messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    })),
    system: options.systemPrompt,
    maxTokens: options.maxTokens || 2000,
    temperature: options.temperature || 0.7,
  })
}

// Save chat message to database
export async function saveChatMessage(message: ChatMessage): Promise<ChatMessage> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("chat_messages")
    .insert({
      role: message.role,
      content: message.content,
      provider: message.provider,
      model: message.model,
      user_id: message.user_id,
      file_data: null,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

// Get chat history for user
export async function getChatHistory(userId: string, limit = 50): Promise<ChatMessage[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("chat_messages")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: true })
    .limit(limit)

  if (error) throw error
  return data || []
}
