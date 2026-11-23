import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, LogIn, RefreshCw, AlertTriangle, ChevronLeft, Settings, Zap } from 'lucide-react';
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
      <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
        <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-xl border border-slate-200 text-center animate-in fade-in zoom-in duration-300">
          <div className="mx-auto w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
            <AlertTriangle className="h-10 w-10 text-red-500" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800">Sistema Bloqueado</h1>
          <p className="text-slate-500 mt-3">Demasiados intentos fallidos por seguridad.</p>
          <div className="bg-slate-50 rounded-xl p-6 mt-8 border border-slate-200">
            <p className="text-5xl font-black text-red-500">{timeLeft}s</p>
            <p className="text-sm font-medium text-slate-400 mt-2 uppercase tracking-wide">Tiempo restante</p>
          </div>
        </div>
      </div>
    );
  }

  // --- VISTA PRINCIPAL DEL LOGIN ---
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4 relative">
      
      {/* Botón para volver al inicio */}
      <Link 
        to="/" 
        className="absolute top-6 left-6 md:top-8 md:left-10 flex items-center text-slate-500 hover:text-[#1152d4] font-medium transition-colors"
      >
        <ChevronLeft size={20} className="mr-1" /> Volver al inicio
      </Link>

      {/* Tarjeta Central */}
      <div className="w-full max-w-md bg-white p-8 md:p-10 rounded-2xl shadow-2xl border border-slate-200">
        
        {/* Encabezado con el nuevo Logo */}
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="bg-gradient-to-br from-[#1152d4] to-[#0a3a9c] p-3 rounded-2xl shadow-lg mb-4 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
            <div className="relative">
              <Settings className="text-white h-8 w-8" />
              <Zap className="text-yellow-300 h-4 w-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
          </div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tighter uppercase">Revtek</h1>
          <p className="text-slate-500 mt-2 font-medium">Ingresa a tu cuenta</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Correo electrónico</label>
            <input 
              type="email" 
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-[#1152d4] focus:ring-4 focus:ring-[#1152d4]/10 outline-none transition-all bg-slate-50 focus:bg-white" 
              placeholder="admin@revtek.com" 
              {...register('email')} 
            />
            {errors.email && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Contraseña</label>
            <div className="relative">
              <input 
                type={showPass ? 'text' : 'password'} 
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-[#1152d4] focus:ring-4 focus:ring-[#1152d4]/10 outline-none transition-all bg-slate-50 focus:bg-white pr-12" 
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
            <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
              <ShieldCheck size={16} className="text-[#1152d4]" /> Verificación de Seguridad
            </label>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 font-mono text-lg bg-white px-4 py-2 rounded-lg border border-slate-300 select-none shadow-sm">
                <span>{num1}</span> <span className="text-slate-400">+</span> <span>{num2}</span> <span className="text-slate-400">=</span>
              </div>
              <input 
                type="number" 
                className="w-20 px-3 py-2 text-center rounded-lg border border-slate-300 focus:border-[#1152d4] outline-none font-bold text-lg bg-white" 
                placeholder="?" 
                value={captchaInput} 
                onChange={(e) => setCaptchaInput(e.target.value)} 
              />
              <button 
                type="button" 
                onClick={generateCaptcha} 
                className="p-2.5 text-slate-500 hover:bg-white hover:text-[#1152d4] rounded-lg transition-colors border border-transparent hover:border-slate-300"
                title="Generar nuevo CAPTCHA"
              >
                <RefreshCw className="h-5 w-5" />
              </button>
            </div>
            {captchaError && <p className="text-red-500 text-xs mt-2 font-medium">{captchaError}</p>}
          </div>

          {/* Botón Submit */}
          <button 
            type="submit" 
            className="w-full bg-[#1152d4] text-white py-3.5 rounded-xl font-bold text-lg hover:bg-[#0f4bc4] transition-all flex justify-center items-center shadow-lg shadow-blue-500/30 mt-2 transform active:scale-[0.98]"
          >
            <LogIn className="h-5 w-5 mr-2" /> Ingresar al sistema
          </button>
        </form>

        {/* Links inferiores */}
        <div className="mt-8 flex flex-col gap-3 text-center text-sm">
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
  );
}