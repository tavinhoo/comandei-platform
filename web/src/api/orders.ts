import client from './client'
import type { OrderStatus } from './types'

export type { OrderStatus }

export const updateOrderStatus = async (id: number, status: OrderStatus): Promise<void> => {
    await client.put(`/api/pedidos/${id}/status`, { status })
}
