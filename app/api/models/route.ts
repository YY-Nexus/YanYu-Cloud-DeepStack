import { type NextRequest, NextResponse } from "next/server"
import { ollamaClient } from "@/lib/ollama-client"

export async function GET() {
  try {
    const models = await ollamaClient.listModels()
    return NextResponse.json({ models })
  } catch (error) {
    console.error("获取模型列表失败:", error)
    return NextResponse.json({ error: "无法获取模型列表，请确保Ollama服务正在运行" }, { status: 503 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, modelName } = body

    if (!action || !modelName) {
      return NextResponse.json({ error: "缺少必需参数: action 和 modelName" }, { status: 400 })
    }

    switch (action) {
      case "pull":
        // 下载模型 - 这里返回成功状态，实际下载在客户端处理
        return NextResponse.json({
          message: `开始下载模型: ${modelName}`,
          status: "started",
        })

      case "delete":
        await ollamaClient.deleteModel(modelName)
        return NextResponse.json({
          message: `模型 ${modelName} 已删除`,
          status: "deleted",
        })

      default:
        return NextResponse.json({ error: "无效的操作类型" }, { status: 400 })
    }
  } catch (error) {
    console.error("模型操作失败:", error)

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ error: "服务器内部错误" }, { status: 500 })
  }
}
