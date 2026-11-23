import { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Users, MonitorSmartphone, Wrench, BarChart3, FileText, LogOut, 
  LayoutDashboard, History, Menu, X, UserCog, Sparkles, Cpu, ShieldCheck, Terminal, Activity
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
    <div className="flex h-screen bg-[#0a0a0a] font-mono text-sm text-[#00ff9d]">
      
      {/* Sidebar Escritorio - Estilo Termux */}
      <aside className="w-64 bg-[#121212] border-r border-[#2a2a2a] flex-col hidden md:flex">
        <div className="h-16 flex items-center px-4 border-b border-[#2a2a2a] bg-[#0a0a0a]">
          <Link to="/app/dashboard" className="flex items-center gap-2">
            <Terminal className="text-[#00ff9d] h-5 w-5" />
            <span className="text-lg font-bold text-[#00ff9d]">user@revtek:~#</span>
          </Link>
        </div>
        
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <p className="px-2 text-xs font-bold text-slate-600 uppercase tracking-widest mb-3 mt-2">./modules</p>
          {visibleItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded transition-all duration-150 border border-transparent ${
                  isActive 
                    ? 'bg-[#00ff9d]/10 text-[#00ff9d] border-[#00ff9d]/30' 
                    : 'text-slate-400 hover:text-[#00ff9d] hover:bg-[#1a1a1a]'
                }`}
              >
                <span className="text-[#00ff9d] opacity-70">&gt;</span>
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-[#2a2a2a] bg-[#0a0a0a]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center text-[#00ff9d] font-bold">
              {user?.fullName?.charAt(0) || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-200 truncate">{user?.fullName}</p>
              <p className="text-[10px] text-[#00ff9d] opacity-80 uppercase mt-0.5">
                [{user?.role || 'guest'}]
              </p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 text-xs bg-[#1a1a1a] hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/50 border border-[#2a2a2a] text-slate-400 py-2 rounded transition-all">
            <LogOut className="h-3.5 w-3.5" /> exit
          </button>
        </div>
      </aside>

      {/* Menú Móvil */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden font-mono">
          <div className="fixed inset-0 bg-black/80" onClick={() => setIsMobileMenuOpen(false)} />
          <aside className="relative w-64 bg-[#121212] border-r border-[#2a2a2a] h-full flex flex-col">
            <div className="h-16 px-4 border-b border-[#2a2a2a] flex justify-between items-center bg-[#0a0a0a]">
              <span className="text-md font-bold text-[#00ff9d]">user@revtek:~#</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-400 hover:text-[#00ff9d]">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
              {visibleItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 text-sm text-slate-400 hover:text-[#00ff9d] hover:bg-[#1a1a1a] rounded"
                >
                  <span className="text-[#00ff9d] opacity-70">&gt;</span>
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </aside>
        </div>
      )}

      {/* Contenido Principal */}
      <main className="flex-1 flex flex-col overflow-hidden bg-[#0a0a0a]">
        <header className="h-14 bg-[#121212] border-b border-[#2a2a2a] flex justify-between items-center px-4 shrink-0">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-slate-400" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu className="h-5 w-5" />
            </button>
            <h2 className="text-sm text-slate-300 flex items-center gap-2">
              <span className="text-[#00ff9d]">~/revtek/</span>
              {menuItems.find(m => m.path === location.pathname)?.label.toLowerCase().replace(' ', '-') || 'dashboard'}
            </h2>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-[#00ff9d]">
              <span className="w-2 h-2 rounded-full bg-[#00ff9d] animate-pulse"></span> ONLINE
            </span>
            <span className="text-slate-500">{new Date().toLocaleDateString()}</span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#0a0a0a]">
          <Outlet />
        </div>
      </main>
    </div>
  );
}