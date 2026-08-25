import { useNavigate } from 'react-router-dom'
import { Clock, User, UserCheck, DollarSign } from 'lucide-react'
import type { CommandDto } from '../api/commands'
import { fmtBRL } from '../api/currency'
import './CommandCard.css'

function elapsed(openTime: string): string {
    const diff = Date.now() - new Date(openTime).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins}min`
    const h = Math.floor(mins / 60)
    const m = mins % 60
    return `${h}h ${m}min`
}

export function CommandCard({ cmd }: { cmd: CommandDto }) {
    const navigate = useNavigate()

    return (
        <div className="command-card" onClick={() => navigate(`/comandas/${cmd.id}`)}>
            <div className="command-card-header">
                <div className="command-card-table">
                    Mesa <span>{cmd.tableNumber}</span>
                </div>
                <span className="badge" style={{
                    color: 'var(--color-emerald)',
                    background: 'var(--color-emerald-bg)',
                    border: '1px solid rgba(16,185,129,0.25)'
                }}>Aberta</span>
            </div>

            <div className="command-card-info">
                {cmd.customerName && (
                    <div className="command-card-row" style={{ fontWeight: 600 }}>
                        <UserCheck size={14} />
                        <span>{cmd.customerName}</span>
                    </div>
                )}
                <div className="command-card-row">
                    <User size={14} />
                    <span>{cmd.responsibleEmployeeName ?? '—'}</span>
                </div>
                <div className="command-card-row">
                    <Clock size={14} />
                    <span>{elapsed(cmd.openTime)}</span>
                </div>
                <div className="command-card-row command-card-value">
                    <DollarSign size={14} />
                    <span>{fmtBRL(cmd.totalValue)}</span>
                </div>
            </div>

            <div className="command-card-footer">
                Ver detalhes →
            </div>
        </div>
    )
}
