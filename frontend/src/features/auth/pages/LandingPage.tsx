import { useNavigate, Link } from 'react-router-dom';
import { Monitor, Smartphone, Laptop, Wrench, HardDrive, FileText, BarChart3, Users, Settings, Terminal, Cpu, ShieldCheck, Zap } from 'lucide-react';

export const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a] font-mono text-[#00ff9d]">
      
      {/* NAVBAR Estilo Terminal */}
      <nav className="bg-[#121212] border-b border-[#2a2a2a] py-4 px-6 md:px-12 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
          <Terminal className="text-[#00ff9d] h-6 w-6" />
          <span className="text-xl md:text-2xl font-bold tracking-tighter uppercase group-hover:text-white transition-colors">
            user@revtek:~#
          </span>
        </div>

        <div className="flex items-center gap-6 text-sm">
          <Link to="/login" className="text-slate-400 hover:text-[#00ff9d] transition-colors hidden md:block">
            ./login.sh
          </Link>
          <Link 
            to="/register"
            className="bg-[#00ff9d]/10 text-[#00ff9d] border border-[#00ff9d]/30 px-4 py-2 rounded hover:bg-[#00ff9d] hover:text-black transition-all"
          >
            ./register.sh
          </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <div className="flex flex-col md:flex-row relative overflow-hidden text-white border-b border-[#2a2a2a]">
        <div className="md:w-1/2 relative z-10 p-12 md:p-20 flex flex-col justify-center">
          <div className="text-[#00ff9d] mb-4 text-sm">
            <span className="opacity-50">$</span> sudo apt-get install revtek-service
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight leading-tight text-white">
            Optimiza, Repara y <br/> Gestiona tus Equipos.
          </h1>
          <p className="text-base md:text-lg text-slate-400 mb-8 max-w-lg font-sans">
            Revtek es el sistema integral para tu servicio técnico. Administra clientes, equipos, actualizaciones de hardware y software, todo en un solo lugar.
          </p>
          <div className="flex gap-4">
            <a 
              href="#caracteristicas"
              className="bg-[#00ff9d] text-black px-6 py-3 rounded font-bold text-sm hover:bg-[#00cc7d] transition-all text-center flex items-center gap-2"
            >
              <Terminal size={16} /> Ejecutar_ayuda
            </a>
          </div>
        </div>

        <div className="md:w-1/2 relative z-10 flex items-center justify-center p-12 bg-[#121212]/50">
          <div className="flex gap-6 bg-[#1a1a1a] p-8 rounded-xl border border-[#2a2a2a] shadow-2xl">
            <Monitor size={60} className="text-[#00ff9d] opacity-80" />
            <Laptop size={60} className="text-[#00b8ff] opacity-80" />
            <Smartphone size={60} className="text-[#ff0055] opacity-80" />
          </div>
        </div>
      </div>

      {/* SECCIÓN DE CARACTERÍSTICAS */}
      <div id="caracteristicas" className="py-20 px-6 md:px-12 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 border-l-4 border-[#00ff9d] pl-4">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 flex items-center gap-2">
              <Terminal size={24} className="text-[#00ff9d]"/> cat features.log
            </h2>
            <p className="text-slate-400 font-sans">Un ecosistema completo diseñado para facilitar la gestión de tu taller técnico.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 bg-[#121212] rounded-lg border border-[#2a2a2a] hover:border-[#00ff9d]/50 transition-colors group">
              <div className="w-10 h-10 bg-[#1a1a1a] rounded-lg flex items-center justify-center mb-4 border border-[#2a2a2a] group-hover:border-[#00ff9d]/30">
                <Users className="text-[#00ff9d]" size={20} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Gestión de Clientes</h3>
              <p className="text-slate-500 text-sm font-sans">Administra la información de tus clientes y mantén un historial de sus equipos.</p>
            </div>

            <div className="p-6 bg-[#121212] rounded-lg border border-[#2a2a2a] hover:border-[#00ff9d]/50 transition-colors group">
              <div className="w-10 h-10 bg-[#1a1a1a] rounded-lg flex items-center justify-center mb-4 border border-[#2a2a2a] group-hover:border-[#00ff9d]/30">
                <Wrench className="text-[#00b8ff]" size={20} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Servicios Técnicos</h3>
              <p className="text-slate-500 text-sm font-sans">Registra reparaciones, limpieza física y digital, instalación de SO y más.</p>
            </div>

            <div className="p-6 bg-[#121212] rounded-lg border border-[#2a2a2a] hover:border-[#00ff9d]/50 transition-colors group">
              <div className="w-10 h-10 bg-[#1a1a1a] rounded-lg flex items-center justify-center mb-4 border border-[#2a2a2a] group-hover:border-[#00ff9d]/30">
                <HardDrive className="text-[#ff0055]" size={20} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Actualizaciones</h3>
              <p className="text-slate-500 text-sm font-sans">Controla los cambios de hardware (RAM, SSD) y software de cada equipo.</p>
            </div>

            <div className="p-6 bg-[#121212] rounded-lg border border-[#2a2a2a] hover:border-[#00ff9d]/50 transition-colors group">
              <div className="w-10 h-10 bg-[#1a1a1a] rounded-lg flex items-center justify-center mb-4 border border-[#2a2a2a] group-hover:border-[#00ff9d]/30">
                <Cpu className="text-[#ffcc00]" size={20} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Compatibilidad</h3>
              <p className="text-slate-500 text-sm font-sans">Evalúa si los componentes que deseas instalar son aptos para el equipo.</p>
            </div>

            <div className="p-6 bg-[#121212] rounded-lg border border-[#2a2a2a] hover:border-[#00ff9d]/50 transition-colors group">
              <div className="w-10 h-10 bg-[#1a1a1a] rounded-lg flex items-center justify-center mb-4 border border-[#2a2a2a] group-hover:border-[#00ff9d]/30">
                <FileText className="text-[#00ff9d]" size={20} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Reportes en PDF</h3>
              <p className="text-slate-500 text-sm font-sans">Genera reportes detallados de servicios con un solo clic para tus clientes.</p>
            </div>

            <div className="p-6 bg-[#121212] rounded-lg border border-[#2a2a2a] hover:border-[#00ff9d]/50 transition-colors group">
              <div className="w-10 h-10 bg-[#1a1a1a] rounded-lg flex items-center justify-center mb-4 border border-[#2a2a2a] group-hover:border-[#00ff9d]/30">
                <BarChart3 className="text-[#00b8ff]" size={20} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Estadísticas</h3>
              <p className="text-slate-500 text-sm font-sans">Visualiza gráficos de rendimiento y tendencias de tu negocio.</p>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-[#121212] border-t border-[#2a2a2a] py-6 text-center mt-auto">
        <p className="text-slate-500 text-xs font-mono">© {new Date().getFullYear()} Revtek - Terminal de Gestión Técnica v1.0.0</p>
      </footer>
    </div>
  );
};