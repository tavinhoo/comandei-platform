import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, UtensilsCrossed, LogOut, User, type LucideIcon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import './MainLayout.css';

interface SidebarItemProps {
  to: string;
  icon: LucideIcon;
  label: string;
}

const SidebarItem = ({ to, icon: Icon, label }: SidebarItemProps) => (
  <NavLink
    to={to}
    className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
  >
    <Icon size={20} />
    <span>{label}</span>
  </NavLink>
);

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { user, signOut } = useAuth();

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-container" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 className="logo">Comandei</h1>
          </div>
        </div>

        <nav className="sidebar-nav">
          <SidebarItem to="/dashboard" icon={LayoutDashboard} label="Comandas" />
          <SidebarItem to="/cardapio" icon={UtensilsCrossed} label="Cardápio" />
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="avatar">
              <User size={20} />
            </div>
            <div className="user-details">
              <p className="user-name">{user?.name || 'Usuário'}</p>
              <p className="user-role">{user?.role || 'Staff'}</p>
            </div>
          </div>
          <button onClick={signOut} className="btn-logout">
            <LogOut size={16} /> Sair
          </button>
        </div>
      </aside>

      <main className="main-content">


        <div className="content-wrapper">
          {children}
        </div>
      </main>
    </div>
  );
}