import { useEffect, useState } from 'react';
import { Plus, Trash2, Search, Sparkles } from 'lucide-react';
import { cleaningService } from './cleaningService';
import type { Cleaning } from '../../types';
import { TableSkeleton } from '../../components/TableSkeleton';
import { Toast } from '../../components/Toast';
import { useAuthStore } from '../../store/authStore';

export function CleaningPage() {
  const [items, setItems] = useState<Cleaning[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ deviceId: '', type: 'fisica' as const, notes: '', date: new Date().toISOString().split('T')[0] });
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  const user = useAuthStore(state => state.user);

  const loadItems = () => {
    setIsLoading(true);
    cleaningService.list().then((data) => {
      setItems(data);
      setIsLoading(false);
    });
  };

  useEffect(() => { loadItems(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await cleaningService.create(formData);
    setFormData({ deviceId: '', type: 'fisica', notes: '', date: new Date().toISOString().split('T')[0] });
    setIsModalOpen(false);
    loadItems();
    setToast({ message: 'Limpieza registrada exitosamente', type: 'success' });
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Eliminar este registro?')) {
      await cleaningService.delete(id);
      loadItems();
      setToast({ message: 'Registro eliminado', type: 'success' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Gestión de Limpieza</h1>
          <p className="text-slate-500 text-sm mt-1">Registra la limpieza física y digital de los equipos.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary w-fit">
          <Plus className="h-4 w-4" /> Nuevo Registro
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input type="text" placeholder="Buscar limpieza..." className="input-field pl-10 bg-white" />
      </div>

      <div className="card p-0 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
        {isLoading ? (
          <TableSkeleton />
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Tipo</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Notas</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Fecha</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-slate-500">
                    <Sparkles className="h-12 w-12 text-slate-300 mb-3 mx-auto" />
                    <p>No hay registros de limpieza.</p>
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full capitalize">
                        {item.type}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-slate-600 truncate max-w-[300px]">{item.notes}</td>
                    <td className="p-4 text-sm text-slate-600">{item.date}</td>
                    <td className="p-4 text-right flex justify-end">
                      {user?.role === 'admin' && (
                        <button onClick={() => handleDelete(item.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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
            <h2 className="text-xl font-bold mb-6">Registrar Limpieza</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="form-label">ID del Equipo</label>
                <input required className="input-field" placeholder="Ej. 1234" value={formData.deviceId} onChange={e => setFormData({...formData, deviceId: e.target.value})} />
              </div>
              <div>
                <label className="form-label">Tipo de Limpieza</label>
                <select className="input-field" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as any})}>
                  <option value="fisica">Física (Aire comprimido, pasta térmica)</option>
                  <option value="digital">Digital (Antivirus, optimización)</option>
                </select>
              </div>
              <div>
                <label className="form-label">Notas adicionales</label>
                <input required className="input-field" placeholder="Detalles de la limpieza..." value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} />
              </div>
              <div>
                <label className="form-label">Fecha</label>
                <input required type="date" className="input-field" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancelar</button>
                <button type="submit" className="btn-primary">Guardar Registro</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}