import { useEffect, useState } from 'react';
import { Plus, Edit3, Trash2, Coffee } from 'lucide-react';
import CreateMenuItemModal from '../../components/menu/CreateMenuItemModal';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import { menuService, type MenuItem } from '../../services/menuService';
import './Menu.css';

export default function Menu() {
  const [itens, setItens] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<MenuItem | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const loadMenu = async () => {
    try {
      const data = await menuService.getMenu();
      setItens(data);
    } catch (error) {
      console.error('Failed to load menu:', error);
      alert('Erro ao carregar cardápio');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMenu();
  }, []);

  const handleSaveItem = async (itemData: { name: string; price: number; description: string }) => {
    try {
      if (editingItem) {
        await menuService.updateItem(editingItem.id, itemData);
      } else {
        await menuService.createItem(itemData);
      }
      loadMenu();
      setIsCreateModalOpen(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Failed to save item:', error);
      alert('Erro ao salvar item');
    }
  };

  const handleEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setIsCreateModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
    setEditingItem(null);
  };

  const handleDeleteItem = (item: MenuItem) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      await menuService.deleteItem(itemToDelete.id);
      loadMenu();
    } catch (error) {
      console.error('Failed to delete item:', error);
      alert('Erro ao excluir item');
    } finally {
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1><Coffee className="text-primary" /> Cardápio</h1>
        <button className="btn-primary" onClick={() => setIsCreateModalOpen(true)}>
          <Plus size={20} /> Novo Item
        </button>
      </div>

      {loading ? <div>Carregando...</div> : (
        <div className="cardapio-grid">
          {itens.map(item => (
            <div key={item.id} className="menu-card">
              <span className="price-tag">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price)}
              </span>
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <div className="card-actions">
                <button className="btn-icon edit" onClick={() => handleEditItem(item)}>
                  <Edit3 size={16} /> Editar
                </button>
                <button className="btn-icon delete" onClick={() => handleDeleteItem(item)}>
                  <Trash2 size={16} /> Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <CreateMenuItemModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSaveItem}
        initialData={editingItem ? {
          name: editingItem.name,
          price: editingItem.price,
          description: editingItem.description || ''
        } : undefined}
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onCancel={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Excluir Item"
        message={itemToDelete ? `Tem certeza que deseja excluir o item "${itemToDelete.name}"?` : ''}
        confirmText="Excluir"
        cancelText="Cancelar"
      />
    </div>
  );
}
