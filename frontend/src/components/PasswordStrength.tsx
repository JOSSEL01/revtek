import { useMemo } from 'react';

export function PasswordStrength({ password }: { password: string }) {
  const strength = useMemo(() => {
    if (!password) return { score: 0, label: '', color: 'bg-slate-200' };
    
    let score = 0;
    if (password.length > 7) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1; // Símbolos

    if (score <= 1) return { score: 1, label: 'Débil', color: 'bg-red-500' };
    if (score === 2 || score === 3) return { score: 2, label: 'Intermedio', color: 'bg-amber-500' };
    return { score: 3, label: 'Fuerte', color: 'bg-emerald-500' };
  }, [password]);

  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-slate-500">Seguridad de la contraseña:</span>
        <span className={`text-xs font-bold ${
          strength.score === 1 ? 'text-red-500' : 
          strength.score === 2 ? 'text-amber-500' : 'text-emerald-500'
        }`}>
          {strength.label}
        </span>
      </div>
      <div className="flex gap-1 h-1.5 w-full">
        <div className={`flex-1 rounded-full ${strength.score >= 1 ? strength.color : 'bg-slate-200'}`} />
        <div className={`flex-1 rounded-full ${strength.score >= 2 ? strength.color : 'bg-slate-200'}`} />
        <div className={`flex-1 rounded-full ${strength.score >= 3 ? strength.color : 'bg-slate-200'}`} />
      </div>
    </div>
  );
}