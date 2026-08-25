import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Layout } from './components/Layout'
import { LoginPage } from './pages/LoginPage'
import { DashboardPage } from './pages/DashboardPage'
import { ComandasPage } from './pages/ComandasPage'
import { ComandaDetailPage } from './pages/ComandaDetailPage'
import { CardapioPage } from './pages/CardapioPage'
import { HistoricoPage } from './pages/HistoricoPage'
import { RelatoriosPage } from './pages/RelatoriosPage'
import { UsersPage } from './pages/UsersPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-right" theme="dark" richColors closeButton />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route path="/login" element={<LoginPage />} />

            {/* Protected — any authenticated user */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Layout><DashboardPage /></Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/comandas"
              element={
                <ProtectedRoute>
                  <Layout><ComandasPage /></Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/comandas/:id"
              element={
                <ProtectedRoute>
                  <Layout><ComandaDetailPage /></Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/cardapio"
              element={
                <ProtectedRoute>
                  <Layout><CardapioPage /></Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/historico"
              element={
                <ProtectedRoute>
                  <Layout><HistoricoPage /></Layout>
                </ProtectedRoute>
              }
            />

            {/* Protected — MANAGER only */}
            <Route
              path="/relatorios"
              element={
                <ProtectedRoute requireManager>
                  <Layout><RelatoriosPage /></Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/users"
              element={
                <ProtectedRoute requireManager>
                  <Layout><UsersPage /></Layout>
                </ProtectedRoute>
              }
            />

            {/* Redirects */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}
