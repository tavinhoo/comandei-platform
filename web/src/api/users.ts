import client from './client'
import type { Role, UserSummary, UserRequest } from './types'

export type { Role, UserSummary, UserRequest }

export const listUsers = async (): Promise<UserSummary[]> => {
    const res = await client.get<UserSummary[]>('/api/users')
    return res.data
}

export const createUser = async (data: UserRequest): Promise<UserSummary> => {
    const res = await client.post<UserSummary>('/api/users', data)
    return res.data
}

export const deleteUser = async (id: number): Promise<void> => {
    await client.delete(`/api/users/${id}`)
}
