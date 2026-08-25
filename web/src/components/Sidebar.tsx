import { NavLink, useNavigate } from 'react-router-dom'
import {
    LayoutDashboard,
    ClipboardList,
    History,
    BookOpen,
    BarChart2,
    Users,
    LogOut,
    UtensilsCrossed,
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import './Sidebar.css'

const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', managerOnly: false },
    { to: '/comandas', icon: ClipboardList, label: 'Comandas', managerOnly: false },
    { to: '/historico', icon: History, label: 'Histórico', managerOnly: false },
    { to: '/cardapio', icon: BookOpen, label: 'Cardápio', managerOnly: false },
    { to: '/relatorios', icon: BarChart2, label: 'Relatórios', managerOnly: true },
    { to: '/users', icon: Users, label: 'Usuários', managerOnly: true },
]

export function Sidebar() {
    const { user, logout, isManager } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <div className="sidebar-logo-icon">
                    <UtensilsCrossed size={20} />
                </div>
                <div>
                    <span className="sidebar-logo-text">Comandei</span>
                    <span className="sidebar-logo-sub">Platform</span>
                </div>
            </div>

            <nav className="sidebar-nav">
                {navItems
                    .filter((item) => !item.managerOnly || isManager())
                    .map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) =>
                                `sidebar-link ${isActive ? 'sidebar-link--active' : ''}`
                            }
                        >
                            <item.icon size={18} />
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
            </nav>

            <div className="sidebar-footer">
                <div className="sidebar-user">
                    <div className="sidebar-user-avatar">
                        {(user?.name?.[0] ?? user?.email?.[0] ?? '?').toUpperCase()}
                    </div>
                    <div className="sidebar-user-info">
                        <span className="sidebar-user-name">{user?.name || user?.email}</span>
                        <span className="sidebar-user-role">
                            {user?.role === 'MANAGER' ? 'Gerente' : 'Atendente'}
                        </span>
                    </div>
                </div>
                <button className="btn btn-ghost btn-sm sidebar-logout" onClick={handleLogout}>
                    <LogOut size={16} />
                </button>
            </div>
        </aside>
    )
}
