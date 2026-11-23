import { useNavigate, Link } from 'react-router-dom';
import { Monitor, Smartphone, Laptop, Wrench, ShieldCheck, ChevronRight, HardDrive, FileText, BarChart3, Users, Settings } from 'lucide-react';

export const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      
      {/* NAVBAR: Único lugar para Iniciar Sesión y Registrarse */}
      <nav className="bg-white border-b border-slate-200 py-4 px-6 md:px-12 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="bg-[#1152d4] p-2 rounded-lg">
            <ShieldCheck className="text-white h-6 w-6" />
          </div>
          <span className="text-2xl font-black text-slate-800 tracking-tight">REVTEK</span>
        </div>

        <div className="flex items-center gap-6">
          <Link to="/login" className="text-slate-600 hover:text-[#1152d4] font-bold transition-colors hidden md:block">
            Iniciar Sesión
          </Link>
          <Link 
            to="/register"
            className="bg-[#1152d4] text-white px-6 py-2.5 rounded-lg font-bold hover:bg-[#0f4bc4] transition-all shadow-md"
          >
            Registrarse
          </Link>
        </div>
      </nav>

      {/* HERO SECTION: La bienvenida principal */}
      <div className="flex flex-col md:flex-row bg-[#1152d4] relative overflow-hidden text-white">
        {/* Círculos decorativos */}
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-[#1e65f3] rounded-full mix-blend-multiply filter blur-3xl opacity-60"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] bg-[#0f4bc4] rounded-full mix-blend-multiply filter blur-3xl opacity-60"></div>

        <div className="md:w-1/2 relative z-10 p-12 md:p-20 flex flex-col justify-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight leading-tight">
            Optimiza, Repara y <br/> Gestiona tus Equipos.
          </h1>
          <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-lg">
            Revtek es el sistema integral para tu servicio técnico. Administra clientes, equipos, actualizaciones de hardware y software, todo en un solo lugar.
          </p>
          <div className="flex gap-4">
            <button 
              onClick={() => navigate('/login')}
              className="bg-white text-[#1152d4] px-8 py-3.5 rounded-lg font-bold text-lg hover:bg-blue-50 transition-all shadow-xl"
            >
              Entrar al Sistema
            </button>
          </div>
        </div>

        <div className="md:w-1/2 relative z-10 flex items-center justify-center p-12">
          {/* Aquí podrías poner una imagen real o los iconos grandes */}
          <div className="flex gap-6 bg-white/10 p-8 rounded-3xl backdrop-blur-md border border-white/20 shadow-2xl">
            <Monitor size={80} className="text-white opacity-90" />
            <Laptop size={80} className="text-white opacity-90" />
            <Smartphone size={80} className="text-white opacity-90" />
          </div>
        </div>
      </div>

      {/* SECCIÓN DE CARACTERÍSTICAS (La muestra de todo lo que hacemos) */}
      <div className="py-20 px-6 md:px-12 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Todo lo que puedes hacer en Revtek</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Un ecosistema completo diseñado para facilitar la gestión de tu taller técnico.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Tarjeta 1 */}
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <Users className="text-[#1152d4]" size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Gestión de Clientes</h3>
              <p className="text-slate-500">Administra la información de tus clientes y mantén un historial de sus equipos.</p>
            </div>

            {/* Tarjeta 2 */}
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <Wrench className="text-[#1152d4]" size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Servicios Técnicos</h3>
              <p className="text-slate-500">Registra reparaciones, limpieza física y digital, instalación de SO y más.</p>
            </div>

            {/* Tarjeta 3 */}
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <HardDrive className="text-[#1152d4]" size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Actualizaciones</h3>
              <p className="text-slate-500">Controla los cambios de hardware (RAM, SSD) y software de cada equipo.</p>
            </div>

            {/* Tarjeta 4 */}
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <Settings className="text-[#1152d4]" size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Compatibilidad</h3>
              <p className="text-slate-500">Evalúa si los componentes que deseas instalar son aptos para el equipo.</p>
            </div>

            {/* Tarjeta 5 */}
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <FileText className="text-[#1152d4]" size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Reportes en PDF</h3>
              <p className="text-slate-500">Genera reportes detallados de servicios con un solo clic para tus clientes.</p>
            </div>

            {/* Tarjeta 6 */}
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <BarChart3 className="text-[#1152d4]" size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Estadísticas</h3>
              <p className="text-slate-500">Visualiza gráficos de rendimiento y tendencias de tu negocio.</p>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER SIMPLE */}
      <footer className="bg-slate-900 text-slate-400 py-8 text-center mt-auto">
        <p>© {new Date().getFullYear()} Revtek - Sistema de Gestión de Servicio Técnico.</p>
      </footer>
    </div>
  );
};