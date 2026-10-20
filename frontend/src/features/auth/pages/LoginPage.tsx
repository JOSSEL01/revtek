import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, LogIn, RefreshCw, ShieldCheck, AlertTriangle } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import { logsService } from '../../logs/logsService';

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

  // Estados para el bloqueo de 3 intentos
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  // Efecto para el contador regresivo del bloqueo
  useEffect(() => {
    if (isLocked && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      setIsLocked(false);
      setAttempts(0);
    }
  }, [isLocked, timeLeft]);

  // Generar CAPTCHA al cargar
  useEffect(() => {
    setNum1(Math.floor(Math.random() * 10) + 1);
    setNum2(Math.floor(Math.random() * 10) + 1);
  }, []);

  const generateCaptcha = () => {
    setNum1(Math.floor(Math.random() * 10) + 1);
    setNum2(Math.floor(Math.random() * 10) + 1);
    setCaptchaInput('');
    setCaptchaError('');
  };

  const onSubmit = (data: LoginForm) => {
    if (isLocked) return;

    // 1. Validar CAPTCHA
    if (Number(captchaInput) !== num1 + num2) {
      setCaptchaError('El resultado del CAPTCHA es incorrecto.');
      generateCaptcha();
      return;
    }
    
    // 2. Validar Contraseña (La contraseña es "admin123")
    if (data.password !== 'admin123') {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      generateCaptcha(); // Regeneramos el captcha al fallar
      
      if (newAttempts >= 3) {
        setIsLocked(true);
        setTimeLeft(30);
        alert('Superaste los 3 intentos fallidos. Sistema bloqueado por 30 segundos.');
      } else {
        alert(`Contraseña incorrecta. Intento ${newAttempts} de 3.`);
      }
      return;
    }
    
    // 3. Login exitoso
    loginStore.login(
      { id: '1', fullName: 'Administrador Revtek', email: data.email, role: 'admin', active: true },
      'fake-jwt-token-123'
    );
    
    logsService.register(data.email, 'ingreso');
    navigate('/dashboard');
  };

  if (isLocked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
        <div className="card w-full max-w-md text-center py-10">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-800">Sistema Bloqueado</h1>
          <p className="text-slate-500 mt-2">Demasiados intentos fallidos.</p>
          <p className="text-3xl font-bold text-brand-600 mt-6">{timeLeft} seg</p>
          <p className="text-sm text-slate-400 mt-2">Por favor, espera para volver a intentar.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <div className="card w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 bg-brand-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-brand-500/30">
            <ShieldCheck className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Revtek</h1>
          <p className="text-sm text-slate-500 mt-1">Ingresa a tu cuenta</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="form-label">Correo electrónico</label>
            <input type="email" className="input-field" placeholder="admin@revtek.com" {...register('email')} />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="form-label">Contraseña</label>
            <div className="relative">
              <input type={showPass ? 'text' : 'password'} className="input-field pr-10" placeholder="Prueba con: admin123" {...register('password')} />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition">
                {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <label className="form-label mb-2">Verificación de seguridad</label>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 font-mono text-lg bg-white px-3 py-1.5 rounded border border-slate-300 select-none">
                <span>{num1}</span> <span>+</span> <span>{num2}</span> <span>=</span>
              </div>
              <input type="number" className="input-field max-w-[80px] text-center" placeholder="?" value={captchaInput} onChange={(e) => setCaptchaInput(e.target.value)} />
              <button type="button" onClick={generateCaptcha} className="p-2 text-slate-500 hover:bg-slate-200 hover:text-brand-600 rounded-lg transition">
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
            {captchaError && <p className="text-red-500 text-xs mt-1">{captchaError}</p>}
          </div>

          <button type="submit" className="btn-primary w-full mt-2 py-3">
            <LogIn className="h-4 w-4" /> Ingresar al sistema
          </button>
        </form>

        <div className="mt-6 flex flex-col gap-3 text-center text-sm">
          <Link to="/forgot-password" className="text-slate-500 hover:text-brand-600 transition">
            ¿Olvidaste tu contraseña?
          </Link>
          <span className="text-slate-500">
            ¿No tienes cuenta? <Link to="/register" className="text-brand-600 font-medium hover:underline">Regístrate aquí</Link>
          </span>
        </div>
      </div>
    </div>
  );
}