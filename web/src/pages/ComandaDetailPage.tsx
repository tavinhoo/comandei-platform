import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Plus, CheckCircle, Loader2, Clock, User, UserCheck, DollarSign, ChevronDown, XCircle } from 'lucide-react'
import { getCommand, closeCommand, cancelCommand, addOrders } from '../api/commands'
import { listMenuItems } from '../api/menu'
import { updateOrderStatus, type OrderStatus } from '../api/orders'
import { fmtBRL } from '../api/currency'
import { toast } from 'sonner'
import { OrderStatusBadge } from '../components/OrderStatusBadge'
import { AddOrderModal } from '../components/AddOrderModal'
import { ConfirmModal } from '../components/ConfirmModal'
import './ComandaDetailPage.css'

const ORDER_STATUSES: OrderStatus[] = ['PENDING', 'PREPARING', 'READY', 'DELIVERED', 'CANCELED']
const STATUS_LABELS: Record<OrderStatus, string> = {
    PENDING: 'Pendente', PREPARING: 'Preparando', READY: 'Pronto',
    DELIVERED: 'Entregue', CANCELED: 'Cancelado',
}

function fmt(dt: string | null) {
    if (!dt) return '—'
    return new Date(dt).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
}

type ConfirmAction = 'close' | 'cancel' | null

