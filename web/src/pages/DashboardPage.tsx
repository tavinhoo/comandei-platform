import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { ClipboardList, DollarSign, Tag, Loader2, TrendingUp } from 'lucide-react'
import { listCommands } from '../api/commands'
import { listMenuItems } from '../api/menu'
import { getRevenue } from '../api/reports'
import { fmtBRL } from '../api/currency'
import { CommandCard } from '../components/CommandCard'
import { useAuth } from '../contexts/AuthContext'

export function DashboardPage() {
    const { isManager } = useAuth()
    const navigate = useNavigate()

    const { data: commands = [], isLoading: loadingCmds } = useQuery({
        queryKey: ['commands', 'open'],
        queryFn: () => listCommands('OPEN'),
        refetchInterval: 15000,
    })

    const { data: menuItems = [] } = useQuery({
        queryKey: ['menu'],
        queryFn: listMenuItems,
    })

    const today = new Date().toISOString().split('T')[0]
    const { data: revenue } = useQuery({
        queryKey: ['revenue', today],
        queryFn: () => getRevenue(today, today),
        enabled: isManager(),
    })

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Dashboard</h1>
                    <p className="page-subtitle">Visão geral do estabelecimento</p>
                </div>
            </div>

            <div className="stats-grid">
                <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/comandas')}>
                    <div className="stat-icon" style={{ background: 'var(--color-emerald-bg)' }}>
                        <ClipboardList size={18} color="var(--color-emerald)" />
                    </div>
                    <div className="stat-label">Comandas Abertas</div>
                    <div className="stat-value" style={{ color: 'var(--color-emerald)' }}>
                        {loadingCmds ? '…' : commands.length}
                    </div>
                </div>

                {isManager() && (
                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: 'var(--color-primary-glow)' }}>
                            <TrendingUp size={18} color="var(--color-primary)" />
                        </div>
                        <div className="stat-label">Faturamento Hoje</div>
                        <div className="stat-value" style={{ color: 'var(--color-primary)' }}>
                            {revenue !== undefined ? fmtBRL(revenue) : '—'}
                        </div>
                    </div>
                )}

                <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/cardapio')}>
                    <div className="stat-icon" style={{ background: 'var(--color-blue-bg)' }}>
                        <Tag size={18} color="var(--color-blue)" />
                    </div>
                    <div className="stat-label">Itens no Cardápio</div>
                    <div className="stat-value" style={{ color: 'var(--color-blue)' }}>
                        {menuItems.length}
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'var(--color-amber-bg)' }}>
                        <DollarSign size={18} color="var(--color-amber)" />
                    </div>
                    <div className="stat-label">Total em Aberto</div>
                    <div className="stat-value" style={{ color: 'var(--color-amber)' }}>
                        {fmtBRL(commands.reduce((s, c) => s + c.totalValue, 0))}
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Comandas Abertas</h2>
                <button className="btn btn-secondary btn-sm" onClick={() => navigate('/comandas')}>
                    Ver todas →
                </button>
            </div>

            {loadingCmds ? (
                <div className="loading-screen" style={{ height: 200 }}>
                    <Loader2 size={28} className="spin" />
                    <span>Carregando…</span>
                </div>
            ) : commands.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">🍽️</div>
                    <p className="empty-state-text">Nenhuma comanda aberta no momento.</p>
                </div>
            ) : (
                <div className="commands-grid">
                    {commands.slice(0, 6).map((cmd) => (
                        <CommandCard key={cmd.id} cmd={cmd} />
                    ))}
                </div>
            )}
        </div>
    )
}
