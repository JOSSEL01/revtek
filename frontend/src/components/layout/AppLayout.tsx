import { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Users, MonitorSmartphone, Wrench, BarChart3, FileText, LogOut, LayoutDashboard, History, Menu, X, UserCog } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { logsService } from '../../features/logs/logsService';

export function AppLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Depuración: Esto te dirá en la consola del navegador qué rol está leyendo
  console.log("Rol actual del usuario:", user?.role);

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
    { path: '/logs', label: 'Logs de Acceso', icon: History, adminOnly: true },
    { path: '/usuarios', label: 'Usuarios', icon: UserCog, adminOnly: true },
  ];

  // FILTRO: Si es adminOnly y el usuario NO es admin, no se muestra
  const visibleItems = menuItems.filter(item => {
    if (item.adminOnly) {
      return user?.role === 'admin';
    }
    return true;
  });

  return (
    <div className="flex h-screen bg-slate-100">
      {/* Menú Escritorio */}
      <aside className="w-64 bg-white border-r border-slate-200 flex-col hidden md:flex">
        <div className="p-6 border-b border-slate-200">
          <h1 className="text-xl font-bold text-brand-600">Revtek</h1>
          <p className="text-xs text-slate-500 mt-1">Servicio Técnico</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {visibleItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 rounded-lg hover:bg-brand-50 hover:text-brand-600 transition-all duration-200"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        
        <div className="p-4 border-t border-slate-200">
          <div className="mb-2">
            <p className="text-sm font-medium text-slate-800 truncate">{user?.fullName}</p>
            {/* Etiqueta del rol */}
            <span className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase rounded-full ${
              user?.role === 'admin' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
            }`}>
              {user?.role || 'SIN ROL'}
            </span>
          </div>
          <button onClick={handleLogout} className="mt-2 flex items-center gap-2 text-sm text-red-600 hover:text-red-700 transition-colors">
            <LogOut className="h-4 w-4" /> Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Menú Móvil */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
          <aside className="relative w-64 bg-white h-full flex flex-col">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center">
              <div>
                <h1 className="text-xl font-bold text-brand-600">Revtek</h1>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-500">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {visibleItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 rounded-lg hover:bg-brand-50 hover:text-brand-600 transition-all duration-200"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="p-4 border-t border-slate-200">
              <p className="text-sm font-medium text-slate-800 truncate">{user?.fullName}</p>
              <span className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase rounded-full ${
                user?.role === 'admin' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
              }`}>
                {user?.role || 'SIN ROL'}
              </span>
              <button onClick={handleLogout} className="mt-2 flex items-center gap-2 text-sm text-red-600 hover:text-red-700 transition-colors">
                <LogOut className="h-4 w-4" /> Cerrar sesión
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Contenido Principal */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-slate-200 p-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-slate-600" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="font-bold text-brand-600 md:hidden">Revtek</h1>
          </div>
          <div className="hidden md:block"></div>
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