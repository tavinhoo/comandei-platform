import { createContext, useContext, useMemo, useState, useCallback, type ReactNode } from 'react'
import { login as apiLogin } from '../api/auth'

interface UserInfo {
    email: string
    role: 'EMPLOYEE' | 'MANAGER'
    name: string
}

interface AuthContextType {
    token: string | null
    user: UserInfo | null
    login: (email: string, password: string) => Promise<void>
    logout: () => void
    isManager: () => boolean
    isAuthenticated: () => boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

function decodeBase64Url(value: string): string {
    const normalized = value.replace(/-/g, '+').replace(/_/g, '/')
    const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4)
    const binary = atob(padded)
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0))
    return new TextDecoder().decode(bytes)
}


function decodeJwt(token: string): Record<string, unknown> {
    try {
        const payload = token.split('.')[1]
        if (!payload) return {}
        return JSON.parse(decodeBase64Url(payload))
    } catch {
        return {}
    }
}

function isTokenExpired(token: string): boolean {
    const payload = decodeJwt(token)
    const exp = payload.exp as number | undefined
    if (!exp) return false
    return Date.now() / 1000 > exp
}

function extractUser(token: string): UserInfo {
    const payload = decodeJwt(token)

    const roles = (payload.roles as string[] | string) ?? []
    const rolesStr = Array.isArray(roles) ? roles.join(',') : String(roles)
    const role = rolesStr.includes('ROLE_MANAGER') ? 'MANAGER' : 'EMPLOYEE'
    return {
        email: (payload.sub as string) ?? '',
        role,
        name: (payload.name as string) ?? (payload.sub as string) ?? '',
    }
}

function getStoredToken(): string | null {
    const token = localStorage.getItem('token')

    if (!token || isTokenExpired(token)) {
        return null
    }

    return token
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [authState, setAuthState] = useState<{ token: string | null; user: UserInfo | null }>(
        () => {
            const storedToken = getStoredToken()
            return {
                token: storedToken,
                user: storedToken ? extractUser(storedToken) : null,
            }
        },
    )

    const { token, user } = authState

    const login = useCallback(async (email: string, password: string) => {
        const res = await apiLogin({ email, password })
        localStorage.setItem('token', res.token)
        setAuthState({ token: res.token, user: extractUser(res.token) })
    }, [])

    const logout = useCallback(() => {
        localStorage.removeItem('token')
        setAuthState({ token: null, user: null })
    }, [])

    const isManager = useCallback(() => user?.role === 'MANAGER', [user])
    const isAuthenticated = useCallback(() => {
        if (!token) return false
        return !isTokenExpired(token)
    }, [token])

    const value = useMemo(
        () => ({ token, user, login, logout, isManager, isAuthenticated }),
        [token, user, login, logout, isManager, isAuthenticated],
    )

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used within AuthProvider')
    return ctx
}
