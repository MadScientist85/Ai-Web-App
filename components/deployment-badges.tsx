"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Github, Rocket } from "lucide-react"

export function DeploymentBadges() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
      <Button variant="outline" size="sm" asChild>
        <a
          href="https://vercel.com/new/clone?repository-url=https://github.com/yourusername/web-building-genious"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Rocket className="w-4 h-4 mr-2" />
          Deploy to Vercel
          <ExternalLink className="w-3 h-3 ml-1" />
        </a>
      </Button>

      <Button variant="outline" size="sm" asChild>
        <a
          href="https://huggingface.co/spaces/yourusername/web-building-genious"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Rocket className="w-4 h-4 mr-2" />
          Deploy to HF Spaces
          <ExternalLink className="w-3 h-3 ml-1" />
        </a>
      </Button>

      <Button variant="outline" size="sm" asChild>
        <a href="https://github.com/yourusername/web-building-genious" target="_blank" rel="noopener noreferrer">
          <Github className="w-4 h-4 mr-2" />
          Fork on GitHub
          <ExternalLink className="w-3 h-3 ml-1" />
        </a>
      </Button>

      <div className="flex gap-1">
        <Badge variant="secondary">Next.js</Badge>
        <Badge variant="secondary">Supabase</Badge>
        <Badge variant="secondary">AI SDK</Badge>
      </div>
    </div>
  )
}
