import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { type ReactNode } from 'react'

interface Props {
    children: ReactNode
    requireManager?: boolean
}

export function ProtectedRoute({ children, requireManager = false }: Props) {
    const { isAuthenticated, isManager } = useAuth()

    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />
    }

    if (requireManager && !isManager()) {
        return <Navigate to="/comandas" replace />
    }

    return <>{children}</>
}
