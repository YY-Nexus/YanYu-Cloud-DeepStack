"use client"

import { useCallback } from "react"

import { useState } from "react"

import { createParser, type ParsedEvent, type ReconnectInterval } from "eventsource-parser"

export interface StreamOptions {
  onToken?: (token: string) => void
  onStart?: () => void
  onCompletion?: (completion: string) => void
  onError?: (error: Error) => void
}

export class AIStreamHandler {
  private decoder = new TextDecoder()
  private completion = ""

  constructor(private options: StreamOptions = {}) {}

  async handleStream(response: Response): Promise<string> {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const reader = response.body?.getReader()
    if (!reader) {
      throw new Error("无法获取响应流")
    }

    this.options.onStart?.()

    try {
      const parser = createParser((event: ParsedEvent | ReconnectInterval) => {
        if (event.type === "event") {
          const data = event.data

          if (data === "[DONE]") {
            this.options.onCompletion?.(this.completion)
            return
          }

          try {
            const parsed = JSON.parse(data)
            const token = parsed.choices?.[0]?.delta?.content || ""

            if (token) {
              this.completion += token
              this.options.onToken?.(token)
            }
          } catch (error) {
            console.warn("解析流数据失败:", error)
          }
        }
      })

      while (true) {
        const { done, value } = await reader.read()

        if (done) {
          break
        }

        const chunk = this.decoder.decode(value, { stream: true })
        parser.feed(chunk)
      }

      return this.completion
    } catch (error) {
      this.options.onError?.(error as Error)
      throw error
    } finally {
      reader.releaseLock()
    }
  }
}

// 创建流式AI聊天
export async function createAIStream(
  messages: Array<{ role: string; content: string }>,
  options: {
    model?: string
    temperature?: number
    maxTokens?: number
    onToken?: (token: string) => void
    onStart?: () => void
    onCompletion?: (completion: string) => void
    onError?: (error: Error) => void
  } = {},
): Promise<string> {
  const { model = "gpt-4", temperature = 0.7, maxTokens = 4096, ...streamOptions } = options

  const response = await fetch("/api/ai/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages,
      model,
      temperature,
      maxTokens,
      stream: true,
    }),
  })

  const streamHandler = new AIStreamHandler(streamOptions)
  return await streamHandler.handleStream(response)
}

// React Hook for AI streaming
export function useAIStream() {
  const [isLoading, setIsLoading] = useState(false)
  const [completion, setCompletion] = useState("")
  const [error, setError] = useState<Error | null>(null)

  const streamChat = useCallback(
    async (
      messages: Array<{ role: string; content: string }>,
      options: {
        model?: string
        temperature?: number
        maxTokens?: number
        onToken?: (token: string) => void
      } = {},
    ) => {
      setIsLoading(true)
      setError(null)
      setCompletion("")

      try {
        await createAIStream(messages, {
          ...options,
          onStart: () => {
            setCompletion("")
          },
          onToken: (token) => {
            setCompletion((prev) => prev + token)
            options.onToken?.(token)
          },
          onCompletion: (finalCompletion) => {
            setCompletion(finalCompletion)
            setIsLoading(false)
          },
          onError: (err) => {
            setError(err)
            setIsLoading(false)
          },
        })
      } catch (err) {
        setError(err as Error)
        setIsLoading(false)
      }
    },
    [],
  )

  return {
    streamChat,
    completion,
    isLoading,
    error,
  }
}
