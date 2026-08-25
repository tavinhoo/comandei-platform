import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { UtensilsCrossed, Loader2, AlertCircle } from 'lucide-react'
import './LoginPage.css'

export function LoginPage() {
    const { login } = useAuth()
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        try {
            await login(email, password)
            navigate('/dashboard')
        } catch {
            setError('E-mail ou senha inválidos.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="login-page">
            <div className="login-bg" />
            <div className="login-box">
                <div className="login-logo">
                    <div className="login-logo-icon">
                        <UtensilsCrossed size={28} />
                    </div>
                    <h1 className="login-title">Comandei</h1>
                    <p className="login-subtitle">Gestão de comandas inteligente</p>
                </div>

                <form className="login-form" onSubmit={handleSubmit}>

                    {error && (
                        <div className="error-banner" style={{ marginBottom: '1rem' }}>
                            <AlertCircle size={14} /> {error}
                        </div>
                    )}

                    <div className="form-group">
                        <label className="form-label">E-mail</label>
                        <input
                            id="email"
                            type="email"
                            className="form-input"
                            placeholder="seu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Senha</label>
                        <input
                            id="password"
                            type="password"
                            className="form-input"
                            placeholder="••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-lg login-submit"
                        disabled={loading}
                    >
                        {loading ? <Loader2 size={18} className="spin" /> : null}
                        Entrar
                    </button>
                </form>


            </div>
        </div>
    )
}
