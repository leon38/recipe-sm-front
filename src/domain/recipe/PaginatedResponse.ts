export interface Pagination {
  page: number
  perPage: number
  total: number
}

export interface PaginatedResponse<T> {
  items: T[]
  pagination: Pagination
}