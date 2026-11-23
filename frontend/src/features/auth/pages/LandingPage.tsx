import { useNavigate, Link } from 'react-router-dom';
import { Monitor, Smartphone, Laptop, Wrench, ShieldCheck, ChevronRight, HardDrive, LogIn } from 'lucide-react';

export const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      
      {/* NAVBAR */}
      <nav className="bg-white border-b border-slate-200 py-4 px-6 md:px-12 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="bg-[#1152d4] p-2 rounded-lg">
            <ShieldCheck className="text-white h-6 w-6" />
          </div>
          <span className="text-2xl font-black text-slate-800 tracking-tight">REVTEK</span>
        </div>

        <div className="flex items-center gap-6">
          <Link to="/login" className="hidden md:flex items-center text-slate-600 hover:text-[#1152d4] font-bold transition-colors">
            <LogIn size={18} className="mr-2" /> Entrar
          </Link>
          <button 
            onClick={() => navigate('/login')}
            className="bg-[#1152d4] text-white px-6 py-2.5 rounded-lg font-bold hover:bg-[#0f4bc4] transition-all shadow-md"
          >
            Iniciar Sesión
          </button>
        </div>
      </nav>

      {/* CONTENIDO PRINCIPAL (El diseño split-screen anterior) */}
      <div className="flex-1 flex flex-col md:flex-row">
        
        {/* Lado Izquierdo: Branding */}
        <div className="md:w-1/2 bg-[#1152d4] relative overflow-hidden flex flex-col justify-center items-center p-8 md:p-12 text-white">
          <div className="absolute top-[-15%] left-[-15%] w-[400px] h-[400px] md:w-[500px] md:h-[500px] bg-[#1e65f3] rounded-full mix-blend-multiply filter blur-2xl opacity-60"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[350px] h-[350px] md:w-[450px] md:h-[450px] bg-[#0f4bc4] rounded-full mix-blend-multiply filter blur-2xl opacity-60"></div>

          <div className="relative z-10 text-center flex flex-col items-center w-full max-w-lg">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight drop-shadow-sm">
              WELCOME TO REVTEK
            </h1>
            <p className="text-base md:text-lg text-blue-100 mb-10 max-w-md mx-auto leading-relaxed">
              Soluciones integrales para PC, laptops y dispositivos móviles. 
              Diagnóstico, actualización y optimización en un solo lugar.
            </p>

            <div className="flex gap-4 md:gap-8 justify-center mb-12 bg-white/10 p-5 md:p-6 rounded-2xl backdrop-blur-sm border border-white/20 shadow-lg">
              <Monitor size={48} className="text-white md:w-14 md:h-14" />
              <Laptop size={48} className="text-white md:w-14 md:h-14" />
              <Smartphone size={48} className="text-white md:w-14 md:h-14" />
            </div>
          </div>
        </div>

        {/* Lado Derecho: Información */}
        <div className="md:w-1/2 flex items-center justify-center p-8 md:p-12 bg-white">
          <div className="max-w-md w-full">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Gestión Técnica Inteligente</h2>
            <p className="text-slate-500 mb-8">Todo lo que necesitas para administrar tu taller o servicio técnico de manera eficiente.</p>

            <div className="space-y-4 mb-10">
              <div className="flex items-start p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="bg-blue-100 p-2.5 rounded-lg mr-4 shrink-0">
                  <Wrench className="text-blue-600" size={22} />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">Actualizaciones y Reparaciones</h3>
                  <p className="text-sm text-slate-500 mt-1">Control total de hardware y software de tus equipos.</p>
                </div>
              </div>
              
              <div className="flex items-start p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="bg-blue-100 p-2.5 rounded-lg mr-4 shrink-0">
                  <HardDrive className="text-blue-600" size={22} />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">Evaluación de Compatibilidad</h3>
                  <p className="text-sm text-slate-500 mt-1">Verifica si las mejoras propuestas son aptas para el equipo.</p>
                </div>
              </div>

              <div className="flex items-start p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="bg-blue-100 p-2.5 rounded-lg mr-4 shrink-0">
                  <ShieldCheck className="text-blue-600" size={22} />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">Seguridad Garantizada</h3>
                  <p className="text-sm text-slate-500 mt-1">Acceso protegido con CAPTCHA y control de intentos.</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <button 
                onClick={() => navigate('/login')}
                className="w-full bg-[#1152d4] text-white py-3.5 rounded-lg font-semibold hover:bg-[#0f4bc4] transition-colors flex justify-center items-center shadow-md"
              >
                Ir al Login <ChevronRight size={20} className="ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};