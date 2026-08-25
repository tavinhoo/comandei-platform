import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Trash2, Loader2 } from 'lucide-react'
import { listHistory, clearHistory } from '../api/commands'
import { fmtBRL } from '../api/currency'
import { ConfirmModal } from '../components/ConfirmModal'

function fmtDate(dt: string | null) {
    if (!dt) return '—'
    return new Date(dt).toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
}

export function HistoricoPage() {
    const qc = useQueryClient()
    const [showClearConfirm, setShowClearConfirm] = useState(false)
    const [clearing, setClearing] = useState(false)

    const { data: commands = [], isLoading } = useQuery({
        queryKey: ['commands', 'history'],
        queryFn: listHistory,
    })

    const handleClear = async () => {
        setClearing(true)
        try {
            await clearHistory()
            qc.invalidateQueries({ queryKey: ['commands'] })
            setShowClearConfirm(false)
        } finally {
            setClearing(false)
        }
    }

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Histórico</h1>
                    <p className="page-subtitle">
                        {commands.length} comanda{commands.length !== 1 ? 's' : ''} no histórico
                    </p>
                </div>
                {commands.length > 0 && (
                    <button className="btn btn-danger" onClick={() => setShowClearConfirm(true)}>
                        <Trash2 size={16} /> Limpar Histórico
                    </button>
                )}
            </div>

            {isLoading ? (
                <div className="loading-screen" style={{ height: 300 }}>
                    <Loader2 size={32} className="spin" />
                </div>
            ) : commands.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">📜</div>
                    <p className="empty-state-text">Nenhuma comanda no histórico.</p>
                </div>
            ) : (
                <div className="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Mesa</th>
                                <th>Cliente</th>
                                <th>Status</th>
                                <th>Valor Total</th>
                                <th>Data de Fechamento</th>
                                <th>Atendente</th>
                            </tr>
                        </thead>
                        <tbody>
                            {commands.map((cmd) => (
                                <tr key={cmd.id}>
                                    <td style={{ color: 'var(--text-muted)', fontWeight: 500 }}>#{cmd.id}</td>
                                    <td style={{ fontWeight: 600 }}>Mesa {cmd.tableNumber}</td>
                                    <td>{cmd.customerName ?? '—'}</td>
                                    <td>
                                        <span className="badge" style={
                                            cmd.status === 'CLOSED'
                                                ? { color: 'var(--color-emerald)', background: 'var(--color-emerald-bg)', border: '1px solid rgba(16,185,129,0.25)' }
                                                : { color: 'var(--color-red)', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)' }
                                        }>
                                            {cmd.status === 'CLOSED' ? 'Fechada' : 'Cancelada'}
                                        </span>
                                    </td>
                                    <td style={{ fontWeight: 700, color: 'var(--color-emerald)' }}>
                                        {fmtBRL(cmd.totalValue)}
                                    </td>
                                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                        {fmtDate(cmd.closeTime)}
                                    </td>
                                    <td>{cmd.responsibleEmployeeName ?? '—'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {showClearConfirm && (
                <ConfirmModal
                    title="Limpar Histórico"
                    message={`Tem certeza que deseja apagar todas as ${commands.length} comanda${commands.length !== 1 ? 's' : ''} do histórico? Esta ação não pode ser desfeita.`}
                    confirmLabel="Limpar Tudo"
                    loading={clearing}
                    onConfirm={handleClear}
                    onClose={() => setShowClearConfirm(false)}
                />
            )}
        </div>
    )
}
