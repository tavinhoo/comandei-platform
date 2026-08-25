import client from './client'
import type { RevenueResponse } from './types'

export type { RevenueResponse }

export const getRevenue = async (from?: string, to?: string): Promise<RevenueResponse> => {
    const params: Record<string, string> = {}
    if (from) params.from = from
    if (to) params.to = to
    const res = await client.get<RevenueResponse>('/api/relatorios/faturamento', { params })
    return res.data
}
