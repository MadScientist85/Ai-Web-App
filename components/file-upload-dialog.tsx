"use client"

import type React from "react"

import { useState } from "react"
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
import { Upload, FileText } from "lucide-react"
import { parseProjectFile, type Project } from "@/lib/file-manager"

interface FileUploadDialogProps {
  onProjectLoad: (project: Project) => void
  onChatLoad: (messages: any[]) => void
}

export function FileUploadDialog({ onProjectLoad, onChatLoad }: FileUploadDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsLoading(true)
    setError(null)

    try {
      if (file.name.includes("chat-history")) {
        // Handle chat history file
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            const content = e.target?.result as string
            const chatData = JSON.parse(content)
            onChatLoad(chatData.messages || [])
            setIsOpen(false)
          } catch (error) {
            setError("Invalid chat history file format")
          }
        }
        reader.readAsText(file)
      } else {
        // Handle project file
        const project = await parseProjectFile(file)
        onProjectLoad(project)
        setIsOpen(false)
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to load file")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Upload className="w-4 h-4 mr-2" />
          Upload Project
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Project or Chat History</DialogTitle>
          <DialogDescription>
            Upload a previously exported project file or chat history to continue working.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="file-upload">Select File</Label>
            <Input id="file-upload" type="file" accept=".json" onChange={handleFileUpload} disabled={isLoading} />
          </div>
          {error && (
            <div className="text-sm text-red-500 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              {error}
            </div>
          )}
          {isLoading && <div className="text-sm text-muted-foreground">Loading file...</div>}
          <div className="text-xs text-muted-foreground">
            Supported formats: Project files (.json), Chat history files (.json)
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
