import { useState, useCallback, useEffect } from 'react';
import { Plus } from 'lucide-react';
import type { Command } from '../../types/command';
import { MesaCard } from './components/MesaCard';
import CommandDetailsModal from '../../components/commands/CommandDetailsModal';
import CreateCommandModal from '../../components/commands/CreateCommandModal';
import { useCommands } from '../../contexts/CommandContext';
import { commandService } from '../../services/commandService';
import './Dashboard.css';

export default function Dashboard() {
  const { dashboardCommands: comandas, loading, updateCommand, refreshDashboard } = useCommands();
  const [selectedCommand, setSelectedCommand] = useState<Command | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [initialTableNumber, setInitialTableNumber] = useState<number | undefined>(undefined);
  const [recentlyClosedCommands, setRecentlyClosedCommands] = useState<Command[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('recentlyClosedCommands');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Convert string dates back to Date objects
        const hydrated = parsed.map((c: any) => ({
          ...c,
          openTime: new Date(c.openTime),
          closeTime: c.closeTime ? new Date(c.closeTime) : undefined
        }));
        setRecentlyClosedCommands(hydrated);
      } catch (e) {
        console.error('Failed to parse recently closed commands', e);
      }
    }
  }, []);

  const handleCardClick = useCallback(async (command: Command) => {
    if (command.status === 'CLOSED') {
      // If it has an ID > 0, it's a real closed command, show details
      if (command.id > 0) {
        try {
          // Try to fetch fresh data, fall back to local data if needed
          const fullCommand = await commandService.getCommandById(command.id);
          setSelectedCommand(fullCommand);
          setIsModalOpen(true);
        } catch (error) {
          console.error('Failed to fetch closed command details:', error);
          // Use the local data we have
          setSelectedCommand(command);
          setIsModalOpen(true);
        }
      } else {
        // It's a placeholder empty table
        setInitialTableNumber(command.tableNumber);
        setIsCreateModalOpen(true);
      }
    } else {
      try {
        const fullCommand = await commandService.getCommandById(command.id);
        setSelectedCommand(fullCommand);
        setIsModalOpen(true);
      } catch (error) {
        console.error('Failed to fetch command details:', error);
        alert('Erro ao carregar detalhes da comanda');
      }
    }
  }, []);

  const handleUpdateCommand = async (updatedCommand: Command) => {
    updateCommand(updatedCommand);
    setSelectedCommand(updatedCommand);

    if (updatedCommand.status === 'CLOSED') {
      setRecentlyClosedCommands(prev => {
        // Avoid duplicates
        if (prev.some(c => c.id === updatedCommand.id)) return prev;
        const newHistory = [updatedCommand, ...prev].slice(0, 10); // Keep last 10
        localStorage.setItem('recentlyClosedCommands', JSON.stringify(newHistory));
        return newHistory;
      });
      await refreshDashboard();
    }
  };

  const handleCreateCommand = async (data: { tableNumber: number; customerName?: string }) => {
    await commandService.createCommand(data);
    await refreshDashboard();
  };

  const openNewCommandModal = () => {
    setInitialTableNumber(undefined);
    setIsCreateModalOpen(true);
  };

  return (
    <div>
      <div className="page-header">
        <h1>Comandas</h1>
        <div style={{ position: 'relative', zIndex: 10 }}>
          <button className="btn-primary" onClick={openNewCommandModal}>
            <Plus size={20} /> Nova Comanda
          </button>
        </div>
      </div>

      {loading ? <div>Carregando...</div> : (
        <div className="mesas-grid">
          {comandas.filter(c => c.status === 'OPEN').map(mesa => (
            <MesaCard
              key={mesa.tableNumber}
              data={mesa}
              onClick={handleCardClick}
            />
          ))}
        </div>
      )}

      {recentlyClosedCommands.length > 0 && (
        <div className="closed-commands-section">
          <h2 className="section-title">Comandas Fechadas Recentemente</h2>
          <div className="mesas-grid">
            {recentlyClosedCommands.map(mesa => (
              <MesaCard
                key={mesa.id}
                data={mesa}
                onClick={handleCardClick}
              />
            ))}
          </div>
        </div>
      )}

      <CommandDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        command={selectedCommand}
        onUpdate={handleUpdateCommand}
        onDelete={() => refreshDashboard()}
      />

      <CreateCommandModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateCommand}
        initialTableNumber={initialTableNumber}
      />
    </div>
  );
}