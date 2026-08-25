import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, Loader2, X } from 'lucide-react'
import { toast } from 'sonner'
import { listCommands, openCommand } from '../api/commands'
import { CommandCard } from '../components/CommandCard'

export function ComandasPage() {
    const qc = useQueryClient()
    const [showModal, setShowModal] = useState(false)
    const [tableNumber, setTableNumber] = useState('')
    const [customerName, setCustomerName] = useState('')
    const [error, setError] = useState('')
    const [saving, setSaving] = useState(false)

    const { data: commands = [], isLoading } = useQuery({
        queryKey: ['commands', 'open'],
        queryFn: () => listCommands('OPEN'),
        refetchInterval: 15000,
    })

    const handleOpen = async () => {
        const table = Number(tableNumber)
        if (!table) {
            setError('Informe o número da mesa.')
            return
        }
        setSaving(true)
        setError('')
        try {
            await openCommand({ tableNumber: table, customerName: customerName.trim() || undefined })
            qc.invalidateQueries({ queryKey: ['commands'] })
            setShowModal(false)
            setTableNumber('')
            setCustomerName('')
            toast.success(`Comanda da Mesa ${table} aberta com sucesso!`)
        } catch (err: any) {
            const msg = err?.response?.data?.message || 'Erro ao abrir comanda. Tente novamente.'
            setError(msg)
        } finally {
            setSaving(false)
        }
    }

    const closeModal = () => {
        setShowModal(false)
        setTableNumber('')
        setCustomerName('')
        setError('')
    }

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Comandas</h1>
                    <p className="page-subtitle">{commands.length} abertas agora</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    <Plus size={16} /> Nova Comanda
                </button>
            </div>

            {isLoading ? (
                <div className="loading-screen" style={{ height: 300 }}>
                    <Loader2 size={32} className="spin" />
                </div>
            ) : commands.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">📋</div>
                    <p className="empty-state-text">Nenhuma comanda aberta. Clique em "Nova Comanda" para começar.</p>
                </div>
            ) : (
                <div className="commands-grid">
                    {commands.map((cmd) => (
                        <CommandCard key={cmd.id} cmd={cmd} />
                    ))}
                </div>
            )}

            {showModal && (
                <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}>
                    <div className="modal-box" style={{ maxWidth: 420 }}>
                        <div className="modal-header">
                            <h2 className="modal-title">Nova Comanda</h2>
                            <button className="btn btn-ghost btn-sm" onClick={closeModal}>
                                <X size={18} />
                            </button>
                        </div>

                        {error && <div className="error-banner" style={{ marginBottom: '1rem' }}>{error}</div>}

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div className="form-group">
                                <label className="form-label">Número da Mesa</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    placeholder="Ex: 5"
                                    min={1}
                                    value={tableNumber}
                                    onChange={(e) => setTableNumber(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Nome do Cliente <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(opcional)</span></label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Ex: João Silva"
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={closeModal}>
                                Cancelar
                            </button>
                            <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleOpen} disabled={saving}>
                                {saving ? <Loader2 size={16} className="spin" /> : <Plus size={16} />}
                                Abrir
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
