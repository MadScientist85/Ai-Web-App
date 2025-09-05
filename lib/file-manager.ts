export interface ProjectFile {
  name: string
  content: string
  type: "html" | "css" | "js" | "json" | "txt"
}

export interface Project {
  id?: string
  name: string
  description?: string
  files: ProjectFile[]
  chat_messages?: any[]
  created_at?: string
  updated_at?: string
}

// Download project as ZIP-like structure
export function downloadProject(project: Project) {
  const files = project.files.map((file) => ({
    name: file.name,
    content: file.content,
  }))

  // Create a simple project structure
  const projectData = {
    name: project.name,
    description: project.description,
    files: files,
    generated_at: new Date().toISOString(),
  }

  const blob = new Blob([JSON.stringify(projectData, null, 2)], {
    type: "application/json",
  })

  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `${project.name.replace(/\s+/g, "-").toLowerCase()}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// Download individual code files
export function downloadCodeFiles(code: { html: string; css: string; js: string }, projectName = "website") {
  const files = [
    { name: "index.html", content: code.html, type: "text/html" },
    { name: "styles.css", content: code.css, type: "text/css" },
    { name: "script.js", content: code.js, type: "text/javascript" },
  ]

  files.forEach((file) => {
    if (file.content.trim()) {
      const blob = new Blob([file.content], { type: file.type })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = file.name
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  })
}

// Parse uploaded project file
export function parseProjectFile(file: File): Promise<Project> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const project = JSON.parse(content) as Project
        resolve(project)
      } catch (error) {
        reject(new Error("Invalid project file format"))
      }
    }
    reader.onerror = () => reject(new Error("Failed to read file"))
    reader.readAsText(file)
  })
}

// Export chat history
export function downloadChatHistory(messages: any[], projectName = "chat-history") {
  const chatData = {
    exported_at: new Date().toISOString(),
    project_name: projectName,
    messages: messages,
  }

  const blob = new Blob([JSON.stringify(chatData, null, 2)], {
    type: "application/json",
  })

  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `${projectName}-chat-history.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
