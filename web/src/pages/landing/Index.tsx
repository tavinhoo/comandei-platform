import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ShieldCheck } from 'lucide-react';
import './Landing.css'; // <--- Importante: Importe o arquivo CSS que criamos

const Landing: React.FC = () => {
  const navigate = useNavigate();

  const handleRoleSelect = (role: 'ROLE_MANAGER' | 'ROLE_EMPLOYEE') => {
    navigate('/login', { state: { role } });
  };

  return (
    <div className="landing-container">
      <div className="landing-content">

        {/* Seção do Logo */}
        <div className="logo-section">
          <img src="/comandeiLogo.png" alt="Comandei Logo" className="logo-icon" style={{ height: '120px', width: 'auto' }} />
          <h1 className="app-title">
            Comandei<span className="text-gradient">.</span>
          </h1>
          <p className="app-subtitle">Plataforma Premium de Gestão para Restaurantes</p>
        </div>

        {/* Seleção de Perfil */}
        <div className="role-selection">

          {/* Botão Funcionário */}
          <button
            className="role-card"
            onClick={() => handleRoleSelect('ROLE_EMPLOYEE')}
            type="button"
          >
            <div className="icon-wrapper">
              <User size={32} />
            </div>
            <div>
              <h3>Funcionário</h3>
              <p>Acesso para garçons e cozinha</p>
            </div>
          </button>

          {/* Botão Gerente */}
          <button
            className="role-card"
            onClick={() => handleRoleSelect('ROLE_MANAGER')}
            type="button"
          >
            <div className="icon-wrapper secondary">
              <ShieldCheck size={32} />
            </div>
            <div>
              <h3>Gerente</h3>
              <p>Controle total do estabelecimento</p>
            </div>
          </button>

        </div>
      </div>
    </div>
  );
};

export default Landing;