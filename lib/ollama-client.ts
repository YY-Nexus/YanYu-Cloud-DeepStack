"use client"

interface OllamaModel {
  name: string
  size: number
  digest: string
  modified_at: string
}

interface OllamaResponse {
  model: string
  created_at: string
  response: string
  done: boolean
}

interface ChatMessage {
  role: "user" | "assistant" | "system"
  content: string
}

class OllamaClient {
  private baseUrl: string

  constructor(baseUrl: string = process.env.NEXT_PUBLIC_OLLAMA_URL || "http://localhost:11434") {
    this.baseUrl = baseUrl
  }

  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`)
      return response.ok
    } catch (error) {
      console.error("Ollama健康检查失败:", error)
      return false
    }
  }

  async listModels(): Promise<OllamaModel[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`)
      if (!response.ok) {
        throw new Error("获取模型列表失败")
      }
      const data = await response.json()
      return data.models || []
    } catch (error) {
      console.error("获取模型列表失败:", error)
      return []
    }
  }

  async pullModel(modelName: string, onProgress?: (progress: number) => void): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/api/pull`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: modelName }),
      })

      if (!response.ok) {
        throw new Error("模型下载失败")
      }

      const reader = response.body?.getReader()
      if (!reader) return

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const text = new TextDecoder().decode(value)
        const lines = text.split("\n").filter(Boolean)

        for (const line of lines) {
          try {
            const data = JSON.parse(line)
            if (data.total && data.completed && onProgress) {
              const progress = (data.completed / data.total) * 100
              onProgress(progress)
            }
          } catch (e) {
            // 忽略JSON解析错误
          }
        }
      }
    } catch (error) {
      console.error("模型下载失败:", error)
      throw error
    }
  }

  async deleteModel(modelName: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/api/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: modelName }),
      })

      if (!response.ok) {
        throw new Error("模型删除失败")
      }
    } catch (error) {
      console.error("模型删除失败:", error)
      throw error
    }
  }

  async chat(model: string, messages: ChatMessage[], onStream?: (response: string) => void): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages,
          stream: !!onStream,
        }),
      })

      if (!response.ok) {
        throw new Error("聊天请求失败")
      }

      if (onStream) {
        const reader = response.body?.getReader()
        if (!reader) return ""

        let fullResponse = ""
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const text = new TextDecoder().decode(value)
          const lines = text.split("\n").filter(Boolean)

          for (const line of lines) {
            try {
              const data: OllamaResponse = JSON.parse(line)
              if (data.response) {
                fullResponse += data.response
                onStream(data.response)
              }
            } catch (e) {
              // 忽略JSON解析错误
            }
          }
        }
        return fullResponse
      } else {
        const data: OllamaResponse = await response.json()
        return data.response
      }
    } catch (error) {
      console.error("聊天失败:", error)
      throw error
    }
  }

  async generate(model: string, prompt: string, onStream?: (response: string) => void): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          prompt,
          stream: !!onStream,
        }),
      })

      if (!response.ok) {
        throw new Error("生成请求失败")
      }

      if (onStream) {
        const reader = response.body?.getReader()
        if (!reader) return ""

        let fullResponse = ""
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const text = new TextDecoder().decode(value)
          const lines = text.split("\n").filter(Boolean)

          for (const line of lines) {
            try {
              const data: OllamaResponse = JSON.parse(line)
              if (data.response) {
                fullResponse += data.response
                onStream(data.response)
              }
            } catch (e) {
              // 忽略JSON解析错误
            }
          }
        }
        return fullResponse
      } else {
        const data: OllamaResponse = await response.json()
        return data.response
      }
    } catch (error) {
      console.error("生成失败:", error)
      throw error
    }
  }
}

export const ollamaClient = new OllamaClient()
export type { OllamaModel, ChatMessage }
