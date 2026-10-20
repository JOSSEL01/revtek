import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UserPlus, ArrowLeft } from 'lucide-react';
import { PasswordStrength } from '../../../components/PasswordStrength';

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

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterForm) => {
    // Simulamos el registro exitoso
    alert(`Usuario ${data.email} registrado con éxito (Simulado).`);
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 py-12">
      <div className="card w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 bg-brand-600 rounded-xl flex items-center justify-center mb-4">
            <UserPlus className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Crear Cuenta</h1>
          <p className="text-sm text-slate-500 mt-1">Regístrate como técnico en Revtek</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="form-label">Nombre Completo</label>
            <input type="text" className="input-field" placeholder="Ej. Juan Pérez" {...register('fullName')} />
            {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
          </div>

          <div>
            <label className="form-label">Correo electrónico</label>
            <input type="email" className="input-field" placeholder="tu@correo.com" {...register('email')} />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="form-label">Contraseña</label>
            <input 
              type="password" 
              className="input-field" 
              placeholder="••••••••" 
              {...register('password', {
                onChange: (e) => setPasswordValue(e.target.value)
              })} 
            />
            <PasswordStrength password={passwordValue} />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <div>
            <label className="form-label">Confirmar Contraseña</label>
            <input type="password" className="input-field" placeholder="••••••••" {...register('confirmPassword')} />
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
          </div>

          <button type="submit" className="btn-primary w-full mt-6">
            <UserPlus className="h-4 w-4" /> Registrarme
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/login" className="text-sm text-slate-500 hover:text-brand-600 flex items-center justify-center gap-1">
            <ArrowLeft className="h-4 w-4" /> Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </div>
  );
}