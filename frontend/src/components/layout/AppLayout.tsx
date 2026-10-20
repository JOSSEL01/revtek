import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Users, MonitorSmartphone, Wrench, BarChart3, FileText, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { logsService } from '../../features/logs/logsService';
import { History } from 'lucide-react';

export function AppLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

    const handleLogout = () => {
    if (user) logsService.register(user.email, 'salida'); // <-- Línea nueva
    logout();
    navigate('/login');
    };

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/clientes', label: 'Clientes', icon: Users },
    { path: '/equipos', label: 'Equipos', icon: MonitorSmartphone },
    { path: '/servicios', label: 'Servicios', icon: Wrench },
    { path: '/reportes', label: 'Reportes PDF', icon: FileText },
    { path: '/estadisticas', label: 'Estadísticas', icon: BarChart3 },
    { path: '/logs', label: 'Logs de Acceso', icon: History },
  ];

  return (
    <div className="flex h-screen bg-slate-100">
      {/* Menú Lateral */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex">
        <div className="p-6 border-b border-slate-200">
          <h1 className="text-xl font-bold text-brand-600">Revtek</h1>
          <p className="text-xs text-slate-500 mt-1">Servicio Técnico</p>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 rounded-lg hover:bg-brand-50 hover:text-brand-600 transition"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200">
          <p className="text-sm font-medium text-slate-800 truncate">{user?.fullName}</p>
          <button onClick={handleLogout} className="mt-2 flex items-center gap-2 text-sm text-red-600 hover:text-red-700">
            <LogOut className="h-4 w-4" /> Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header móvil (opcional) */}
        <header className="md:hidden bg-white border-b border-slate-200 p-4 flex justify-between items-center">
          <h1 className="font-bold text-brand-600">Revtek</h1>
          <button onClick={handleLogout} className="text-red-600"><LogOut className="h-5 w-5"/></button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet /> {/* Aquí se cargarán las páginas */}
        </div>
      </main>
    </div>
  );
}