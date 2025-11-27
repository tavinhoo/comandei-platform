import React, { useState } from 'react';
import { X, Check } from 'lucide-react';

interface CreateMenuItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (item: { name: string; price: number; description: string }) => Promise<void>;
  initialData?: { name: string; price: number; description: string };
}

import './CreateMenuItemModal.css';

interface CreateMenuItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (item: { name: string; price: number; description: string }) => Promise<void>;
  initialData?: { name: string; price: number; description: string };
}

const CreateMenuItemModal: React.FC<CreateMenuItemModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setName(initialData.name);
        setPrice(initialData.price.toString());
        setDescription(initialData.description || '');
      } else {
        setName('');
        setPrice('');
        setDescription('');
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({
        name,
        price: Number(price),
        description
      });
      onClose();
      setName('');
      setPrice('');
      setDescription('');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{initialData ? 'Editar Item' : 'Novo Item'}</h2>
          <button onClick={onClose} className="close-btn">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label>Nome</label>
              <input
                className="input-field"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                autoFocus
              />
            </div>
            <div className="form-group">
              <label>Preço (R$)</label>
              <input
                type="number"
                step="0.01"
                className="input-field"
                value={price}
                onChange={e => setPrice(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Descrição</label>
              <input
                className="input-field"
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn-secondary">Cancelar</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar'}
              {!loading && <Check size={18} style={{ marginLeft: 8 }} />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateMenuItemModal;
