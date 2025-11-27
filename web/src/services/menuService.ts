import api from './api';



export interface MenuItem {
    id: number;
    name: string;
    description?: string;
    price: number;
    isActive: boolean;
}

export const menuService = {
    getMenu: async (): Promise<MenuItem[]> => {
        const response = await api.get<MenuItem[]>('/api/cardapio');
        return response.data;
    },

    createItem: async (item: Omit<MenuItem, 'id' | 'isActive'>): Promise<MenuItem> => {
        const response = await api.post<MenuItem>('/api/cardapio', item);
        return response.data;
    },

    updateItem: async (id: number, item: Partial<MenuItem>): Promise<MenuItem> => {
        const response = await api.put<MenuItem>(`/api/cardapio/${id}`, item);
        return response.data;
    },

    deleteItem: async (id: number): Promise<void> => {
        await api.delete(`/api/cardapio/${id}`);
    }
};


