import { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Users, MonitorSmartphone, Wrench, BarChart3, FileText, LogOut, LayoutDashboard, History, Menu, X } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { logsService } from '../../features/logs/logsService';

export function AppLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Estado para el menú móvil

  const handleLogout = () => {
    if (user) logsService.register(user.email, 'salida');
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
      {/* Menú Lateral (Escritorio) */}
      <aside className="w-64 bg-white border-r border-slate-200 flex-col hidden md:flex">
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

      {/* Menú Lateral (Móvil) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
          <aside className="relative w-64 bg-white h-full flex flex-col">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center">
              <div>
                <h1 className="text-xl font-bold text-brand-600">Revtek</h1>
                <p className="text-xs text-slate-500 mt-1">Servicio Técnico</p>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-500">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
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
        </div>
      )}

      {/* Contenido Principal */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header (Barra superior) */}
        <header className="bg-white border-b border-slate-200 p-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            {/* Botón Hamburguesa (Solo visible en móvil) */}
            <button className="md:hidden text-slate-600" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="font-bold text-brand-600 md:hidden">Revtek</h1>
          </div>
          
          <div className="hidden md:block">
             {/* Espacio para el título o breadcrumbs en escritorio */}
          </div>
          
          <button onClick={handleLogout} className="md:hidden text-red-600">
            <LogOut className="h-5 w-5"/>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}