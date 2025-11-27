import React, { useState } from 'react';
import { X, Check } from 'lucide-react';

interface CreateCommandModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { tableNumber: number; customerName?: string }) => Promise<void>;
  initialTableNumber?: number;
}

import './CreateCommandModal.css';

interface CreateCommandModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { tableNumber: number; customerName?: string }) => Promise<void>;
  initialTableNumber?: number;
}

const CreateCommandModal: React.FC<CreateCommandModalProps> = ({ isOpen, onClose, onSubmit, initialTableNumber }) => {
  const [tableNumber, setTableNumber] = useState<string>(initialTableNumber ? String(initialTableNumber) : '');
  const [customerName, setCustomerName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      setTableNumber(initialTableNumber ? String(initialTableNumber) : '');
      setCustomerName('');
      setError(null);
    }
  }, [isOpen, initialTableNumber]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tableNumber) return;

    setLoading(true);
    setError(null);

    try {
      await onSubmit({
        tableNumber: Number(tableNumber),
        customerName: customerName || undefined
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erro ao criar comanda');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Nova Comanda</h2>
          <button onClick={onClose} className="close-btn">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
              <label htmlFor="tableNumber">Número da Mesa</label>
              <input
                id="tableNumber"
                type="number"
                min="1"
                className="input-field"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                placeholder="Ex: 10"
                autoFocus
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="customerName">Nome do Cliente (Opcional)</label>
              <input
                id="customerName"
                type="text"
                className="input-field"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Ex: João Silva"
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Criando...' : 'Criar Comanda'}
              {!loading && <Check size={18} style={{ marginLeft: 8 }} />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCommandModal;
