import type React from "react"
// Hook相关类型定义

// 异步状态类型
export interface AsyncState<T> {
  data: T | null
  loading: boolean
  error: Error | null
}

// 本地存储Hook类型
export type UseLocalStorageReturn<T> = [T, (value: T | ((val: T) => T)) => void]

// 防抖Hook类型
export type UseDebouncedCallback<T extends (...args: any[]) => any> = T

// 移动设备检测类型
export interface MobileState {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
}

// Toast Hook类型
export interface ToastState {
  toasts: Toast[]
  toast: (props: ToastProps) => void
  dismiss: (toastId?: string) => void
}

export interface Toast {
  id: string
  title?: string
  description?: string
  action?: React.ReactNode
  variant?: "default" | "destructive"
}

export interface ToastProps {
  title?: string
  description?: string
  action?: React.ReactNode
  variant?: "default" | "destructive"
}

// 安全DOM操作类型
export interface SafeDomState {
  isClient: boolean
  isReady: boolean
}

// 表单验证Hook类型
export interface ValidationState<T> {
  values: T
  errors: Record<keyof T, string[]>
  isValid: boolean
  isDirty: boolean
}

export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: any) => boolean | string
}

// API请求Hook类型
export interface ApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
  refetch: () => void
}

// 文件上传Hook类型
export interface FileUploadState {
  files: File[]
  uploading: boolean
  progress: number
  error: string | null
  uploadedFiles: UploadedFile[]
}

export interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  url: string
  uploadedAt: Date
}

// 主题Hook类型
export interface ThemeState {
  theme: "light" | "dark" | "system"
  resolvedTheme: "light" | "dark"
  setTheme: (theme: "light" | "dark" | "system") => void
}

// 搜索Hook类型
export interface SearchState<T> {
  query: string
  results: T[]
  loading: boolean
  setQuery: (query: string) => void
  clearResults: () => void
}

// 分页Hook类型
export interface PaginationState {
  currentPage: number
  totalPages: number
  pageSize: number
  totalItems: number
  hasNextPage: boolean
  hasPreviousPage: boolean
  goToPage: (page: number) => void
  nextPage: () => void
  previousPage: () => void
  setPageSize: (size: number) => void
}

// 排序Hook类型
export interface SortState<T> {
  sortBy: keyof T | null
  sortOrder: "asc" | "desc"
  sortedData: T[]
  setSortBy: (key: keyof T) => void
  setSortOrder: (order: "asc" | "desc") => void
  toggleSort: (key: keyof T) => void
}

// 筛选Hook类型
export interface FilterState<T> {
  filters: Record<string, any>
  filteredData: T[]
  setFilter: (key: string, value: any) => void
  removeFilter: (key: string) => void
  clearFilters: () => void
}
