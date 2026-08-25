import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { BarChart2, Search, TrendingUp } from 'lucide-react'
import { getRevenue } from '../api/reports'
import { fmtBRL } from '../api/currency'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

function fmtDate(d: Date) {
    return d.toISOString().split('T')[0]
}

export function RelatoriosPage() {
    const today = fmtDate(new Date())
    const [from, setFrom] = useState(today)
    const [to, setTo] = useState(today)
    const [queried, setQueried] = useState({ from: today, to: today })

    const { data: revenue, isLoading } = useQuery({
        queryKey: ['revenue', queried.from, queried.to],
        queryFn: () => getRevenue(queried.from, queried.to),
    })

    const handleQuery = () => {
        setQueried({ from, to })
    }

    // Simple "chart": one bar for the queried period
    const chartData = revenue !== undefined
        ? [{ periodo: `${from} → ${to}`, faturamento: revenue }]
        : []

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Relatórios</h1>
                    <p className="page-subtitle">Faturamento por período</p>
                </div>
            </div>

            <div className="card" style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                    <div className="form-group" style={{ flex: 1, minWidth: 160 }}>
                        <label className="form-label">Data inicial</label>
                        <input type="date" className="form-input" value={from} max={to}
                            onChange={(e) => setFrom(e.target.value)} />
                    </div>
                    <div className="form-group" style={{ flex: 1, minWidth: 160 }}>
                        <label className="form-label">Data final</label>
                        <input type="date" className="form-input" value={to} min={from} max={today}
                            onChange={(e) => setTo(e.target.value)} />
                    </div>
                    <button className="btn btn-primary" onClick={handleQuery} disabled={isLoading}>
                        <Search size={16} /> Consultar
                    </button>
                </div>
            </div>

            <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'var(--color-primary-glow)' }}>
                        <TrendingUp size={18} color="var(--color-primary)" />
                    </div>
                    <div className="stat-label">Total no Período</div>
                    <div className="stat-value" style={{ color: 'var(--color-primary)' }}>
                        {isLoading ? '…' : revenue !== undefined ? fmtBRL(revenue) : '—'}
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'var(--color-blue-bg)' }}>
                        <BarChart2 size={18} color="var(--color-blue)" />
                    </div>
                    <div className="stat-label">Período</div>
                    <div style={{ fontWeight: 700, marginTop: '0.4rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        {queried.from} → {queried.to}
                    </div>
                </div>
            </div>

            {chartData.length > 0 && (
                <div className="card">
                    <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.5rem' }}>
                        Faturamento
                    </h2>
                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={chartData} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                            <XAxis dataKey="periodo" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                            <YAxis
                                tickFormatter={(v) => fmtBRL(v)}
                                tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip
                                formatter={(v) => [fmtBRL(Number(v)), 'Faturamento']}
                                contentStyle={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 8, color: 'var(--text-primary)' }}
                                cursor={{ fill: 'rgba(249,115,22,0.08)' }}
                            />
                            <Bar dataKey="faturamento" fill="var(--color-primary)" radius={[6, 6, 0, 0]} maxBarSize={80} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    )
}
