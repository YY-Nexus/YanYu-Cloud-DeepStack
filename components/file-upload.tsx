"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { database } from "@/lib/database"
import { Upload, File, ImageIcon, Code, FileText, Trash2, Download, Eye, AlertCircle, CheckCircle } from "lucide-react"

interface FileUploadProps {
  userId: string
  projectId: string
  acceptedTypes?: string[]
  maxSize?: number // MB
  multiple?: boolean
  onFileUploaded?: (file: any) => void
}

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  content?: string
  uploadProgress: number
  status: "uploading" | "completed" | "error"
  error?: string
}

const FILE_TYPE_ICONS = {
  image: ImageIcon,
  code: Code,
  text: FileText,
  default: File,
}

const getFileIcon = (type: string) => {
  if (type.startsWith("image/")) return FILE_TYPE_ICONS.image
  if (type.includes("javascript") || type.includes("typescript") || type.includes("python")) {
    return FILE_TYPE_ICONS.code
  }
  if (type.startsWith("text/")) return FILE_TYPE_ICONS.text
  return FILE_TYPE_ICONS.default
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

export function FileUpload({
  userId,
  projectId,
  acceptedTypes = ["*"],
  maxSize = 10,
  multiple = true,
  onFileUploaded,
}: FileUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()

  const processFile = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = () => {
        resolve(reader.result as string)
      }

      reader.onerror = () => {
        reject(new Error("文件读取失败"))
      }

      // 根据文件类型选择读取方式
      if (file.type.startsWith("text/") || file.name.endsWith(".md") || file.name.endsWith(".json")) {
        reader.readAsText(file)
      } else {
        reader.readAsDataURL(file)
      }
    })
  }

  const uploadFile = async (file: File) => {
    const fileId = crypto.randomUUID()
    const uploadedFile: UploadedFile = {
      id: fileId,
      name: file.name,
      size: file.size,
      type: file.type,
      uploadProgress: 0,
      status: "uploading",
    }

    setUploadedFiles((prev) => [...prev, uploadedFile])

    try {
      // 模拟上传进度
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise((resolve) => setTimeout(resolve, 100))
        setUploadedFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, uploadProgress: progress } : f)))
      }

      // 读取文件内容
      const content = await processFile(file)

      // 保存到数据库
      const savedFile = await database.saveFile({
        name: file.name,
        content,
        type: file.type,
        size: file.size,
        projectId,
      })

      // 更新状态
      setUploadedFiles((prev) =>
        prev.map((f) => (f.id === fileId ? { ...f, status: "completed", content, uploadProgress: 100 } : f)),
      )

      toast({
        title: "上传成功",
        description: `文件 ${file.name} 上传完成`,
      })

      onFileUploaded?.(savedFile)
    } catch (error) {
      setUploadedFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, status: "error", error: "上传失败" } : f)))

      toast({
        title: "上传失败",
        description: `文件 ${file.name} 上传失败`,
        variant: "destructive",
      })
    }
  }

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setIsUploading(true)

      // 验证文件
      const validFiles = acceptedFiles.filter((file) => {
        if (file.size > maxSize * 1024 * 1024) {
          toast({
            title: "文件过大",
            description: `文件 ${file.name} 超过 ${maxSize}MB 限制`,
            variant: "destructive",
          })
          return false
        }
        return true
      })

      // 并发上传文件
      await Promise.all(validFiles.map(uploadFile))
      setIsUploading(false)
    },
    [maxSize, toast],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple,
    accept: acceptedTypes.includes("*")
      ? undefined
      : acceptedTypes.reduce(
          (acc, type) => {
            acc[type] = []
            return acc
          },
          {} as Record<string, string[]>,
        ),
  })

  const removeFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId))
  }

  const retryUpload = async (fileId: string) => {
    // 这里可以实现重试逻辑
    toast({
      title: "重试功能",
      description: "重试功能正在开发中",
    })
  }

  return (
    <div className="space-y-6">
      {/* 拖拽上传区域 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            文件上传
          </CardTitle>
          <CardDescription>
            支持拖拽上传，最大文件大小 {maxSize}MB
            {acceptedTypes.includes("*") ? "，支持所有文件类型" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            {isDragActive ? (
              <p className="text-lg font-medium">释放文件以开始上传...</p>
            ) : (
              <div>
                <p className="text-lg font-medium mb-2">拖拽文件到此处，或点击选择文件</p>
                <p className="text-sm text-muted-foreground">
                  支持 {acceptedTypes.includes("*") ? "所有格式" : acceptedTypes.join(", ")}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 上传的文件列表 */}
      {uploadedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>上传的文件</CardTitle>
            <CardDescription>管理您上传的文件</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {uploadedFiles.map((file) => {
                const FileIcon = getFileIcon(file.type)

                return (
                  <div key={file.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="flex-shrink-0">
                      <FileIcon className="h-8 w-8 text-muted-foreground" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium truncate">{file.name}</h4>
                        <Badge
                          variant={
                            file.status === "completed"
                              ? "default"
                              : file.status === "error"
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {file.status === "completed" && <CheckCircle className="h-3 w-3 mr-1" />}
                          {file.status === "error" && <AlertCircle className="h-3 w-3 mr-1" />}
                          {file.status === "uploading" && "上传中"}
                          {file.status === "completed" && "已完成"}
                          {file.status === "error" && "失败"}
                        </Badge>
                      </div>

                      <p className="text-sm text-muted-foreground">
                        {formatFileSize(file.size)} • {file.type || "未知类型"}
                      </p>

                      {file.status === "uploading" && (
                        <div className="mt-2">
                          <Progress value={file.uploadProgress} className="h-2" />
                        </div>
                      )}

                      {file.status === "error" && file.error && (
                        <p className="text-sm text-red-600 mt-1">{file.error}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      {file.status === "completed" && (
                        <>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </>
                      )}

                      {file.status === "error" && (
                        <Button variant="outline" size="sm" onClick={() => retryUpload(file.id)}>
                          重试
                        </Button>
                      )}

                      <Button variant="outline" size="sm" onClick={() => removeFile(file.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 上传统计 */}
      {uploadedFiles.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold">{uploadedFiles.filter((f) => f.status === "completed").length}</p>
                <p className="text-sm text-muted-foreground">已完成</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold">{uploadedFiles.filter((f) => f.status === "uploading").length}</p>
                <p className="text-sm text-muted-foreground">上传中</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold">
                  {formatFileSize(
                    uploadedFiles.filter((f) => f.status === "completed").reduce((total, f) => total + f.size, 0),
                  )}
                </p>
                <p className="text-sm text-muted-foreground">总大小</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
