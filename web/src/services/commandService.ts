import type { Command, CommandStatus, Order, OrderStatus } from '../types/command';
import api from './api';



export const commandService = {
    getCommands: async (): Promise<Command[]> => {
        const response = await api.get<Command[]>('/api/comandas/abertas');
        return response.data;
    },

    getCommandById: async (id: number): Promise<Command> => {
        const response = await api.get<Command>(`/api/comandas/${id}`);
        return response.data;
    },

    updateStatus: async (commandId: number, newStatus: CommandStatus): Promise<void> => {
        await api.put(`/api/comandas/${commandId}/fechar`);
    },

    getDashboardCommands: async (): Promise<Command[]> => {
        const response = await api.get<Command[]>('/api/comandas/abertas');
        const openCommands = response.data;

        // Generate 20 tables
        const allTables: Command[] = Array.from({ length: 20 }, (_, i) => {
            const tableNum = i + 1;
            const existing = openCommands.find(c => c.tableNumber === tableNum);

            if (existing) {
                return existing;
            }

            return {
                id: -tableNum, // Negative ID for empty tables
                tableNumber: tableNum,
                status: 'CLOSED',
                orders: [],
                totalValue: 0,
                openTime: new Date(),
            };
        });
        return allTables;
    },

    createCommand: async (commandData: { tableNumber: number; customerName?: string; responsibleEmployeeId?: number }): Promise<Command> => {
        const userStr = localStorage.getItem('@Comandei:user');
        let userId = 1; // Default fallback
        if (userStr) {
            const user = JSON.parse(userStr);
            userId = user.id;
        }

        const payload = {
            ...commandData,
            responsibleEmployeeId: userId
        };

        const response = await api.post<Command>('/api/comandas', payload);
        return response.data;
    },

    deleteCommand: async (commandId: number): Promise<void> => {
        await api.delete(`/api/comandas/${commandId}`);
    },

    addOrder: async (commandId: number, items: { menuItemId: number; quantity: number }[]): Promise<void> => {
        await api.post(`/api/comandas/${commandId}/pedidos`, items);
    },

    removeOrder: async (orderId: number): Promise<void> => {
        await api.delete(`/api/pedidos/${orderId}`);
    }
};
