import { createBrowserRouter, Navigate } from 'react-router-dom';
import { LoginPage } from '../features/auth/pages/LoginPage';
import { RegisterPage } from '../features/auth/pages/RegisterPage';
import { ForgotPasswordPage } from '../features/auth/pages/ForgotPasswordPage';
import { AppLayout } from '../components/layout/AppLayout';
import { DashboardPage } from '../features/dashboard/DashboardPage';
import { ClientsPage } from '../features/clients/ClientsPage';
import { StatsPage } from '../features/stats/StatsPage';
import { ReportsPage } from '../features/reports/ReportsPage';
import { LogsPage } from '../features/logs/LogsPage';
import { UsersPage } from '../features/users/UsersPage';
import { DevicesPage } from '../features/devices/DevicesPage';
import { ServicesPage } from '../features/services/ServicesPage';
import { CleaningPage } from '../features/services/CleaningPage';
import { UpdatesPage } from '../features/updates/UpdatesPage'; // <-- NUEVO
import { CompatibilityPage } from '../features/compatibility/CompatibilityPage'; // <-- NUEVO
import { useAuthStore } from '../store/authStore';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((state) => state.token);
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export const router = createBrowserRouter([
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
    element: <ForgotPasswordPage />,
  },
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
      { path: 'equipos', element: <DevicesPage /> },
      { path: 'servicios', element: <ServicesPage /> },
      { path: 'limpieza', element: <CleaningPage /> },
      { path: 'actualizaciones', element: <UpdatesPage /> }, // <-- NUEVO
      { path: 'compatibilidad', element: <CompatibilityPage /> }, // <-- NUEVO
      { path: 'estadisticas', element: <StatsPage /> },
      { path: 'reportes', element: <ReportsPage /> },
      { path: 'logs', element: <LogsPage /> },
      { path: 'usuarios', element: <UsersPage /> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);