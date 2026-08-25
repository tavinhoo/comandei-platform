import client from './client'
import type { MenuItem, MenuItemRequest } from './types'

export type { MenuItem, MenuItemRequest }

export const listMenuItems = async (): Promise<MenuItem[]> => {
    const res = await client.get<MenuItem[]>('/api/cardapio')
    return res.data
}

export const getMenuItem = async (id: number): Promise<MenuItem> => {
    const res = await client.get<MenuItem>(`/api/cardapio/${id}`)
    return res.data
}

export const createMenuItem = async (data: MenuItemRequest): Promise<MenuItem> => {
    const res = await client.post<MenuItem>('/api/cardapio', data)
    return res.data
}

export const updateMenuItem = async (id: number, data: MenuItemRequest): Promise<MenuItem> => {
    const res = await client.put<MenuItem>(`/api/cardapio/${id}`, data)
    return res.data
}

export const deactivateMenuItem = async (id: number): Promise<void> => {
    await client.delete(`/api/cardapio/${id}`)
}
