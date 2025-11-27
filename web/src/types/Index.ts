
export interface User {
  user_id?: number;
  user_name: string;
  user_email: string;
  role?: string;
}

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
}

export interface Command {
  id: number | null;
  tableNumber: number;
  status: 'OPEN' | 'CLOSED';
  totalValue: number;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
}