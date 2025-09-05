"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import type { User } from "@supabase/supabase-js"

interface ChatMessage {
  role: "user" | "assistant"
  content: string
  provider?: string
  model?: string
}

export default function HomePage() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [generatedCode, setGeneratedCode] = useState({
    html: "",
    css: "",
    js: "",
  })

  useEffect(() => {
    const supabase = createClient()

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: ChatMessage = {
      role: "user",
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          systemPrompt: `You are an AI web generator. Generate complete HTML, CSS, and JavaScript code for websites and web applications. Always provide working, production-ready code that can be immediately deployed.`,
        }),
      })

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: data.content,
        provider: data.provider,
        model: data.model,
      }

      setMessages((prev) => [...prev, assistantMessage])

      // Extract code from response if present
      extractCodeFromResponse(data.content)
    } catch (error) {
      console.error("Chat error:", error)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const extractCodeFromResponse = (content: string) => {
    const htmlMatch = content.match(/```html\n([\s\S]*?)\n```/)
    const cssMatch = content.match(/```css\n([\s\S]*?)\n```/)
    const jsMatch = content.match(/```(?:javascript|js)\n([\s\S]*?)\n```/)

    if (htmlMatch || cssMatch || jsMatch) {
      setGeneratedCode({
        html: htmlMatch?.[1] || "",
        css: cssMatch?.[1] || "",
        js: jsMatch?.[1] || "",
      })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-2xl font-bold">WEB.BUILDING.GENIOUS</h1>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-sm text-muted-foreground">Welcome, {user.email}</span>
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/auth/login">Login</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/auth/sign-up">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto p-4">
        <div className="mb-6 text-center">
          <p className="text-muted-foreground">AI-Powered Web Application Generator</p>
          {!user && (
            <p className="text-sm text-muted-foreground mt-2">
              <Link href="/auth/login" className="underline">
                Sign in
              </Link>{" "}
              to save your projects and chat history
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chat Interface */}
          <Card className="h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle>AI Chat Interface</CardTitle>
              <CardDescription>Describe what you want to build and I'll generate the code</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <ScrollArea className="flex-1 mb-4">
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                        }`}
                      >
                        <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                        {message.provider && (
                          <div className="mt-2">
                            <Badge variant="outline" className="text-xs">
                              {message.provider} • {message.model}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-muted p-3 rounded-lg">
                        <div className="text-sm">Generating response...</div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              <form onSubmit={handleSubmit} className="space-y-2">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Describe the website or app you want to build..."
                  className="min-h-[80px]"
                />
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? "Generating..." : "Generate Code"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Code Preview */}
          <Card className="h-[600px]">
            <CardHeader>
              <CardTitle>Live Code Preview</CardTitle>
              <CardDescription>Generated HTML, CSS, and JavaScript</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="preview" className="h-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                  <TabsTrigger value="html">HTML</TabsTrigger>
                  <TabsTrigger value="css">CSS</TabsTrigger>
                  <TabsTrigger value="js">JavaScript</TabsTrigger>
                </TabsList>

                <TabsContent value="preview" className="h-[480px]">
                  <div className="w-full h-full border rounded-md">
                    {generatedCode.html ? (
                      <iframe
                        srcDoc={`
                          <!DOCTYPE html>
                          <html>
                            <head>
                              <style>${generatedCode.css}</style>
                            </head>
                            <body>
                              ${generatedCode.html}
                              <script>${generatedCode.js}</script>
                            </body>
                          </html>
                        `}
                        className="w-full h-full"
                        title="Generated Website Preview"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        Generated code will appear here
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="html" className="h-[480px]">
                  <ScrollArea className="h-full">
                    <pre className="text-sm bg-muted p-4 rounded-md">
                      <code>{generatedCode.html || "// HTML code will appear here"}</code>
                    </pre>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="css" className="h-[480px]">
                  <ScrollArea className="h-full">
                    <pre className="text-sm bg-muted p-4 rounded-md">
                      <code>{generatedCode.css || "/* CSS code will appear here */"}</code>
                    </pre>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="js" className="h-[480px]">
                  <ScrollArea className="h-full">
                    <pre className="text-sm bg-muted p-4 rounded-md">
                      <code>{generatedCode.js || "// JavaScript code will appear here"}</code>
                    </pre>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
