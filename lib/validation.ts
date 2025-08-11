// 表单验证工具函数

export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: any) => boolean | string
}

export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

// 验证单个字段
export function validateField(value: any, rules: ValidationRule): ValidationResult {
  const errors: string[] = []

  // 必填验证
  if (rules.required && (!value || value.toString().trim() === "")) {
    errors.push("此字段为必填项")
  }

  // 如果值为空且不是必填，则跳过其他验证
  if (!value && !rules.required) {
    return { isValid: true, errors: [] }
  }

  const stringValue = value?.toString() || ""

  // 最小长度验证
  if (rules.minLength && stringValue.length < rules.minLength) {
    errors.push(`最少需要${rules.minLength}个字符`)
  }

  // 最大长度验证
  if (rules.maxLength && stringValue.length > rules.maxLength) {
    errors.push(`最多允许${rules.maxLength}个字符`)
  }

  // 正则表达式验证
  if (rules.pattern && !rules.pattern.test(stringValue)) {
    errors.push("格式不正确")
  }

  // 自定义验证
  if (rules.custom) {
    const customResult = rules.custom(value)
    if (typeof customResult === "string") {
      errors.push(customResult)
    } else if (!customResult) {
      errors.push("验证失败")
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

// 验证表单对象
export function validateForm(
  data: Record<string, any>,
  rules: Record<string, ValidationRule>,
): Record<string, ValidationResult> {
  const results: Record<string, ValidationResult> = {}

  for (const [field, fieldRules] of Object.entries(rules)) {
    results[field] = validateField(data[field], fieldRules)
  }

  return results
}

// 检查表单是否有效
export function isFormValid(validationResults: Record<string, ValidationResult>): boolean {
  return Object.values(validationResults).every((result) => result.isValid)
}

// 预定义验证规则
export const commonRules = {
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    custom: (value: string) => {
      if (!value) return true
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || "请输入有效的邮箱地址"
    },
  },
  phone: {
    pattern: /^1[3-9]\d{9}$/,
    custom: (value: string) => {
      if (!value) return true
      return /^1[3-9]\d{9}$/.test(value) || "请输入有效的手机号码"
    },
  },
  password: {
    minLength: 6,
    custom: (value: string) => {
      if (!value) return true
      if (value.length < 6) return "密码至少需要6位字符"
      if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
        return "密码需要包含大小写字母和数字"
      }
      return true
    },
  },
  url: {
    pattern: /^https?:\/\/.+/,
    custom: (value: string) => {
      if (!value) return true
      try {
        new URL(value)
        return true
      } catch {
        return "请输入有效的URL地址"
      }
    },
  },
  number: {
    custom: (value: any) => {
      if (value === "" || value === null || value === undefined) return true
      return !isNaN(Number(value)) || "请输入有效的数字"
    },
  },
  positiveNumber: {
    custom: (value: any) => {
      if (value === "" || value === null || value === undefined) return true
      const num = Number(value)
      return (!isNaN(num) && num > 0) || "请输入大于0的数字"
    },
  },
}

// 文件验证
export interface FileValidationRule {
  maxSize?: number // 字节
  allowedTypes?: string[]
  maxFiles?: number
}

export function validateFiles(files: FileList | File[], rules: FileValidationRule): ValidationResult {
  const errors: string[] = []
  const fileArray = Array.from(files)

  // 文件数量验证
  if (rules.maxFiles && fileArray.length > rules.maxFiles) {
    errors.push(`最多只能上传${rules.maxFiles}个文件`)
  }

  // 逐个文件验证
  for (const file of fileArray) {
    // 文件大小验证
    if (rules.maxSize && file.size > rules.maxSize) {
      errors.push(`文件"${file.name}"超过大小限制`)
    }

    // 文件类型验证
    if (rules.allowedTypes && !rules.allowedTypes.includes(file.type)) {
      errors.push(`文件"${file.name}"类型不支持`)
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

// 实时验证Hook使用的验证函数
export function createValidator(rules: Record<string, ValidationRule>) {
  return (data: Record<string, any>) => {
    return validateForm(data, rules)
  }
}
