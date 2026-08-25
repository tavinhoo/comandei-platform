export type OrderStatus = 'PENDING' | 'PREPARING' | 'READY' | 'DELIVERED' | 'CANCELED'

const config: Record<OrderStatus, { label: string; color: string; bg: string; border: string }> = {
    PENDING: { label: 'Pendente', color: 'var(--color-primary)', bg: 'var(--color-primary-glow)', border: 'rgba(249,115,22,0.25)' },
    PREPARING: { label: 'Preparando', color: 'var(--color-amber)', bg: 'var(--color-amber-bg)', border: 'rgba(245,158,11,0.25)' },
    READY: { label: 'Pronto', color: 'var(--color-emerald)', bg: 'var(--color-emerald-bg)', border: 'rgba(16,185,129,0.25)' },
    DELIVERED: { label: 'Entregue', color: 'var(--color-blue)', bg: 'var(--color-blue-bg)', border: 'rgba(59,130,246,0.25)' },
    CANCELED: { label: 'Cancelado', color: 'var(--color-gray)', bg: 'var(--color-gray-bg)', border: 'rgba(107,114,128,0.25)' },
}

export function OrderStatusBadge({ status }: { status: string }) {
    const s = config[status as OrderStatus] ?? config.PENDING
    return (
        <span
            className="badge"
            style={{ color: s.color, background: s.bg, border: `1px solid ${s.border}` }}
        >
            {s.label}
        </span>
    )
}
