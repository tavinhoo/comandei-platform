import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, DollarSign, Clock, Check } from 'lucide-react';
import type { Command } from '../../types/command';
import { menuService, type MenuItem } from '../../services/menuService';
import { useAuth } from '../../contexts/AuthContext';
import { commandService } from '../../services/commandService';
import ConfirmationModal from '../common/ConfirmationModal';

import './CommandDetailsModal.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  command: Command | null;
  onUpdate: (updatedCommand: Command) => void;
  onDelete?: () => void;
}

const CommandDetailsModal: React.FC<Props> = ({ isOpen, onClose, command, onUpdate, onDelete }) => {
  const { user } = useAuth();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
  const [isRemoveItemModalOpen, setIsRemoveItemModalOpen] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadMenu();
      setIsAdding(false);
      setSelectedProduct('');
      setQuantity(1);
    }
  }, [isOpen]);

  const loadMenu = async () => {
    try {
      const items = await menuService.getMenu();
      setMenuItems(items);
    } catch (error) {
      console.error('Failed to load menu:', error);
    }
  };

  if (!isOpen || !command) return null;

  const handleAddItem = async () => {
    if (!selectedProduct || !command) return;

    const product = menuItems.find(p => p.id.toString() === selectedProduct);
    if (!product) return;

    try {
      await commandService.addOrder(command.id, [{
        menuItemId: product.id,
        quantity: quantity
      }]);

      const updatedCommand = await commandService.getCommandById(command.id);
      onUpdate(updatedCommand);

      setIsAdding(false);
      setSelectedProduct('');
      setQuantity(1);
    } catch (error) {
      console.error('Failed to add item:', error);
      alert('Erro ao adicionar item');
    }
  };

  const handleRemoveItem = (orderId: number) => {
    setItemToRemove(orderId);
    setIsRemoveItemModalOpen(true);
  };

  const confirmRemoveItem = async () => {
    if (!command || !itemToRemove) return;

    try {
      await commandService.removeOrder(itemToRemove);
      const updatedCommand = await commandService.getCommandById(command.id);
      onUpdate(updatedCommand);
    } catch (error) {
      console.error('Failed to remove item:', error);
      alert('Erro ao remover item');
    } finally {
      setIsRemoveItemModalOpen(false);
      setItemToRemove(null);
    }
  };

  const handleCloseCommand = () => {
    if (!command) return;
    setIsCloseModalOpen(true);
  };

  const confirmClose = async () => {
    if (!command) return;
    try {
      await commandService.updateStatus(command.id, 'CLOSED');
      const updatedCommand = await commandService.getCommandById(command.id);
      onUpdate(updatedCommand);
      onClose();
    } catch (error) {
      console.error('Failed to close command:', error);
      alert('Erro ao fechar comanda');
    } finally {
      setIsCloseModalOpen(false);
    }
  };

  const handleDelete = () => {
    if (!command || !onDelete) return;
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!command || !onDelete) return;

    try {
      await commandService.deleteCommand(command.id);
      onDelete();
      onClose();
    } catch (error) {
      console.error('Failed to delete command:', error);
      alert('Erro ao excluir comanda');
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="header-info">
            <h2>Comanda {command.tableNumber}</h2>
            {command.customerName && (
              <span style={{
                color: 'var(--color-text-secondary)',
                fontSize: '0.9rem',
                display: 'block',
                marginTop: '4px'
              }}>
                {command.customerName}
              </span>
            )}
            <span className={`status-badge ${command.status.toLowerCase() === 'open' ? 'open' : command.status.toLowerCase()}`}>
              {command.status === 'OPEN' ? 'Aberta' : command.status === 'CLOSED' ? 'Fechada' : 'Cancelada'}
            </span>
          </div>
          <div className="header-actions">
            <button className="confirm-btn" onClick={onClose} title="Confirmar e Fechar">
              <Check size={20} />
            </button>
            <button className="close-btn" onClick={onClose} title="Fechar">
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="modal-body">
          <div className="command-info">
            <div className="info-item">
              <Clock size={16} />
              <span>Aberto às {command.openTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>

          <div className="items-list">
            <h3>Itens do Pedido</h3>
            {command.orders.length === 0 ? (
              <p className="empty-state">Nenhum item adicionado.</p>
            ) : (
              <ul>
                {command.orders.map((order) => (
                  <li key={order.id} className="order-item">
                    <div className="item-details">
                      <span className="item-quantity">{order.quantity}x</span>
                      <span className="item-name">{order.menuItem.name}</span>
                    </div>
                    <div className="item-actions">
                      <span className="item-price">R$ {(order.menuItem.price * order.quantity).toFixed(2)}</span>
                      {command.status !== 'CLOSED' && (
                        <button
                          className="remove-btn"
                          onClick={() => handleRemoveItem(order.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {command.status !== 'CLOSED' && (
              isAdding ? (
                <div className="add-item-form">
                  <div className="form-row">
                    <select
                      value={selectedProduct}
                      onChange={(e) => setSelectedProduct(e.target.value)}
                      className="product-select"
                    >
                      <option value="">Selecione um produto...</option>
                      {menuItems.map(item => (
                        <option key={item.id} value={item.id}>
                          {item.name} - R$ {item.price.toFixed(2)}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value))}
                      className="quantity-input"
                    />
                  </div>
                  <div className="form-actions">
                    <button className="btn-cancel" onClick={() => setIsAdding(false)}>Cancelar</button>
                    <button className="btn-confirm" onClick={handleAddItem} disabled={!selectedProduct}>
                      Adicionar
                    </button>
                  </div>
                </div>
              ) : (
                <button className="add-item-btn" onClick={() => setIsAdding(true)}>
                  <Plus size={16} /> Adicionar Item
                </button>
              )
            )}
          </div>
        </div>

        <div className="modal-footer">
          <div className="total-section">
            <span>Total</span>
            <span className="total-value">
              <DollarSign size={20} />
              {command.totalValue.toFixed(2)}
            </span>
          </div>

          <div className="footer-actions">
            {command.status !== 'CLOSED' && (
              <>
                {onDelete && (
                  <button
                    className="btn-delete-command"
                    onClick={handleDelete}
                    title="Excluir Comanda"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
                <button className="btn-close-command" onClick={handleCloseCommand}>
                  Encerrar Comanda
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Excluir Comanda"
        message="Tem certeza que deseja excluir esta comanda? Esta ação não pode ser desfeita."
        onConfirm={confirmDelete}
        onClose={() => setIsDeleteModalOpen(false)}
        onCancel={() => setIsDeleteModalOpen(false)}
        confirmText="Excluir"
        cancelText="Cancelar"
        variant="danger"
      />

      <ConfirmationModal
        isOpen={isCloseModalOpen}
        title="Encerrar Comanda"
        message="Tem certeza que deseja encerrar esta comanda? O status será alterado para FECHADA."
        onConfirm={confirmClose}
        onClose={() => setIsCloseModalOpen(false)}
        onCancel={() => setIsCloseModalOpen(false)}
        confirmText="Encerrar"
        cancelText="Cancelar"
        variant="warning"
      />

      <ConfirmationModal
        isOpen={isRemoveItemModalOpen}
        title="Remover Item"
        message="Tem certeza que deseja remover este item?"
        onConfirm={confirmRemoveItem}
        onClose={() => setIsRemoveItemModalOpen(false)}
        onCancel={() => setIsRemoveItemModalOpen(false)}
        confirmText="Remover"
        cancelText="Cancelar"
        variant="danger"
      />
    </div>
  );
};

export default CommandDetailsModal;
