import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, Edit2, Trash2, Loader2, X, Check, AlertCircle } from 'lucide-react'
import { listMenuItems, createMenuItem, updateMenuItem, deactivateMenuItem, type MenuItem } from '../api/menu'
import { fmtBRL } from '../api/currency'
import { ConfirmModal } from '../components/ConfirmModal'

interface FormState { name: string; description: string; price: string; isActive: boolean }
const empty: FormState = { name: '', description: '', price: '', isActive: true }

export function CardapioPage() {
    const qc = useQueryClient()
    const [showForm, setShowForm] = useState(false)
    const [editing, setEditing] = useState<MenuItem | null>(null)
    const [form, setForm] = useState<FormState>(empty)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [successMsg, setSuccessMsg] = useState('')
    const [deactivateTarget, setDeactivateTarget] = useState<MenuItem | null>(null)
    const [deactivating, setDeactivating] = useState(false)

    const { data: items = [], isLoading } = useQuery({
        queryKey: ['menu'],
        queryFn: listMenuItems,
    })

    const openCreate = () => {
        setEditing(null)
        setForm(empty)
        setError('')
        setShowForm(true)
    }

    const openEdit = (item: MenuItem) => {
        setEditing(item)
        setForm({ name: item.name, description: item.description ?? '', price: String(item.price), isActive: item.isActive })
        setError('')
        setShowForm(true)
    }

    const handleSave = async () => {
        if (!form.name || !form.price) { setError('Nome e preço são obrigatórios.'); return }
        const price = parseFloat(form.price)
        if (isNaN(price) || price <= 0) { setError('Preço inválido.'); return }
        setSaving(true)
        setError('')
        try {
            if (editing) {
                await updateMenuItem(editing.id, { name: form.name, description: form.description, price, isActive: form.isActive })
                setSuccessMsg('Item atualizado!')
            } else {
                await createMenuItem({ name: form.name, description: form.description, price })
                setSuccessMsg('Item criado!')
            }
            qc.invalidateQueries({ queryKey: ['menu'] })
            setShowForm(false)
            setTimeout(() => setSuccessMsg(''), 3000)
        } catch (err: any) {
            const msg = err?.response?.data?.message || 'Erro ao salvar item.'
            setError(msg)
        } finally {
            setSaving(false)
        }
    }

    const handleDeactivate = async () => {
        if (!deactivateTarget) return
        setDeactivating(true)
        try {
            await deactivateMenuItem(deactivateTarget.id)
            qc.invalidateQueries({ queryKey: ['menu'] })
            setDeactivateTarget(null)
        } finally {
            setDeactivating(false)
        }
    }

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Cardápio</h1>
                    <p className="page-subtitle">{items.length} {items.length === 1 ? 'item ativo' : 'itens ativos'}</p>
                </div>
                <button className="btn btn-primary" onClick={openCreate}>
                    <Plus size={16} /> Novo Item
                </button>
            </div>

            {successMsg && (
                <div className="success-banner" style={{ marginBottom: '1.5rem' }}>
                    <Check size={16} /> {successMsg}
                </div>
            )}

            {isLoading ? (
                <div className="loading-screen" style={{ height: 300 }}>
                    <Loader2 size={32} className="spin" />
                </div>
            ) : items.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">📖</div>
                    <p className="empty-state-text">Cardápio vazio. Clique em "Novo Item" para adicionar.</p>
                </div>
            ) : (
                <div className="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Nome</th>
                                <th>Descrição</th>
                                <th>Preço</th>
                                <th>Status</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item) => (
                                <tr key={item.id}>
                                    <td style={{ color: 'var(--text-muted)' }}>#{item.id}</td>
                                    <td style={{ fontWeight: 600 }}>{item.name}</td>
                                    <td style={{ color: 'var(--text-secondary)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {item.description ?? '—'}
                                    </td>
                                    <td style={{ fontWeight: 700, color: 'var(--color-emerald)' }}>
                                        {fmtBRL(item.price)}
                                    </td>
                                    <td>
                                        <span className="badge" style={
                                            item.isActive
                                                ? { color: 'var(--color-emerald)', background: 'var(--color-emerald-bg)', border: '1px solid rgba(16,185,129,0.25)' }
                                                : { color: 'var(--color-gray)', background: 'var(--color-gray-bg)', border: '1px solid rgba(107,114,128,0.25)' }
                                        }>
                                            {item.isActive ? 'Ativo' : 'Inativo'}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button className="btn btn-ghost btn-sm" onClick={() => openEdit(item)} title="Editar">
                                                <Edit2 size={14} />
                                            </button>
                                            <button className="btn btn-danger btn-sm" onClick={() => setDeactivateTarget(item)} title="Desativar">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {showForm && (
                <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowForm(false)}>
                    <div className="modal-box" style={{ maxWidth: 480 }}>
                        <div className="modal-header">
                            <h2 className="modal-title">{editing ? 'Editar Item' : 'Novo Item'}</h2>
                            <button className="btn btn-ghost btn-sm" onClick={() => setShowForm(false)}>
                                <X size={18} />
                            </button>
                        </div>

                        {error && <div className="error-banner" style={{ marginBottom: '1rem' }}><AlertCircle size={14} />{error}</div>}

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div className="form-group">
                                <label className="form-label">Nome *</label>
                                <input className="form-input" placeholder="Ex: X-Burguer" value={form.name}
                                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} autoFocus />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Descrição</label>
                                <input className="form-input" placeholder="Ex: Hambúrguer artesanal com queijo" value={form.description}
                                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Preço (R$) *</label>
                                <input className="form-input" type="number" min="0" step="0.01" placeholder="0.00" value={form.price}
                                    onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} />
                            </div>
                            {editing && (
                                <div className="form-group">
                                    <label className="form-label">Status</label>
                                    <select className="form-select" value={form.isActive ? 'true' : 'false'}
                                        onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.value === 'true' }))}>
                                        <option value="true">Ativo</option>
                                        <option value="false">Inativo</option>
                                    </select>
                                </div>
                            )}
                        </div>

                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowForm(false)}>Cancelar</button>
                            <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleSave} disabled={saving}>
                                {saving ? <Loader2 size={16} className="spin" /> : <Check size={16} />}
                                {editing ? 'Salvar' : 'Criar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {deactivateTarget && (
                <ConfirmModal
                    title="Desativar Item"
                    message={`Tem certeza que deseja desativar "${deactivateTarget.name}"? O item não aparecerá mais no cardápio.`}
                    confirmLabel="Desativar"
                    loading={deactivating}
                    onConfirm={handleDeactivate}
                    onClose={() => setDeactivateTarget(null)}
                />
            )}
        </div>
    )
}
