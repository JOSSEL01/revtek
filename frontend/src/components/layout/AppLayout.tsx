import { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Users, MonitorSmartphone, Wrench, BarChart3, FileText, LogOut, 
  LayoutDashboard, History, Menu, X, UserCog, Sparkles, Cpu, ShieldCheck, Terminal, Zap
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { logsService } from '../../features/logs/logsService';

export function AppLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    if (user) logsService.register(user.email, 'salida');
    logout();
    navigate('/login');
  };

  const menuItems = [
    { path: '/app/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/app/clientes', label: 'Clientes', icon: Users },
    { path: '/app/equipos', label: 'Equipos', icon: MonitorSmartphone },
    { path: '/app/servicios', label: 'Servicios', icon: Wrench },
    { path: '/app/actualizaciones', label: 'Actualizaciones', icon: Cpu },
    { path: '/app/compatibilidad', label: 'Compatibilidad', icon: ShieldCheck },
    { path: '/app/limpieza', label: 'Limpieza', icon: Sparkles },
    { path: '/app/reportes', label: 'Reportes PDF', icon: FileText },
    { path: '/app/estadisticas', label: 'Estadísticas', icon: BarChart3 },
    { path: '/app/logs', label: 'Logs de Acceso', icon: History, adminOnly: true },
    { path: '/app/usuarios', label: 'Usuarios', icon: UserCog, adminOnly: true },
  ];

  const visibleItems = menuItems.filter(item => !item.adminOnly || user?.role === 'admin');

  return (
    <div className="flex h-screen bg-[#f8fafc]">
      
      {/* Sidebar Escritorio */}
      <aside className="w-64 bg-[#1e1e1e] text-slate-300 flex-col hidden md:flex border-r border-[#3e3e42]">
        <div className="h-16 flex items-center px-6 border-b border-[#3e3e42] bg-[#252526]">
          <Link to="/app/dashboard" className="flex items-center gap-3">
            <div className="bg-[#1152d4] p-1.5 rounded-lg">
              <Zap className="text-white h-5 w-5" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">REVTEK.SYS</span>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <p className="px-3 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Módulos</p>
          {visibleItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors text-sm font-medium ${
                  isActive 
                    ? 'bg-[#1152d4] text-white' 
                    : 'hover:bg-[#2d2d30] hover:text-white'
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-[#3e3e42] bg-[#252526]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-[#1152d4] flex items-center justify-center text-white font-bold text-xs">
              {user?.fullName?.charAt(0) || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">{user?.fullName}</p>
              <span className={`inline-block px-1.5 py-0.5 text-[10px] font-bold uppercase rounded-sm mt-0.5 ${
                user?.role === 'admin' ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'
              }`}>
                {user?.role || 'SIN ROL'}
              </span>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 text-sm bg-[#3e3e42] hover:bg-red-500/20 hover:text-red-400 text-slate-300 py-2 rounded transition-colors">
            <LogOut className="h-4 w-4" /> Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Menú Móvil */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
          <aside className="relative w-64 bg-[#1e1e1e] text-slate-300 h-full flex flex-col border-r border-[#3e3e42]">
            <div className="h-16 px-6 border-b border-[#3e3e42] flex justify-between items-center bg-[#252526]">
              <span className="text-lg font-bold text-white">REVTEK.SYS</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {visibleItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-md hover:bg-[#2d2d30] hover:text-white transition-all"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="p-4 border-t border-[#3e3e42] bg-[#252526]">
              <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 text-sm bg-[#3e3e42] text-red-400 py-2 rounded">
                <LogOut className="h-4 w-4" /> Cerrar sesión
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Contenido Principal */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex justify-between items-center px-6 shrink-0">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-slate-600" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu className="h-6 w-6" />
            </button>
            <h2 className="text-lg font-bold text-slate-800">
              {menuItems.find(m => m.path === location.pathname)?.label || 'Panel de Control'}
            </h2>
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <span className="hidden md:inline-block bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">Sistema en Línea</span>
            <span>{new Date().toLocaleDateString()}</span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}