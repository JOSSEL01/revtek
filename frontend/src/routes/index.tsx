import { createBrowserRouter, Navigate } from 'react-router-dom';
import { LoginPage } from '../features/auth/pages/LoginPage';
import { RegisterPage } from '../features/auth/pages/RegisterPage';
import { ForgotPasswordPage } from '../features/auth/pages/ForgotPasswordPage';
import { LandingPage } from '../features/auth/pages/LandingPage'; // <-- NUEVA IMPORTACIÓN
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
import { UpdatesPage } from '../features/updates/UpdatesPage';
import { CompatibilityPage } from '../features/compatibility/CompatibilityPage';
import { useAuthStore } from '../store/authStore';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((state) => state.token);
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export const router = createBrowserRouter([
  // 1. RUTA PÚBLICA PRINCIPAL (La nueva Landing Page)
  {
    path: '/',
    element: <LandingPage />,
  },
  // 2. RUTAS DE AUTENTICACIÓN
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
  // 3. RUTAS PROTEGIDAS (El sistema interno)
  {
    path: '/app', // Cambiamos la base de '/' a '/app' para no chocar con la Landing
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/app/dashboard" replace /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'clientes', element: <ClientsPage /> },
      { path: 'equipos', element: <DevicesPage /> },
      { path: 'servicios', element: <ServicesPage /> },
      { path: 'limpieza', element: <CleaningPage /> },
      { path: 'actualizaciones', element: <UpdatesPage /> },
      { path: 'compatibilidad', element: <CompatibilityPage /> },
      { path: 'estadisticas', element: <StatsPage /> },
      { path: 'reportes', element: <ReportsPage /> },
      { path: 'logs', element: <LogsPage /> },
      { path: 'usuarios', element: <UsersPage /> },
    ],
  },
  // 4. CUALQUIER OTRA RUTA REDIRIGE A LA LANDING
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);