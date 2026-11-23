import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UserPlus, ArrowLeft, Terminal, ShieldAlert, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { PasswordStrength } from '../../../components/PasswordStrength';
import { authService } from '../authService';

const registerSchema = z.object({
  fullName: z.string().min(3, 'El nombre es muy corto'),
  email: z.string().email('Correo inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const navigate = useNavigate();
  const [passwordValue, setPasswordValue] = useState('');
  const [showPass, setShowPass] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterForm) => {
    try {
      authService.register({
        fullName: data.fullName,
        email: data.email,
        password: data.password
      });
      alert('¡Usuario registrado con éxito! Ahora puedes iniciar sesión.');
      navigate('/login');
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#1e1e1e] font-mono text-slate-300">
      
      {/* Panel Lateral Izquierdo (Estilo Ubuntu) */}
      <div className="hidden md:flex flex-col w-1/3 bg-[#2c001e] p-12 justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 text-2xl font-bold text-white mb-12">
            <Terminal size={32} className="text-[#e95420]" /> REVTEK.SYS
          </div>
          <h2 className="text-4xl font-light text-white mb-4 leading-tight">Nueva<br/>Instalación</h2>
          <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
            Configurando un nuevo entorno de usuario. Por favor, introduzca los parámetros requeridos para el registro en el sistema.
          </p>
        </div>

        {/* Simulación de consola */}
        <div className="relative z-10 text-xs text-slate-500 font-mono space-y-1">
          <p className="text-green-500">[OK] Cargando módulos del sistema...</p>
          <p className="text-green-500">[OK] Entorno gráfico listo.</p>
          <p className="text-green-500">[OK] Servicio de autenticación en línea.</p>
          <p className="animate-pulse text-[#e95420]">_ Esperando datos del usuario...</p>
        </div>
      </div>

      {/* Área del Formulario */}
      <div className="w-full md:w-2/3 flex items-center justify-center p-6 relative">
        <Link to="/login" className="absolute top-8 right-8 text-slate-500 hover:text-white flex items-center text-sm transition-colors">
          <ArrowLeft size={16} className="mr-2" /> Volver al Login
        </Link>

        <div className="w-full max-w-md bg-[#252526] p-8 rounded-lg shadow-2xl border border-[#3e3e42]">
          <div className="mb-8 border-b border-[#3e3e42] pb-4">
            <h1 className="text-2xl text-white font-bold flex items-center gap-2">
              <UserPlus size={24} className="text-[#e95420]" /> Registro de Usuario
            </h1>
            <p className="text-xs text-slate-500 mt-2">Complete el formulario para crear una cuenta en el sistema.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Nombre Completo</label>
              <input 
                type="text" 
                className="w-full bg-[#1e1e1e] border border-[#3e3e42] text-white px-4 py-2.5 rounded focus:border-[#e95420] focus:ring-1 focus:ring-[#e95420] outline-none transition-all font-sans text-sm" 
                placeholder="Ej. Juan Pérez" 
                {...register('fullName')} 
              />
              {errors.fullName && <p className="text-[#e95420] text-xs mt-1.5 flex items-center gap-1"><ShieldAlert size={12}/> {errors.fullName.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Correo Electrónico</label>
              <input 
                type="email" 
                className="w-full bg-[#1e1e1e] border border-[#3e3e42] text-white px-4 py-2.5 rounded focus:border-[#e95420] focus:ring-1 focus:ring-[#e95420] outline-none transition-all font-sans text-sm" 
                placeholder="tu@correo.com" 
                {...register('email')} 
              />
              {errors.email && <p className="text-[#e95420] text-xs mt-1.5 flex items-center gap-1"><ShieldAlert size={12}/> {errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Contraseña</label>
              <div className="relative">
                <input 
                  type={showPass ? 'text' : 'password'} 
                  className="w-full bg-[#1e1e1e] border border-[#3e3e42] text-white px-4 py-2.5 rounded focus:border-[#e95420] focus:ring-1 focus:ring-[#e95420] outline-none transition-all font-sans text-sm pr-10" 
                  placeholder="••••••••" 
                  {...register('password', {
                    onChange: (e) => setPasswordValue(e.target.value)
                  })} 
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <PasswordStrength password={passwordValue} />
              {errors.password && <p className="text-[#e95420] text-xs mt-1.5 flex items-center gap-1"><ShieldAlert size={12}/> {errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Confirmar Contraseña</label>
              <input 
                type="password" 
                className="w-full bg-[#1e1e1e] border border-[#3e3e42] text-white px-4 py-2.5 rounded focus:border-[#e95420] focus:ring-1 focus:ring-[#e95420] outline-none transition-all font-sans text-sm" 
                placeholder="••••••••" 
                {...register('confirmPassword')} 
              />
              {errors.confirmPassword && <p className="text-[#e95420] text-xs mt-1.5 flex items-center gap-1"><ShieldAlert size={12}/> {errors.confirmPassword.message}</p>}
            </div>

            <button 
              type="submit" 
              className="w-full mt-8 bg-[#e95420] hover:bg-[#c74315] text-white py-3 rounded font-bold text-sm tracking-wide transition-all shadow-lg flex justify-center items-center gap-2"
            >
              <CheckCircle2 size={18} /> Crear Cuenta
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}