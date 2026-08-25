import { useState, type FormEvent } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { UserPlus, Check, AlertCircle, Loader2, Users, Shield, User, Trash2 } from 'lucide-react'
import { createUser, deleteUser, listUsers, type UserSummary } from '../api/users'
import { ConfirmModal } from '../components/ConfirmModal'

export function UsersPage() {
    const qc = useQueryClient()
    const [form, setForm] = useState({ name: '', email: '', password: '', role: 'EMPLOYEE' as 'EMPLOYEE' | 'MANAGER' })
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [deleteTarget, setDeleteTarget] = useState<UserSummary | null>(null)
    const [deleting, setDeleting] = useState(false)

    const { data: users = [], isLoading } = useQuery({
        queryKey: ['users'],
        queryFn: listUsers,
    })

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        if (!form.name || !form.email || !form.password) {
            setError('Preencha todos os campos.')
            return
        }
        setSaving(true)
        setError('')
        setSuccess('')
        try {
            const user = await createUser(form)
            setSuccess(`Usuário "${user.name}" (${user.role === 'MANAGER' ? 'Gerente' : 'Atendente'}) criado com sucesso!`)
            setForm({ name: '', email: '', password: '', role: 'EMPLOYEE' })
            qc.invalidateQueries({ queryKey: ['users'] })
        } catch (err: any) {
            const msg = err?.response?.data?.message || 'Erro ao criar usuário. Verifique se o e-mail já está em uso.'
            setError(msg)
        } finally {
            setSaving(false)
        }
    }

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Usuários</h1>
                    <p className="page-subtitle">Gerencie atendentes e gerentes</p>
                </div>
            </div>

            {/* User List */}
            <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                    <div style={{ width: 36, height: 36, background: 'var(--color-blue-bg)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Users size={16} color="var(--color-blue)" />
                    </div>
                    <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>
                        Usuários Cadastrados ({users.length})
                    </h2>
                </div>

                {isLoading ? (
                    <div className="loading-screen" style={{ height: 200 }}>
                        <Loader2 size={28} className="spin" />
                    </div>
                ) : users.length === 0 ? (
                    <div className="empty-state" style={{ padding: '2rem' }}>
                        <div className="empty-state-icon">👥</div>
                        <p className="empty-state-text">Nenhum usuário cadastrado ainda.</p>
                    </div>
                ) : (
                    <div className="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Nome</th>
                                    <th>E-mail</th>
                                    <th>Perfil</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((u) => (
                                    <tr key={u.id}>
                                        <td style={{ color: 'var(--text-muted)' }}>#{u.id}</td>
                                        <td style={{ fontWeight: 600 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <div style={{
                                                    width: 28, height: 28,
                                                    borderRadius: '50%',
                                                    background: u.role === 'MANAGER' ? 'var(--color-primary-glow)' : 'var(--color-blue-bg)',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontSize: '0.7rem', fontWeight: 700,
                                                    color: u.role === 'MANAGER' ? 'var(--color-primary)' : 'var(--color-blue)',
                                                }}>
                                                    {u.name[0]?.toUpperCase() ?? '?'}
                                                </div>
                                                {u.name}
                                            </div>
                                        </td>
                                        <td style={{ color: 'var(--text-secondary)' }}>{u.email}</td>
                                        <td>
                                            <span className="badge" style={
                                                u.role === 'MANAGER'
                                                    ? { color: 'var(--color-primary)', background: 'var(--color-primary-glow)', border: '1px solid rgba(249,115,22,0.25)' }
                                                    : { color: 'var(--color-blue)', background: 'var(--color-blue-bg)', border: '1px solid rgba(59,130,246,0.25)' }
                                            }>
                                                {u.role === 'MANAGER' ? (
                                                    <><Shield size={10} /> Gerente</>
                                                ) : (
                                                    <><User size={10} /> Atendente</>
                                                )}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                title="Excluir usuário"
                                                onClick={() => setDeleteTarget(u)}
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Create User Form */}
            <div className="card" style={{ maxWidth: 520 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    <div style={{ width: 40, height: 40, background: 'var(--color-primary-glow)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <UserPlus size={18} color="var(--color-primary)" />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>Novo Usuário</h2>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Crie contas de atendentes ou gerentes</p>
                    </div>
                </div>

                {error && (
                    <div className="error-banner" style={{ marginBottom: '1.25rem' }}>
                        <AlertCircle size={14} /> {error}
                    </div>
                )}
                {success && (
                    <div className="success-banner" style={{ marginBottom: '1.25rem' }}>
                        <Check size={14} /> {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                    <div className="form-group">
                        <label className="form-label">Nome completo</label>
                        <input
                            className="form-input"
                            placeholder="Ex: João Silva"
                            value={form.name}
                            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                            required
                            autoFocus
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">E-mail</label>
                        <input
                            type="email"
                            className="form-input"
                            placeholder="joao@restaurante.com"
                            value={form.email}
                            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Senha</label>
                        <input
                            type="password"
                            className="form-input"
                            placeholder="Mínimo 6 caracteres"
                            value={form.password}
                            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Perfil</label>
                        <select
                            className="form-select"
                            value={form.role}
                            onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as 'EMPLOYEE' | 'MANAGER' }))}
                        >
                            <option value="EMPLOYEE">Atendente</option>
                            <option value="MANAGER">Gerente</option>
                        </select>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ justifyContent: 'center' }} disabled={saving}>
                        {saving ? <Loader2 size={16} className="spin" /> : <UserPlus size={16} />}
                        Criar usuário
                    </button>
                </form>
            </div>
            {deleteTarget && (
                <ConfirmModal
                    title="Excluir Usuário"
                    message={`Tem certeza que deseja excluir "${deleteTarget.name}"? Esta ação não pode ser desfeita.`}
                    confirmLabel="Excluir"
                    loading={deleting}
                    onClose={() => setDeleteTarget(null)}
                    onConfirm={async () => {
                        setDeleting(true)
                        try {
                            await deleteUser(deleteTarget.id)
                            qc.invalidateQueries({ queryKey: ['users'] })
                            setDeleteTarget(null)
                        } finally {
                            setDeleting(false)
                        }
                    }}
                />
            )}
        </div>
    )
}
