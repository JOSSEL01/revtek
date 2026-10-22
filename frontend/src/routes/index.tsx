import { createBrowserRouter, Navigate } from 'react-router-dom';
import { LoginPage } from '../features/auth/pages/LoginPage';
import { RegisterPage } from '../features/auth/pages/RegisterPage';
import { ForgotPasswordPage } from '../features/auth/pages/ForgotPasswordPage'; // <-- NUEVO
import { AppLayout } from '../components/layout/AppLayout';
import { DashboardPage } from '../features/dashboard/DashboardPage';
import { ClientsPage } from '../features/clients/ClientsPage';
import { StatsPage } from '../features/stats/StatsPage';
import { ReportsPage } from '../features/reports/ReportsPage';
import { LogsPage } from '../features/logs/LogsPage'; 
import { useAuthStore } from '../store/authStore';
import { UsersPage } from '../features/users/UsersPage';
import { DevicesPage } from '../features/devices/DevicesPage';
import { ServicesPage } from '../features/services/ServicesPage';
import { CleaningPage } from '../features/services/CleaningPage';

// Componente para proteger rutas privadas
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((state) => state.token);
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export const router = createBrowserRouter([
  // 1. Rutas Públicas
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordPage />, // <-- NUEVO
  },
  
  // 2. Rutas Privadas (Protegidas por Login)
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'clientes', element: <ClientsPage /> },
      { path: 'estadisticas', element: <StatsPage /> },
      { path: 'reportes', element: <ReportsPage /> },
      { path: 'logs', element: <LogsPage /> },
      { path: 'equipos', element: <DevicesPage /> },
      { path: 'usuarios', element: <UsersPage /> },
      { path: 'servicios', element: <ServicesPage /> },
      { path: 'limpieza', element: <CleaningPage /> },
      
      // Rutas en construcción (para que el menú no falle si hacen clic)
      { path: 'equipos', element: <div className="p-8 card text-center text-slate-500">Módulo de Equipos en construcción...</div> },
      { path: 'servicios', element: <div className="p-8 card text-center text-slate-500">Módulo de Servicios en construcción...</div> },
    ],
  },
  
  // 3. Redirección por defecto si la ruta no existe
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);