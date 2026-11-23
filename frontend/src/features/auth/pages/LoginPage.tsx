import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, LogIn, RefreshCw, AlertTriangle, ChevronLeft, User, Terminal } from 'lucide-react';
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
      loginStore.login({ id: user.id, fullName: user.fullName, email: user.email, role: user.role, active: true }, 'fake-jwt-token-123');
      logsService.register(data.email, 'ingreso');
      navigate('/app/dashboard');
    } catch (error: any) {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      generateCaptcha();
      if (newAttempts >= 3) {
        setIsLocked(true);
        setTimeLeft(30);
      } else {
        alert(`${error.message} Intento ${newAttempts} de 3.`);
      }
    }
  };

  if (isLocked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] p-4 font-mono">
        <div className="text-center text-white">
          <AlertTriangle className="h-20 w-20 text-[#ff0055] mx-auto mb-4" />
          <h1 className="text-3xl font-light mb-2 text-white">ACCESS_DENIED</h1>
          <p className="text-slate-400 mb-8">Too many failed attempts.</p>
          <div className="text-6xl font-thin mb-4 text-[#ff0055]">{timeLeft}</div>
          <p className="text-sm text-slate-500">seconds remaining...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center font-mono overflow-hidden bg-[#0a0a0a]">
      <Link to="/" className="absolute top-6 left-6 text-[#00ff9d] hover:text-white flex items-center z-20 transition-opacity">
        <ChevronLeft size={20} className="mr-1" /> cd ..
      </Link>

      <div className="relative z-10 w-full max-w-sm flex flex-col items-center">
        
        <div className="w-24 h-24 bg-[#121212] border border-[#2a2a2a] rounded-xl flex items-center justify-center mb-6 shadow-2xl">
          <Terminal size={48} className="text-[#00ff9d]" strokeWidth={1.5} />
        </div>
        
        <h1 className="text-2xl text-white mb-2 font-bold">user@revtek:~# ./login.sh</h1>
        <p className="text-slate-500 text-xs mb-8">Please enter your credentials to continue.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
          <div>
            <label className="block text-xs text-[#00ff9d] mb-1">EMAIL:</label>
            <input 
              type="email" 
              placeholder="admin@revtek.com"
              className="w-full bg-[#121212] border border-[#2a2a2a] px-4 py-2 text-white outline-none focus:border-[#00ff9d] transition-all rounded text-sm"
              {...register('email')} 
            />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-xs text-[#00ff9d] mb-1">PASSWORD:</label>
            <div className="relative">
              <input 
                type={showPass ? 'text' : 'password'} 
                placeholder="••••••••"
                className="w-full bg-[#121212] border border-[#2a2a2a] px-4 py-2 text-white outline-none focus:border-[#00ff9d] transition-all rounded pr-10 text-sm"
                {...register('password')} 
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-[#00ff9d]">
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <div className="bg-[#121212] p-4 rounded border border-[#2a2a2a] mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[#00ff9d] text-xs">CAPTCHA_VERIFY:</span>
              <button type="button" onClick={generateCaptcha} className="text-slate-500 hover:text-white"><RefreshCw size={12} /></button>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-white font-mono bg-[#1a1a1a] px-3 py-1 rounded border border-[#2a2a2a] select-none text-sm">{num1} + {num2} =</span>
              <input 
                type="number" 
                placeholder="?"
                className="w-16 bg-[#1a1a1a] border border-[#2a2a2a] text-white text-center outline-none focus:border-[#00ff9d] rounded py-1"
                value={captchaInput} 
                onChange={(e) => setCaptchaInput(e.target.value)} 
              />
            </div>
            {captchaError && <p className="text-red-400 text-xs mt-2">{captchaError}</p>}
          </div>

          <button 
            type="submit" 
            className="w-full mt-6 bg-[#00ff9d] hover:bg-[#00cc7d] text-black py-2.5 rounded font-bold transition-colors flex items-center justify-center text-sm"
          >
            <LogIn className="h-4 w-4 mr-2" /> EXECUTE
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500 flex flex-col gap-2">
          <Link to="/forgot-password" className="hover:text-[#00ff9d] transition-colors"># forgot_password?</Link>
          <div className="flex items-center justify-center gap-1">
            <span># no account?</span>
            <Link to="/register" className="text-[#00ff9d] hover:underline">./register.sh</Link>
          </div>
        </div>
      </div>
    </div>
  );
}