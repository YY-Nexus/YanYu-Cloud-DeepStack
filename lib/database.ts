"use client"

interface IProject {
  id: string
  name: string
  description: string
  files: IFile[]
  createdAt: Date
  updatedAt: Date
}

interface IFile {
  id: string
  name: string
  content: string
  type: string
  size: number
  projectId: string
  createdAt: Date
  updatedAt: Date
}

interface IChatMessage {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
  projectId?: string
}

class Database {
  private db: IDBDatabase | null = null
  private readonly dbName = "YanYuCloud3DB"
  private readonly version = 1

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version)

      request.onerror = () => {
        reject(new Error("数据库打开失败"))
      }

      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        // 创建项目存储
        if (!db.objectStoreNames.contains("projects")) {
          const projectStore = db.createObjectStore("projects", { keyPath: "id" })
          projectStore.createIndex("name", "name", { unique: false })
          projectStore.createIndex("createdAt", "createdAt", { unique: false })
        }

        // 创建文件存储
        if (!db.objectStoreNames.contains("files")) {
          const fileStore = db.createObjectStore("files", { keyPath: "id" })
          fileStore.createIndex("projectId", "projectId", { unique: false })
          fileStore.createIndex("name", "name", { unique: false })
        }

        // 创建聊天消息存储
        if (!db.objectStoreNames.contains("messages")) {
          const messageStore = db.createObjectStore("messages", { keyPath: "id" })
          messageStore.createIndex("timestamp", "timestamp", { unique: false })
          messageStore.createIndex("projectId", "projectId", { unique: false })
        }
      }
    })
  }

  async createProject(project: Omit<IProject, "id" | "createdAt" | "updatedAt">): Promise<IProject> {
    if (!this.db) throw new Error("数据库未初始化")

    const newProject: IProject = {
      ...project,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["projects"], "readwrite")
      const store = transaction.objectStore("projects")
      const request = store.add(newProject)

      request.onsuccess = () => resolve(newProject)
      request.onerror = () => reject(new Error("项目创建失败"))
    })
  }

  async getProjects(): Promise<IProject[]> {
    if (!this.db) throw new Error("数据库未初始化")

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["projects"], "readonly")
      const store = transaction.objectStore("projects")
      const request = store.getAll()

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(new Error("获取项目列表失败"))
    })
  }

  async saveFile(file: Omit<IFile, "id" | "createdAt" | "updatedAt">): Promise<IFile> {
    if (!this.db) throw new Error("数据库未初始化")

    const newFile: IFile = {
      ...file,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["files"], "readwrite")
      const store = transaction.objectStore("files")
      const request = store.add(newFile)

      request.onsuccess = () => resolve(newFile)
      request.onerror = () => reject(new Error("文件保存失败"))
    })
  }

  async getFilesByProject(projectId: string): Promise<IFile[]> {
    if (!this.db) throw new Error("数据库未初始化")

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["files"], "readonly")
      const store = transaction.objectStore("files")
      const index = store.index("projectId")
      const request = index.getAll(projectId)

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(new Error("获取文件列表失败"))
    })
  }

  async saveChatMessage(message: Omit<IChatMessage, "id">): Promise<IChatMessage> {
    if (!this.db) throw new Error("数据库未初始化")

    const newMessage: IChatMessage = {
      ...message,
      id: crypto.randomUUID(),
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["messages"], "readwrite")
      const store = transaction.objectStore("messages")
      const request = store.add(newMessage)

      request.onsuccess = () => resolve(newMessage)
      request.onerror = () => reject(new Error("消息保存失败"))
    })
  }

  async getChatMessages(projectId?: string): Promise<IChatMessage[]> {
    if (!this.db) throw new Error("数据库未初始化")

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["messages"], "readonly")
      const store = transaction.objectStore("messages")

      if (projectId) {
        const index = store.index("projectId")
        const request = index.getAll(projectId)
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(new Error("获取聊天记录失败"))
      } else {
        const request = store.getAll()
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(new Error("获取聊天记录失败"))
      }
    })
  }

  async getStats() {
    if (!this.db) throw new Error("数据库未初始化")

    const projects = await this.getProjects()
    const messages = await this.getChatMessages()

    let totalFiles = 0
    for (const project of projects) {
      const files = await this.getFilesByProject(project.id)
      totalFiles += files.length
    }

    return {
      totalProjects: projects.length,
      totalFiles,
      totalMessages: messages.length,
    }
  }
}

export const database = new Database()

export async function initDatabase() {
  await database.init()
}

export type { IProject, IFile, IChatMessage }