export function ComandaDetailPage() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const qc = useQueryClient()
    const [showOrderModal, setShowOrderModal] = useState(false)
    const [actionLoading, setActionLoading] = useState(false)
    const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(null)
    const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null)

    const { data: cmd, isLoading } = useQuery({
        queryKey: ['command', id],
        queryFn: () => getCommand(Number(id)),
        refetchInterval: 10000,
    })

    const { data: menuItems = [] } = useQuery({
        queryKey: ['menu'],
        queryFn: listMenuItems,
    })

    const handleClose = async () => {
        if (!cmd) return
        setActionLoading(true)
        try {
            await closeCommand(cmd.id)
            qc.invalidateQueries({ queryKey: ['commands'] })
            toast.success(`Comanda da Mesa ${cmd.tableNumber} fechada!`)
            navigate('/comandas')
        } finally {
            setActionLoading(false)
            setConfirmAction(null)
        }
    }

    const handleCancel = async () => {
        if (!cmd) return
        setActionLoading(true)
        try {
            await cancelCommand(cmd.id)
            qc.invalidateQueries({ queryKey: ['commands'] })
            toast.success(`Comanda da Mesa ${cmd.tableNumber} cancelada.`)
            navigate('/comandas')
        } finally {
            setActionLoading(false)
            setConfirmAction(null)
        }
    }

    const handleAddOrders = async (orders: { menuItemId: number; quantity: number }[]) => {
        await addOrders(Number(id), orders)
        qc.invalidateQueries({ queryKey: ['command', id] })
        qc.invalidateQueries({ queryKey: ['commands'] })
    }

    const handleStatusChange = async (orderId: number, status: OrderStatus) => {
        setUpdatingOrderId(orderId)
        try {
            await updateOrderStatus(orderId, status)
            qc.invalidateQueries({ queryKey: ['command', id] })
        } finally {
            setUpdatingOrderId(null)
        }
    }

    if (isLoading) {
        return (
            <div className="loading-screen" style={{ height: 400 }}>
                <Loader2 size={32} className="spin" />
            </div>
        )
    }

    if (!cmd) return <div className="empty-state"><p>Comanda não encontrada.</p></div>

    const isOpen = cmd.status === 'OPEN'

    return (
        <div>
            {/* Header */}
            <div className="page-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)}>
                        <ArrowLeft size={16} />
                    </button>
                    <div>
                        <h1 className="page-title">Mesa {cmd.tableNumber}</h1>
                        <p className="page-subtitle">
                            Comanda #{cmd.id}
                            {cmd.customerName && <> &middot; {cmd.customerName}</>}
                        </p>
                    </div>
                </div>
                {isOpen && (
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button className="btn btn-secondary" onClick={() => setShowOrderModal(true)}>
                            <Plus size={16} /> Adicionar Pedidos
                        </button>
                        <button className="btn btn-ghost" onClick={() => setConfirmAction('cancel')}
                            style={{ color: 'var(--color-red)', border: '1px solid rgba(239,68,68,0.2)' }}>
                            <XCircle size={16} /> Cancelar
                        </button>
                        <button className="btn btn-danger" onClick={() => setConfirmAction('close')}>
                            <CheckCircle size={16} /> Fechar Comanda
                        </button>
                    </div>
                )}
            </div>

            {/* Info cards */}
            <div className="stats-grid" style={{ marginBottom: '2rem' }}>
                <div className="stat-card">
                    <div className="stat-label">Status</div>
                    <div style={{ marginTop: '0.5rem' }}>
                        <span className="badge" style={
                            cmd.status === 'OPEN'
                                ? { color: 'var(--color-emerald)', background: 'var(--color-emerald-bg)', border: '1px solid rgba(16,185,129,0.25)' }
                                : { color: 'var(--color-gray)', background: 'var(--color-gray-bg)', border: '1px solid rgba(107,114,128,0.25)' }
                        }>
                            {cmd.status === 'OPEN' ? 'Aberta' : cmd.status === 'CLOSED' ? 'Fechada' : 'Cancelada'}
                        </span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-label"><UserCheck size={12} style={{ display: 'inline', marginRight: 4 }} />Cliente</div>
                    <div className="stat-value" style={{ fontSize: '1.1rem', marginTop: '0.4rem' }}>
                        {cmd.customerName ?? '—'}
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-label"><User size={12} style={{ display: 'inline', marginRight: 4 }} />Atendente</div>
                    <div className="stat-value" style={{ fontSize: '1.1rem', marginTop: '0.4rem' }}>
                        {cmd.responsibleEmployee?.name ?? '—'}
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-label"><Clock size={12} style={{ display: 'inline', marginRight: 4 }} />Abertura</div>
                    <div style={{ fontWeight: 700, marginTop: '0.4rem', fontSize: '0.95rem' }}>{fmt(cmd.openTime)}</div>
                </div>

                <div className="stat-card">
                    <div className="stat-label"><DollarSign size={12} style={{ display: 'inline', marginRight: 4 }} />Total</div>
                    <div className="stat-value" style={{ color: 'var(--color-emerald)', fontSize: '1.5rem', marginTop: '0.25rem' }}>
                        {fmtBRL(cmd.totalValue)}
                    </div>
                </div>
            </div>

            {/* Orders */}
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>
                Pedidos ({cmd.orders?.length ?? 0})
            </h2>

            {!cmd.orders || cmd.orders.length === 0 ? (
                <div className="empty-state" style={{ padding: '3rem' }}>
                    <div className="empty-state-icon">🛒</div>
                    <p className="empty-state-text">Nenhum pedido ainda. Clique em "Adicionar Pedidos".</p>
                </div>
            ) : (
                <div className="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Item</th>
                                <th>Qtd</th>
                                <th>Hora</th>
                                <th>Status</th>
                                {isOpen && <th>Ação</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {cmd.orders.map((order) => (
                                <tr key={order.id}>
                                    <td style={{ color: 'var(--text-muted)', fontWeight: 500 }}>#{order.id}</td>
                                    <td style={{ fontWeight: 600 }}>{order.menuItem?.name ?? `Item ${order.menuItem?.id}`}</td>
                                    <td>
                                        <span className="badge" style={{ background: 'var(--color-surface-2)', color: 'var(--text-secondary)', border: '1px solid var(--color-border)' }}>
                                            x{order.quantity}
                                        </span>
                                    </td>
                                    <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                        {fmt(order.orderTime)}
                                    </td>
                                    <td><OrderStatusBadge status={order.status} /></td>
                                    {isOpen && (
                                        <td>
                                            <div className="order-status-select">
                                                {updatingOrderId === order.id
                                                    ? <Loader2 size={16} className="spin" />
                                                    : (
                                                        <div className="select-wrapper">
                                                            <select
                                                                className="form-select"
                                                                style={{ padding: '0.3rem 2rem 0.3rem 0.6rem', fontSize: '0.78rem', width: 'auto' }}
                                                                value={order.status}
                                                                onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                                                            >
                                                                {ORDER_STATUSES.map((s) => (
                                                                    <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                                                                ))}
                                                            </select>
                                                            <ChevronDown size={12} className="select-icon" />
                                                        </div>
                                                    )}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {showOrderModal && (
                <AddOrderModal
                    commandId={cmd.id}
                    menuItems={menuItems}
                    onConfirm={handleAddOrders}
                    onClose={() => setShowOrderModal(false)}
                />
            )}

            {confirmAction === 'close' && (
                <ConfirmModal
                    title="Fechar Comanda"
                    message={`Deseja fechar a comanda da Mesa ${cmd.tableNumber}? O valor total é ${fmtBRL(cmd.totalValue)}.`}
                    confirmLabel="Fechar Comanda"
                    loading={actionLoading}
                    onConfirm={handleClose}
                    onClose={() => setConfirmAction(null)}
                />
            )}

            {confirmAction === 'cancel' && (
                <ConfirmModal
                    title="Cancelar Comanda"
                    message={`Tem certeza que deseja cancelar a comanda da Mesa ${cmd.tableNumber}? Esta ação não pode ser desfeita.`}
                    confirmLabel="Cancelar Comanda"
                    loading={actionLoading}
                    onConfirm={handleCancel}
                    onClose={() => setConfirmAction(null)}
                />
            )}
        </div>
    )
}
