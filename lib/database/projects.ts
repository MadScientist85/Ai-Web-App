import { createClient } from "@/lib/supabase/server"
import type { Project, ProjectFile } from "@/lib/file-manager"

export interface DatabaseProject {
  id: string
  user_id: string
  name: string
  description?: string
  files: ProjectFile[]
  chat_messages: any[]
  created_at: string
  updated_at: string
}

export async function saveProject(project: Omit<Project, "id">, userId: string): Promise<DatabaseProject> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("projects")
    .insert({
      user_id: userId,
      name: project.name,
      description: project.description,
      files: project.files,
      chat_messages: project.chat_messages || [],
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateProject(
  projectId: string,
  updates: Partial<Project>,
  userId: string,
): Promise<DatabaseProject> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("projects")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", projectId)
    .eq("user_id", userId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getUserProjects(userId: string): Promise<DatabaseProject[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })

  if (error) throw error
  return data || []
}

export async function getProject(projectId: string, userId: string): Promise<DatabaseProject | null> {
  const supabase = await createClient()

  const { data, error } = await supabase.from("projects").select("*").eq("id", projectId).eq("user_id", userId).single()

  if (error) {
    if (error.code === "PGRST116") return null // Not found
    throw error
  }
  return data
}

export async function deleteProject(projectId: string, userId: string): Promise<void> {
  const supabase = await createClient()

  const { error } = await supabase.from("projects").delete().eq("id", projectId).eq("user_id", userId)

  if (error) throw error
}
