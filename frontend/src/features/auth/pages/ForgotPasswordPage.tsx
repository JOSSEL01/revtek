import { useState } from 'react';
import { Link } from 'react-router-dom';
import { KeyRound, ArrowLeft, Mail } from 'lucide-react';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(email) setSent(true);
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-br from-blue-100 via-slate-50 to-blue-50">
      <div className="w-full max-w-md bg-white/70 backdrop-blur-xl p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50">
        
        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center mb-4">
            <KeyRound className="h-6 w-6 text-brand-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Recuperar Contraseña</h1>
          <p className="text-sm text-slate-500 mt-1">Te enviaremos un enlace a tu correo.</p>
        </div>

        {sent ? (
          <div className="text-center space-y-4">
            <div className="p-4 bg-emerald-50/80 text-emerald-700 rounded-lg text-sm border border-emerald-200">
              <Mail className="h-6 w-6 mx-auto mb-2" />
              Se ha enviado un enlace de recuperación simulado a <strong>{email}</strong>.
            </div>
            <Link to="/login" className="btn-secondary w-full py-2">Volver al Login</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="form-label">Correo electrónico</label>
              <input 
                type="email" 
                className="input-field bg-white/50" 
                placeholder="tu@correo.com" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn-primary w-full shadow-lg shadow-brand-500/30 py-3">Enviar enlace</button>
          </form>
        )}

        {!sent && (
          <div className="mt-6 text-center">
            <Link to="/login" className="text-sm text-slate-500 hover:text-brand-600 flex items-center justify-center gap-1 transition font-medium">
              <ArrowLeft className="h-4 w-4" /> Volver al login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}