import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, LogIn, RefreshCw, AlertTriangle, ChevronLeft, User, ShieldCheck } from 'lucide-react';
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
      navigate('/app/dashboard'); // <-- RUTA CORREGIDA

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

  if (isLocked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#002b49] p-4 font-sans">
        <div className="text-center text-white animate-in fade-in duration-500">
          <AlertTriangle className="h-20 w-20 text-red-400 mx-auto mb-4" />
          <h1 className="text-3xl font-light mb-2">Sistema Bloqueado</h1>
          <p className="text-blue-200 mb-8">Demasiados intentos fallidos.</p>
          <div className="text-6xl font-thin mb-4">{timeLeft}</div>
          <p className="text-sm text-blue-300">segundos restantes</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center font-sans overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#003b70] via-[#002b49] to-[#001f33] z-0">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/3"></div>
      </div>

      <Link to="/" className="absolute top-8 left-8 text-blue-200 hover:text-white flex items-center z-20 transition-opacity">
        <ChevronLeft size={20} className="mr-1" /> Volver al inicio
      </Link>

      <div className="relative z-10 w-full max-w-sm flex flex-col items-center animate-in slide-in-from-bottom-8 duration-700">
        
        <div className="w-32 h-32 bg-slate-300/30 backdrop-blur-md rounded-full flex items-center justify-center mb-4 border border-white/20 shadow-2xl">
          <User size={64} className="text-white/80" strokeWidth={1.5} />
        </div>
        
        <h1 className="text-3xl text-white mb-8 font-light tracking-wide drop-shadow-md">Iniciar Sesión</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
          <div className="relative">
            <input 
              type="email" 
              placeholder="Correo electrónico"
              className="w-full bg-white/10 backdrop-blur-sm border-b-2 border-white/30 px-4 py-3 text-white placeholder-white/50 outline-none focus:border-white focus:bg-white/20 transition-all rounded-t-sm"
              {...register('email')} 
            />
            {errors.email && <p className="text-red-300 text-xs mt-1 absolute -bottom-5">{errors.email.message}</p>}
          </div>

          <div className="relative mt-6">
            <input 
              type={showPass ? 'text' : 'password'} 
              placeholder="Contraseña"
              className="w-full bg-white/10 backdrop-blur-sm border-b-2 border-white/30 px-4 py-3 text-white placeholder-white/50 outline-none focus:border-white focus:bg-white/20 transition-all rounded-t-sm pr-12"
              {...register('password')} 
            />
            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white">
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            {errors.password && <p className="text-red-300 text-xs mt-1 absolute -bottom-5">{errors.password.message}</p>}
          </div>

          <div className="mt-8 bg-black/20 p-4 rounded-lg backdrop-blur-md border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/80 text-sm flex items-center gap-2"><ShieldCheck size={16}/> Verificación de seguridad</span>
              <button type="button" onClick={generateCaptcha} className="text-white/60 hover:text-white"><RefreshCw size={14} /></button>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-white font-mono bg-white/10 px-3 py-1 rounded select-none">{num1} + {num2} =</span>
              <input 
                type="number" 
                placeholder="?"
                className="w-16 bg-transparent border-b border-white/40 text-white text-center outline-none focus:border-white font-bold"
                value={captchaInput} 
                onChange={(e) => setCaptchaInput(e.target.value)} 
              />
            </div>
            {captchaError && <p className="text-red-300 text-xs mt-2">{captchaError}</p>}
          </div>

          <button 
            type="submit" 
            className="w-full mt-6 bg-[#0067b8] hover:bg-[#005da6] text-white py-3 rounded-sm font-semibold transition-colors shadow-lg flex items-center justify-center"
          >
            <LogIn className="h-4 w-4 mr-2" /> Entrar
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-white/60 flex flex-col gap-2">
          <Link to="/forgot-password" className="hover:text-white transition-colors">¿Olvidaste tu contraseña?</Link>
          <div className="flex items-center gap-1">
            <span>¿No tienes cuenta?</span>
            <Link to="/register" className="text-blue-300 hover:text-white font-semibold">Regístrate</Link>
          </div>
        </div>
      </div>
    </div>
  );
}