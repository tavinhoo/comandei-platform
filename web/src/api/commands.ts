import client from './client'
import type {
    CommandStatus,
    CommandDto,
    CommandDetail,
    CommandRequest,
    OrderRequest,
} from './types'

export type { CommandStatus, CommandDto, CommandDetail, CommandRequest, OrderRequest }
export type { OrderInfo as OrderInCommand } from './types'

export const listCommands = async (status: CommandStatus = 'OPEN'): Promise<CommandDto[]> => {
    const res = await client.get<CommandDto[]>('/api/comandas', { params: { status } })
    return res.data
}

export const getCommand = async (id: number): Promise<CommandDetail> => {
    const res = await client.get<CommandDetail>(`/api/comandas/${id}`)
    return res.data
}

export const openCommand = async (data: CommandRequest): Promise<CommandDetail> => {
    const res = await client.post<CommandDetail>('/api/comandas', data)
    return res.data
}

export const closeCommand = async (id: number): Promise<CommandDetail> => {
    const res = await client.put<CommandDetail>(`/api/comandas/${id}/fechar`)
    return res.data
}

export const cancelCommand = async (id: number): Promise<void> => {
    await client.put(`/api/comandas/${id}/cancelar`)
}

export const addOrders = async (id: number, orders: OrderRequest[]): Promise<void> => {
    await client.post(`/api/comandas/${id}/pedidos`, orders)
}

export const listHistory = async (): Promise<CommandDto[]> => {
    const res = await client.get<CommandDto[]>('/api/comandas/historico')
    return res.data
}

export const clearHistory = async (): Promise<void> => {
    await client.delete('/api/comandas/historico')
}
