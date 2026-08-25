import { AlertTriangle, Loader2, X } from 'lucide-react'

interface Props {
    title: string
    message: string
    confirmLabel?: string
    loading?: boolean
    onConfirm: () => void
    onClose: () => void
}

export function ConfirmModal({ title, message, confirmLabel = 'Excluir', loading = false, onConfirm, onClose }: Props) {
    return (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="modal-box" style={{ maxWidth: 420 }}>
                <div className="modal-header">
                    <h2 className="modal-title">{title}</h2>
                    <button className="btn btn-ghost btn-sm" onClick={onClose}>
                        <X size={18} />
                    </button>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', margin: '1.25rem 0' }}>
                    <div style={{
                        width: 40, height: 40, minWidth: 40,
                        borderRadius: 'var(--radius-sm)',
                        background: 'rgba(239,68,68,0.1)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <AlertTriangle size={20} color="var(--color-red)" />
                    </div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                        {message}
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                    <button className="btn btn-secondary" style={{ flex: 1 }} onClick={onClose} disabled={loading}>
                        Cancelar
                    </button>
                    <button className="btn btn-danger" style={{ flex: 1 }} onClick={onConfirm} disabled={loading}>
                        {loading ? <Loader2 size={16} className="spin" /> : null}
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    )
}
