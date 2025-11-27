import { useState, type FormEvent, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Login.css';

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Default to employee if no role passed
  const role = location.state?.role || 'ROLE_EMPLOYEE';

  useEffect(() => {
    // If user navigates directly to /login without picking a role, redirect to landing
    if (!location.state?.role) {
      navigate('/');
    }
  }, [location, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await signIn(email, password);
      navigate('/dashboard');
    } catch (error) {
      alert('Erro ao fazer login. Verifique suas credenciais.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <img src="/comandeiLogo.png" alt="Comandei Logo" className="login-icon" style={{ height: '80px', width: 'auto' }} />
          <h1>Comandei</h1>
          <p className="role-badge">{role === 'ROLE_MANAGER' ? 'Gerente' : 'Funcionário'}</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" className="input-field" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Senha</label>
            <input type="password" className="input-field" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn-login">
            Entrar <ArrowRight size={16} className="btn-icon" />
          </button>
        </form>
      </div>

    </div>
  );
}