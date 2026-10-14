import { apiClient } from './client'

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  refresh_token?: string
}

export const authApi = {
  login(payload: LoginRequest) {
    // POST to /api/login_check (baseURL handles /api prefix)
    return apiClient.post<LoginResponse>('login_check', payload)
  },
  register(payload: { username: string; email?: string; password: string }) {
    // POST to /api/register
    return apiClient.post<LoginResponse>('register', payload)
  },
}
