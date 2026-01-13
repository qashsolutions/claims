export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: ApiError
}

export interface ApiError {
  code: string
  message: string
  details?: Record<string, unknown>
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

export interface PaginationParams {
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export type UserRole = 'PROVIDER' | 'BILLING_STAFF' | 'ADMIN'

export interface User {
  id: string
  email: string
  role: UserRole
  practiceId: string
  mfaEnabled: boolean
  epicUserId?: string
  lastLoginAt?: Date
  createdAt: Date
}
