"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Folder, Plus, Trash2, Edit, Calendar } from "lucide-react"
import type { DatabaseProject } from "@/lib/database/projects"
import type { Project } from "@/lib/file-manager"

interface ProjectManagerProps {
  userId?: string
  onProjectLoad: (project: Project) => void
}

export function ProjectManager({ userId, onProjectLoad }: ProjectManagerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [projects, setProjects] = useState<DatabaseProject[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [newProjectName, setNewProjectName] = useState("")
  const [newProjectDescription, setNewProjectDescription] = useState("")
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    if (isOpen && userId) {
      loadProjects()
    }
  }, [isOpen, userId])

  const loadProjects = async () => {
    if (!userId) return

    setIsLoading(true)
    try {
      const response = await fetch("/api/projects")
      const data = await response.json()
      if (data.projects) {
        setProjects(data.projects)
      }
    } catch (error) {
      console.error("Failed to load projects:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const createProject = async () => {
    if (!userId || !newProjectName.trim()) return

    setIsCreating(true)
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newProjectName,
          description: newProjectDescription,
          files: [],
          chat_messages: [],
        }),
      })

      const data = await response.json()
      if (data.project) {
        setProjects((prev) => [data.project, ...prev])
        setNewProjectName("")
        setNewProjectDescription("")
      }
    } catch (error) {
      console.error("Failed to create project:", error)
    } finally {
      setIsCreating(false)
    }
  }

  const loadProject = (project: DatabaseProject) => {
    const projectData: Project = {
      id: project.id,
      name: project.name,
      description: project.description,
      files: project.files,
      chat_messages: project.chat_messages,
    }
    onProjectLoad(projectData)
    setIsOpen(false)
  }

  const deleteProject = async (projectId: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return

    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== projectId))
      }
    } catch (error) {
      console.error("Failed to delete project:", error)
    }
  }

  if (!userId) {
    return (
      <Button variant="outline" size="sm" disabled>
        <Folder className="w-4 h-4 mr-2" />
        Login to Manage Projects
      </Button>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Folder className="w-4 h-4 mr-2" />
          My Projects
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Project Manager</DialogTitle>
          <DialogDescription>Create, load, and manage your AI-generated projects.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Create New Project */}
          <div className="border rounded-lg p-4 space-y-3">
            <h3 className="font-medium flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create New Project
            </h3>
            <div className="grid gap-2">
              <Label htmlFor="project-name">Project Name</Label>
              <Input
                id="project-name"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="My Awesome Website"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="project-description">Description (Optional)</Label>
              <Textarea
                id="project-description"
                value={newProjectDescription}
                onChange={(e) => setNewProjectDescription(e.target.value)}
                placeholder="A brief description of your project..."
                className="min-h-[60px]"
              />
            </div>
            <Button onClick={createProject} disabled={!newProjectName.trim() || isCreating} className="w-full">
              {isCreating ? "Creating..." : "Create Project"}
            </Button>
          </div>

          {/* Existing Projects */}
          <div className="space-y-2">
            <h3 className="font-medium">Your Projects</h3>
            <ScrollArea className="h-[300px]">
              {isLoading ? (
                <div className="text-center py-8 text-muted-foreground">Loading projects...</div>
              ) : projects.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No projects yet. Create your first project above!
                </div>
              ) : (
                <div className="space-y-2">
                  {projects.map((project) => (
                    <div key={project.id} className="border rounded-lg p-3 space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium">{project.name}</h4>
                          {project.description && (
                            <p className="text-sm text-muted-foreground">{project.description}</p>
                          )}
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {project.files.length} files
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {project.chat_messages?.length || 0} messages
                            </Badge>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Calendar className="w-3 h-3" />
                              {new Date(project.updated_at).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" onClick={() => loadProject(project)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => deleteProject(project.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
