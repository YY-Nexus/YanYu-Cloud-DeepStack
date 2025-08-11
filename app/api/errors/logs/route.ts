import { type NextRequest, NextResponse } from "next/server"
import { errorLogger } from "@/lib/error-logger"
import type { ErrorType, ErrorSeverity } from "@/lib/error-handler"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const options = {
      startTime: searchParams.get("startTime") ? Number.parseInt(searchParams.get("startTime")!) : undefined,
      endTime: searchParams.get("endTime") ? Number.parseInt(searchParams.get("endTime")!) : undefined,
      type: searchParams.get("type") as ErrorType | undefined,
      severity: searchParams.get("severity") as ErrorSeverity | undefined,
      limit: searchParams.get("limit") ? Number.parseInt(searchParams.get("limit")!) : 50,
      offset: searchParams.get("offset") ? Number.parseInt(searchParams.get("offset")!) : 0,
    }

    const logs = errorLogger.getAllErrorLogs(options)

    return NextResponse.json({
      logs,
      total: logs.length,
      options,
    })
  } catch (error) {
    console.error("获取错误日志失败:", error)
    return NextResponse.json({ error: "获取错误日志失败" }, { status: 500 })
  }
}
