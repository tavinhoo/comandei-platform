import React from 'react';
import type { Command } from '../../../types/command';

interface MesaCardProps {
    data: Command;
    onClick: (data: Command) => void;
}

export const MesaCard = React.memo(({ data, onClick }: MesaCardProps) => {
    const isOccupied = data.status !== 'CLOSED';

    return (
        <div
            onClick={() => onClick(data)}
            className={`mesa-card ${isOccupied ? 'occupied' : 'free'}`}
        >
            <div className="mesa-header">
                <span className="mesa-number">{data.tableNumber}</span>
                {isOccupied ? (
                    <span className="status-badge open">Aberta</span>
                ) : data.id < 0 ? (
                    <span className="status-badge free" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-success)' }}>Livre</span>
                ) : (
                    <span className="status-badge closed" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-danger)' }}>Fechada</span>
                )}
            </div>

            <div className="mesa-info">
                {data.customerName && (
                    <div style={{ marginBottom: '8px' }}>
                        <p className="label">Cliente</p>
                        <p className="value" style={{ fontSize: '0.9rem' }}>{data.customerName}</p>
                    </div>
                )}
                <p className="label">Total</p>
                <p className="value">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.totalValue || 0)}
                </p>
            </div>

            {!isOccupied && <div className="hover-action">Abrir Comanda</div>}
        </div>
    );
});

MesaCard.displayName = 'MesaCard';
