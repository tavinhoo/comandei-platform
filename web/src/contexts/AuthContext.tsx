import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'ROLE_MANAGER' | 'ROLE_EMPLOYEE';
}

interface AuthContextData {
  signed: boolean;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storagedUser = localStorage.getItem('@Comandei:user');
    const storagedToken = localStorage.getItem('@Comandei:token');

    if (storagedUser && storagedToken) {
      setUser(JSON.parse(storagedUser));
      // Set default header
      api.defaults.headers.common['Authorization'] = `Bearer ${storagedToken}`;
    }
    setLoading(false);
  }, []);

  async function signIn(email: string, password: string) {
    const response = await api.post('/auth/login', { email, password });

    // Backend returns AuthResponse { token, userId, name, email, role }
    const { token, userId, name, email: userEmail, role } = response.data as {
      token: string;
      userId: number;
      name: string;
      email: string;
      role: string;
    };

    // Normalize to frontend User shape
    const userData = {
      id: userId,
      name,
      email: userEmail,
      // backend role comes as MANAGER or EMPLOYEE, frontend expects ROLE_ prefix
      role: role.startsWith('ROLE_') ? role : `ROLE_${role}`,
    } as User;

    setUser(userData);

    // set default header on axios instance used across the app
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    localStorage.setItem('@Comandei:user', JSON.stringify(userData));
    localStorage.setItem('@Comandei:token', token);
  }

  function signOut() {
    localStorage.clear();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ signed: !!user, user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  return context;
}