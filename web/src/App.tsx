import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import MainLayout from './components/Layout/MainLayout';
import { CommandProvider } from './contexts/CommandContext';

// Lazy loading pages
const Landing = lazy(() => import('./pages/landing/Index'));
const Login = lazy(() => import('./pages/login/Index'));
const Dashboard = lazy(() => import('./pages/dashboard/Index'));
const Cardapio = lazy(() => import('./pages/menu/Index'));


// Loading Fallback
const LoadingFallback = () => (
  <div className="flex-center" style={{ height: '100vh' }}>
    <div style={{
      width: '40px',
      height: '40px',
      border: '3px solid rgba(255,255,255,0.1)',
      borderRadius: '50%',
      borderTopColor: '#ff6b00',
      animation: 'spin 1s linear infinite'
    }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

// Componente para rotas privadas
const PrivateRoutes = () => {
  const { signed, loading } = useAuth();

  if (loading) {
    return <LoadingFallback />;
  }

  return signed ? (
    <CommandProvider>
      <MainLayout>
        <Suspense fallback={<LoadingFallback />}>
          <Outlet />
        </Suspense>
      </MainLayout>
    </CommandProvider>
  ) : (
    <Navigate to="/" />
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Rotas Públicas */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />

            {/* Rotas Privadas */}
            <Route element={<PrivateRoutes />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/cardapio" element={<Cardapio />} />

            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
