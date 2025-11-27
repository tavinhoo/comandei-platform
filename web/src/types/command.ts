export type CommandStatus = 'OPEN' | 'CLOSED' | 'CANCELED';
export type OrderStatus = 'WAITING' | 'PREPARING' | 'READY' | 'DELIVERED' | 'CANCELED';

export interface MenuItem {
    id: number;
    name: string;
    description?: string;
    price: number;
    isActive: boolean;
}

export interface Order {
    id: number;
    quantity: number;
    status: OrderStatus;
    orderTime: Date;
    menuItem: MenuItem;
}

export interface Command {
    id: number;
    tableNumber: number;
    status: CommandStatus;
    openTime: Date;
    closeTime?: Date;
    totalValue: number;
    customerName?: string;
    orders: Order[];
}

export interface Column {
    id: CommandStatus;
    title: string;
}
