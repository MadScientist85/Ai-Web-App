import { createClient } from "@/lib/supabase/server"

export interface UserProfile {
  id: string
  display_name?: string
  avatar_url?: string
  bio?: string
  preferences: Record<string, any>
  created_at: string
  updated_at: string
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const supabase = await createClient()

  const { data, error } = await supabase.from("user_profiles").select("*").eq("id", userId).single()

  if (error) {
    if (error.code === "PGRST116") return null // Not found
    throw error
  }
  return data
}

export async function updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("user_profiles")
    .upsert({
      id: userId,
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function createUserProfile(userId: string, profile: Partial<UserProfile>): Promise<UserProfile> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("user_profiles")
    .insert({
      id: userId,
      display_name: profile.display_name,
      avatar_url: profile.avatar_url,
      bio: profile.bio,
      preferences: profile.preferences || {},
    })
    .select()
    .single()

  if (error) throw error
  return data
}
