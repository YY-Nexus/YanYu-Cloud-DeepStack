import { type NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

const UPLOAD_DIR = join(process.cwd(), "uploads")
const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB
const ALLOWED_TYPES = [
  // 图片
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  // 视频
  "video/mp4",
  "video/webm",
  "video/ogg",
  "video/avi",
  "video/mov",
  // 音频
  "audio/mp3",
  "audio/wav",
  "audio/ogg",
  "audio/aac",
  "audio/flac",
  // 3D模型
  "model/gltf+json",
  "model/gltf-binary",
  "application/octet-stream",
  // 代码文件
  "text/javascript",
  "text/typescript",
  "text/html",
  "text/css",
  "application/json",
  "text/xml",
  "application/xml",
  "text/yaml",
  "application/x-yaml",
  // 文档
  "text/plain",
  "text/markdown",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]

interface UploadedFile {
  id: string
  name: string
  originalName: string
  size: number
  type: string
  path: string
  url: string
  uploadedAt: string
  metadata?: Record<string, any>
}

export async function POST(request: NextRequest) {
  try {
    // 确保上传目录存在
    if (!existsSync(UPLOAD_DIR)) {
      await mkdir(UPLOAD_DIR, { recursive: true })
    }

    const formData = await request.formData()
    const files = formData.getAll("files") as File[]

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "没有找到上传的文件" }, { status: 400 })
    }

    const uploadedFiles: UploadedFile[] = []
    const errors: string[] = []

    for (const file of files) {
      try {
        // 验证文件大小
        if (file.size > MAX_FILE_SIZE) {
          errors.push(`文件 ${file.name} 超过大小限制 (${MAX_FILE_SIZE / 1024 / 1024}MB)`)
          continue
        }

        // 验证文件类型
        if (!ALLOWED_TYPES.includes(file.type) && !isAllowedExtension(file.name)) {
          errors.push(`文件 ${file.name} 类型不被支持`)
          continue
        }

        // 生成唯一文件名
        const fileId = generateFileId()
        const extension = getFileExtension(file.name)
        const fileName = `${fileId}${extension}`
        const filePath = join(UPLOAD_DIR, fileName)

        // 保存文件
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        await writeFile(filePath, buffer)

        // 生成文件URL
        const fileUrl = `/api/files/${fileName}`

        // 提取文件元数据
        const metadata = await extractFileMetadata(file, buffer)

        const uploadedFile: UploadedFile = {
          id: fileId,
          name: fileName,
          originalName: file.name,
          size: file.size,
          type: file.type,
          path: filePath,
          url: fileUrl,
          uploadedAt: new Date().toISOString(),
          metadata,
        }

        uploadedFiles.push(uploadedFile)
      } catch (error) {
        console.error(`上传文件 ${file.name} 失败:`, error)
        errors.push(`文件 ${file.name} 上传失败`)
      }
    }

    return NextResponse.json({
      success: true,
      files: uploadedFiles,
      errors: errors.length > 0 ? errors : undefined,
      message: `成功上传 ${uploadedFiles.length} 个文件${errors.length > 0 ? `，${errors.length} 个文件失败` : ""}`,
    })
  } catch (error) {
    console.error("文件上传API错误:", error)
    return NextResponse.json({ error: "文件上传失败" }, { status: 500 })
  }
}

// 获取文件列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const type = searchParams.get("type")

    // 这里应该从数据库获取文件列表
    // 目前返回模拟数据
    const mockFiles: UploadedFile[] = [
      {
        id: "file1",
        name: "example.jpg",
        originalName: "example.jpg",
        size: 1024000,
        type: "image/jpeg",
        path: "/uploads/example.jpg",
        url: "/api/files/example.jpg",
        uploadedAt: new Date().toISOString(),
        metadata: {
          width: 1920,
          height: 1080,
          format: "JPEG",
        },
      },
    ]

    return NextResponse.json({
      files: mockFiles,
      pagination: {
        page,
        limit,
        total: mockFiles.length,
        pages: Math.ceil(mockFiles.length / limit),
      },
    })
  } catch (error) {
    console.error("获取文件列表错误:", error)
    return NextResponse.json({ error: "获取文件列表失败" }, { status: 500 })
  }
}

// 删除文件
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const fileId = searchParams.get("id")

    if (!fileId) {
      return NextResponse.json({ error: "文件ID不能为空" }, { status: 400 })
    }

    // 这里应该从数据库删除文件记录并删除物理文件
    // 目前返回模拟响应
    return NextResponse.json({
      success: true,
      message: "文件删除成功",
    })
  } catch (error) {
    console.error("删除文件错误:", error)
    return NextResponse.json({ error: "删除文件失败" }, { status: 500 })
  }
}

// 辅助函数
function generateFileId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

function getFileExtension(filename: string): string {
  return filename.substring(filename.lastIndexOf("."))
}

function isAllowedExtension(filename: string): boolean {
  const allowedExtensions = [
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".webp",
    ".svg",
    ".mp4",
    ".webm",
    ".ogg",
    ".avi",
    ".mov",
    ".mp3",
    ".wav",
    ".ogg",
    ".aac",
    ".flac",
    ".glb",
    ".gltf",
    ".obj",
    ".fbx",
    ".dae",
    ".js",
    ".ts",
    ".jsx",
    ".tsx",
    ".html",
    ".css",
    ".scss",
    ".json",
    ".xml",
    ".yaml",
    ".yml",
    ".txt",
    ".md",
    ".pdf",
    ".doc",
    ".docx",
  ]

  const extension = getFileExtension(filename).toLowerCase()
  return allowedExtensions.includes(extension)
}

async function extractFileMetadata(file: File, buffer: Buffer): Promise<Record<string, any>> {
  const metadata: Record<string, any> = {
    lastModified: file.lastModified,
    mimeType: file.type,
  }

  // 根据文件类型提取特定元数据
  if (file.type.startsWith("image/")) {
    // 这里可以使用图片处理库提取图片元数据
    // 如 sharp, jimp 等
    metadata.category = "image"
  } else if (file.type.startsWith("video/")) {
    metadata.category = "video"
  } else if (file.type.startsWith("audio/")) {
    metadata.category = "audio"
  } else if (file.name.match(/\.(glb|gltf|obj|fbx|dae)$/i)) {
    metadata.category = "3d-model"
  } else if (file.name.match(/\.(js|ts|jsx|tsx|html|css|json|xml|yaml|yml)$/i)) {
    metadata.category = "code"
  } else {
    metadata.category = "document"
  }

  return metadata
}
