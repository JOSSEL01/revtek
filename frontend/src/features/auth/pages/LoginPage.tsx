import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, LogIn, RefreshCw, ShieldCheck, AlertTriangle, Monitor, Smartphone, Laptop, ChevronLeft } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import { logsService } from '../../logs/logsService';
import { authService } from '../authService';

const loginSchema = z.object({
  email: z.string().email('Correo inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});
type LoginForm = z.infer<typeof loginSchema>;

export function LoginPage() {
  const navigate = useNavigate();
  const loginStore = useAuthStore();
  
  const [showPass, setShowPass] = useState(false);
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaError, setCaptchaError] = useState('');

  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (isLocked && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      setIsLocked(false);
      setAttempts(0);
    }
  }, [isLocked, timeLeft]);

  const generateCaptcha = () => {
    setNum1(Math.floor(Math.random() * 10) + 1);
    setNum2(Math.floor(Math.random() * 10) + 1);
    setCaptchaInput('');
    setCaptchaError('');
  };

  useEffect(() => { generateCaptcha(); }, []);

  const onSubmit = (data: LoginForm) => {
    if (isLocked) return;

    if (Number(captchaInput) !== num1 + num2) {
      setCaptchaError('El resultado del CAPTCHA es incorrecto.');
      generateCaptcha();
      return;
    }
    
    try {
      const user = authService.login(data.email, data.password);
      
      loginStore.login(
        { 
          id: user.id, 
          fullName: user.fullName, 
          email: user.email, 
          role: user.role,
          active: true 
        },
        'fake-jwt-token-123'
      );
      
      logsService.register(data.email, 'ingreso');
      navigate('/app/dashboard');

    } catch (error: any) {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      generateCaptcha();
      
      if (newAttempts >= 3) {
        setIsLocked(true);
        setTimeLeft(30);
        alert('Superaste los 3 intentos fallidos. Sistema bloqueado por 30 segundos.');
      } else {
        alert(`${error.message} Intento ${newAttempts} de 3.`);
      }
    }
  };

  // --- VISTA DE BLOQUEO ---
  if (isLocked) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4 bg-slate-50">
        <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-xl border border-slate-100 text-center animate-in fade-in zoom-in duration-300">
          <div className="mx-auto w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
            <AlertTriangle className="h-10 w-10 text-red-500" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800">Sistema Bloqueado</h1>
          <p className="text-slate-500 mt-3">Demasiados intentos fallidos por seguridad.</p>
          <div className="bg-slate-50 rounded-xl p-6 mt-8 border border-slate-100">
            <p className="text-5xl font-black text-red-500">{timeLeft}s</p>
            <p className="text-sm font-medium text-slate-400 mt-2 uppercase tracking-wide">Tiempo restante</p>
          </div>
          <p className="text-sm text-slate-400 mt-6">Por favor, espera para volver a intentar.</p>
        </div>
      </div>
    );
  }

  // --- VISTA PRINCIPAL DEL LOGIN ---
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      
      {/* Lado Izquierdo: Branding Visual (Igual que la Landing) */}
      <div className="hidden md:flex md:w-1/2 bg-[#1152d4] relative overflow-hidden flex-col justify-center items-center p-12 text-white">
        <div className="absolute top-[-15%] left-[-15%] w-[400px] h-[400px] bg-[#1e65f3] rounded-full mix-blend-multiply filter blur-2xl opacity-60"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[350px] h-[350px] bg-[#0f4bc4] rounded-full mix-blend-multiply filter blur-2xl opacity-60"></div>
        
        <div className="relative z-10 text-center flex flex-col items-center">
          <div className="flex gap-6 mb-8 opacity-90">
            <Monitor size={48} />
            <Laptop size={48} />
            <Smartphone size={48} />
          </div>
          <h1 className="text-4xl font-extrabold mb-4 tracking-tight">Bienvenido de Nuevo</h1>
          <p className="text-lg text-blue-100 max-w-md">
            Accede a tu panel de control para gestionar clientes, equipos y servicios técnicos de manera eficiente.
          </p>
        </div>
      </div>

      {/* Lado Derecho: Formulario */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12 relative">
        
        {/* Botón para volver al inicio */}
        <Link to="/" className="absolute top-6 left-6 md:left-10 flex items-center text-slate-500 hover:text-[#1152d4] font-medium transition-colors">
          <ChevronLeft size={20} className="mr-1" /> Volver al inicio
        </Link>

        <div className="w-full max-w-md mt-12 md:mt-0">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Iniciar Sesión</h2>
            <p className="text-slate-500">Ingresa tus credenciales para continuar</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Correo electrónico</label>
              <input 
                type="email" 
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-[#1152d4] focus:ring-2 focus:ring-[#1152d4]/20 outline-none transition-all" 
                placeholder="admin@revtek.com" 
                {...register('email')} 
              />
              {errors.email && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Contraseña</label>
              <div className="relative">
                <input 
                  type={showPass ? 'text' : 'password'} 
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-[#1152d4] focus:ring-2 focus:ring-[#1152d4]/20 outline-none transition-all pr-12" 
                  placeholder="••••••••" 
                  {...register('password')} 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPass(!showPass)} 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  {showPass ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.password.message}</p>}
            </div>

            {/* CAPTCHA */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <ShieldCheck size={16} className="text-[#1152d4]" /> Verificación de Seguridad
              </label>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 font-mono text-lg bg-white px-4 py-2 rounded-lg border border-slate-300 select-none shadow-sm">
                  <span>{num1}</span> <span className="text-slate-400">+</span> <span>{num2}</span> <span className="text-slate-400">=</span>
                </div>
                <input 
                  type="number" 
                  className="w-20 px-3 py-2 text-center rounded-lg border border-slate-300 focus:border-[#1152d4] outline-none font-bold text-lg" 
                  placeholder="?" 
                  value={captchaInput} 
                  onChange={(e) => setCaptchaInput(e.target.value)} 
                />
                <button 
                  type="button" 
                  onClick={generateCaptcha} 
                  className="p-2.5 text-slate-500 hover:bg-white hover:text-[#1152d4] rounded-lg transition-colors border border-transparent hover:border-slate-200"
                  title="Generar nuevo CAPTCHA"
                >
                  <RefreshCw className="h-5 w-5" />
                </button>
              </div>
              {captchaError && <p className="text-red-500 text-xs mt-2 font-medium">{captchaError}</p>}
            </div>

            <button 
              type="submit" 
              className="w-full bg-[#1152d4] text-white py-3.5 rounded-lg font-bold text-lg hover:bg-[#0f4bc4] transition-all flex justify-center items-center shadow-md mt-4"
            >
              <LogIn className="h-5 w-5 mr-2" /> Ingresar al Sistema
            </button>
          </form>

          <div className="mt-8 flex flex-col gap-4 text-center text-sm">
            <Link to="/forgot-password" className="text-slate-500 hover:text-[#1152d4] transition font-medium">
              ¿Olvidaste tu contraseña?
            </Link>
            <div className="flex items-center justify-center gap-2 text-slate-500">
              <span>¿No tienes cuenta?</span>
              <Link to="/register" className="text-[#1152d4] font-bold hover:underline">
                Regístrate aquí
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}