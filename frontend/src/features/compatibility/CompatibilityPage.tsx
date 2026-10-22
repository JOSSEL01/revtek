import { useEffect, useState } from 'react';
import { Plus, Trash2, ShieldCheck, Search } from 'lucide-react';
import { compatibilityService } from './compatibilityService';
import type { CompatibilityCheck } from '../../types';
import { TableSkeleton } from '../../components/TableSkeleton';
import { Toast } from '../../components/Toast';
import { useAuthStore } from '../../store/authStore';

export function CompatibilityPage() {
  const [checks, setChecks] = useState<CompatibilityCheck[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ deviceId: '', ramUpgrade: false, ssdUpgrade: false, osUpgrade: false });
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  const user = useAuthStore(state => state.user);

  const loadChecks = () => {
    setIsLoading(true);
    compatibilityService.list().then((data) => {
      setChecks(data);
      setIsLoading(false);
    });
  };

  useEffect(() => { loadChecks(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Lógica simple para determinar resultado
    let result = 'Básico (No recomendado)';
    if (formData.ramUpgrade && formData.ssdUpgrade) result = 'Óptimo para Actualizar';
    else if (formData.ssdUpgrade) result = 'Compatible con mejora de disco';
    else if (formData.ramUpgrade) result = 'Compatible con mejora de RAM';

    await compatibilityService.create({
      ...formData,
      result,
      date: new Date().toISOString().split('T')[0]
    });
    
    setFormData({ deviceId: '', ramUpgrade: false, ssdUpgrade: false, osUpgrade: false });
    setIsModalOpen(false);
    loadChecks();
    setToast({ message: 'Evaluación guardada', type: 'success' });
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Eliminar esta evaluación?')) {
      await compatibilityService.delete(id);
      loadChecks();
      setToast({ message: 'Registro eliminado', type: 'success' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Evaluación de Compatibilidad</h1>
          <p className="text-slate-500 text-sm mt-1">Determina si un equipo soporta mejoras de hardware o software.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary w-fit">
          <Plus className="h-4 w-4" /> Nueva Evaluación
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input type="text" placeholder="Buscar evaluación..." className="input-field pl-10 bg-white" />
      </div>

      <div className="card p-0 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
        {isLoading ? (
          <TableSkeleton />
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase">ID Equipo</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Resultado</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Fecha</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {checks.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-slate-500">
                    <ShieldCheck className="h-12 w-12 text-slate-300 mb-3 mx-auto" />
                    <p>No hay evaluaciones registradas.</p>
                  </td>
                </tr>
              ) : (
                checks.map((check) => (
                  <tr key={check.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 text-sm font-medium text-slate-800">{check.deviceId}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                        check.result.includes('Óptimo') ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {check.result}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-slate-600">{check.date}</td>
                    <td className="p-4 text-right flex justify-end">
                      {user?.role === 'admin' && (
                        <button onClick={() => handleDelete(check.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-6">Evaluar Compatibilidad</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="form-label">ID del Equipo</label>
                <input required className="input-field" placeholder="Ej. 1234" value={formData.deviceId} onChange={e => setFormData({...formData, deviceId: e.target.value})} />
              </div>
              
              <div className="space-y-2 p-4 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-sm font-medium text-slate-700 mb-2">Mejoras a evaluar:</p>
                <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                  <input type="checkbox" checked={formData.ramUpgrade} onChange={e => setFormData({...formData, ramUpgrade: e.target.checked})} className="rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
                  ¿Soporta ampliación de RAM?
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                  <input type="checkbox" checked={formData.ssdUpgrade} onChange={e => setFormData({...formData, ssdUpgrade: e.target.checked})} className="rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
                  ¿Soporta disco SSD?
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                  <input type="checkbox" checked={formData.osUpgrade} onChange={e => setFormData({...formData, osUpgrade: e.target.checked})} className="rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
                  ¿Soporta nuevo Sistema Operativo?
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancelar</button>
                <button type="submit" className="btn-primary">Evaluar y Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}