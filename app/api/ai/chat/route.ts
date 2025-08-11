import { type NextRequest, NextResponse } from "next/server"
import { ollamaClient } from "@/lib/ollama-client"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { model, messages, stream = false, options = {} } = body

    // 验证必需参数
    if (!model || !messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "缺少必需参数: model 和 messages" }, { status: 400 })
    }

    // 验证消息格式
    for (const message of messages) {
      if (!message.role || !message.content) {
        return NextResponse.json({ error: "消息格式错误: 每条消息必须包含 role 和 content" }, { status: 400 })
      }
      if (!["user", "assistant", "system"].includes(message.role)) {
        return NextResponse.json({ error: "无效的消息角色: 必须是 user, assistant 或 system" }, { status: 400 })
      }
    }

    if (stream) {
      // 流式响应
      const encoder = new TextEncoder()
      const readable = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of ollamaClient.chatStream({
              model,
              messages,
              options,
            })) {
              const data = `data: ${JSON.stringify(chunk)}\n\n`
              controller.enqueue(encoder.encode(data))

              if (chunk.done) {
                controller.close()
                break
              }
            }
          } catch (error) {
            const errorData = `data: ${JSON.stringify({
              error: error instanceof Error ? error.message : "未知错误",
            })}\n\n`
            controller.enqueue(encoder.encode(errorData))
            controller.close()
          }
        },
      })

      return new Response(readable, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      })
    } else {
      // 普通响应
      const response = await ollamaClient.chat({
        model,
        messages,
        options,
      })

      return NextResponse.json(response)
    }
  } catch (error) {
    console.error("聊天API错误:", error)

    if (error instanceof Error) {
      if (error.message.includes("无法连接")) {
        return NextResponse.json({ error: "Ollama服务不可用，请确保Ollama正在运行" }, { status: 503 })
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ error: "服务器内部错误" }, { status: 500 })
  }
}

export async function GET() {
  try {
    // 健康检查
    const isHealthy = await ollamaClient.checkHealth()

    if (isHealthy) {
      return NextResponse.json({
        status: "healthy",
        message: "Ollama服务正常运行",
      })
    } else {
      return NextResponse.json(
        {
          status: "unhealthy",
          message: "Ollama服务不可用",
        },
        { status: 503 },
      )
    }
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: "健康检查失败",
      },
      { status: 500 },
    )
  }
}
