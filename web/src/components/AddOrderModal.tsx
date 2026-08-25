import { useState } from 'react'
import { X, Minus, Plus, ShoppingCart, Loader2, Search } from 'lucide-react'
import type { MenuItem } from '../api/menu'
import { fmtBRL } from '../api/currency'
import './AddOrderModal.css'

interface Props {
    commandId: number
    menuItems: MenuItem[]
    onConfirm: (orders: { menuItemId: number; quantity: number }[]) => Promise<void>
    onClose: () => void
}

export function AddOrderModal({ menuItems, onConfirm, onClose }: Props) {
    const [quantities, setQuantities] = useState<Record<number, number>>({})
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState('')

    const change = (id: number, delta: number) => {
        setQuantities((prev) => {
            const next = (prev[id] ?? 0) + delta
            if (next <= 0) {
                const { [id]: _, ...rest } = prev
                return rest
            }
            return { ...prev, [id]: next }
        })
    }

    const filtered = menuItems.filter(
        (item) =>
            item.name.toLowerCase().includes(search.toLowerCase()) ||
            (item.description ?? '').toLowerCase().includes(search.toLowerCase())
    )

    const total = menuItems.reduce(
        (sum, item) => sum + item.price * (quantities[item.id] ?? 0),
        0
    )

    const itemCount = Object.values(quantities).reduce((a, b) => a + b, 0)

    const handleConfirm = async () => {
        const orders = Object.entries(quantities)
            .filter(([, qty]) => qty > 0)
            .map(([id, qty]) => ({ menuItemId: Number(id), quantity: qty }))
        if (orders.length === 0) return
        setLoading(true)
        try {
            await onConfirm(orders)
            onClose()
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="modal-box add-order-modal">
                {/* Header */}
                <div className="modal-header">
                    <div>
                        <h2 className="modal-title">Adicionar Pedidos</h2>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                            Selecione os itens e a quantidade desejada
                        </p>
                    </div>
                    <button className="btn btn-ghost btn-sm" onClick={onClose}>
                        <X size={18} />
                    </button>
                </div>

                {/* Search */}
                <div className="add-order-search">
                    <Search size={15} className="add-order-search-icon" />
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Buscar no cardápio..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ paddingLeft: '2.25rem' }}
                    />
                </div>

                {/* Item list */}
                <div className="add-order-list">
                    {filtered.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                            Nenhum item encontrado.
                        </div>
                    ) : (
                        filtered.map((item) => {
                            const qty = quantities[item.id] ?? 0
                            const isSelected = qty > 0
                            return (
                                <div key={item.id} className={`add-order-item ${isSelected ? 'add-order-item--selected' : ''}`}>
                                    <div className="add-order-item-left">
                                        <div className="add-order-item-details">
                                            <span className="add-order-item-name">{item.name}</span>
                                            {item.description && (
                                                <span className="add-order-item-desc">{item.description}</span>
                                            )}
                                        </div>
                                        <span className="add-order-item-price">{fmtBRL(item.price)}</span>
                                    </div>
                                    <div className="add-order-counter">
                                        <button
                                            className="add-order-btn"
                                            onClick={() => change(item.id, -1)}
                                            disabled={!isSelected}
                                        >
                                            <Minus size={13} />
                                        </button>
                                        <span className={`add-order-qty ${isSelected ? 'add-order-qty--active' : ''}`}>
                                            {qty}
                                        </span>
                                        <button
                                            className="add-order-btn add-order-btn--plus"
                                            onClick={() => change(item.id, 1)}
                                        >
                                            <Plus size={13} />
                                        </button>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>

                {/* Summary bar */}
                <div className={`add-order-summary ${total > 0 ? 'add-order-summary--visible' : ''}`}>
                    <div className="add-order-summary-left">
                        <span className="add-order-summary-count">{itemCount}</span>
                        <span>ite{itemCount === 1 ? 'm' : 'ns'} selecionado{itemCount === 1 ? '' : 's'}</span>
                    </div>
                    <span className="add-order-total">{fmtBRL(total)}</span>
                </div>

                {/* Actions */}
                <div className="add-order-actions">
                    <button className="btn btn-secondary" onClick={onClose}>
                        Cancelar
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={handleConfirm}
                        disabled={itemCount === 0 || loading}
                    >
                        {loading ? <Loader2 size={16} className="spin" /> : <ShoppingCart size={16} />}
                        Confirmar Pedido{itemCount > 1 ? 's' : ''}
                    </button>
                </div>
            </div>
        </div>
    )
}
