import client from './client'
import type { AuthRequest, AuthResponse } from './types'

export type { AuthRequest, AuthResponse }

export const login = async (data: AuthRequest): Promise<AuthResponse> => {
    const res = await client.post<AuthResponse>('/auth/login', data)
    return res.data
}
