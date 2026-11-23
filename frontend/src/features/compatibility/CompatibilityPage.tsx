import { useEffect, useState } from 'react';
import { Plus, Trash2, ShieldCheck, Search, X, Pencil, CheckCircle2, XCircle } from 'lucide-react';
import { compatibilityService } from './compatibilityService';
import { devicesService } from '../devices/devicesService';
import type { CompatibilityCheck, Device } from '../../types';
import { TableSkeleton } from '../../components/TableSkeleton';
import { Toast } from '../../components/Toast';
import { ConfirmModal } from '../../components/ConfirmModal';
import { useAuthStore } from '../../store/authStore';

export function CompatibilityPage() {
  const [checks, setChecks] = useState<CompatibilityCheck[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ deviceId: '', ramUpgrade: false, ssdUpgrade: false, osUpgrade: false });
  
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [checkToDelete, setCheckToDelete] = useState<string | null>(null);
  
  const user = useAuthStore(state => state.user);

  const loadData = async () => {
    setIsLoading(true);
    const checksData = await compatibilityService.list();
    const devicesData = await devicesService.list();
    setChecks(checksData);
    setDevices(devicesData);
    setIsLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const handleOpenModal = (item?: CompatibilityCheck) => {
    if (item) {
      setEditingId(item.id);
      setFormData({ deviceId: item.deviceId, ramUpgrade: item.ramUpgrade, ssdUpgrade: item.ssdUpgrade, osUpgrade: item.osUpgrade });
    } else {
      setEditingId(null);
      setFormData({ deviceId: '', ramUpgrade: false, ssdUpgrade: false, osUpgrade: false });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Lógica simple para determinar resultado
    let result = 'Básico (No recomendado)';
    if (formData.ramUpgrade && formData.ssdUpgrade) result = 'Óptimo para Actualizar';
    else if (formData.ssdUpgrade) result = 'Compatible con mejora de disco';
    else if (formData.ramUpgrade) result = 'Compatible con mejora de RAM';
    else if (formData.osUpgrade) result = 'Compatible con nuevo SO';

    if (editingId) {
      await compatibilityService.update(editingId, { ...formData, result } as any);
      setToast({ message: 'Evaluación actualizada', type: 'success' });
    } else {
      await compatibilityService.create({ ...formData, result, date: new Date().toISOString().split('T')[0] } as any);
      setToast({ message: 'Evaluación guardada', type: 'success' });
    }
    setIsModalOpen(false);
    loadData();
  };

  const handleConfirmDelete = async () => {
    if (checkToDelete) {
      await compatibilityService.delete(checkToDelete);
      loadData();
      setToast({ message: 'Registro eliminado', type: 'success' });
      setCheckToDelete(null);
    }
  };

  const getDeviceName = (id: string) => {
    const device = devices.find(d => d.id === id);
    return device ? `${device.brand} ${device.model}` : 'Equipo Desconocido';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Evaluación de Compatibilidad</h1>
          <p className="text-slate-400 text-sm mt-1">// Determina si un equipo soporta mejoras de hardware o software.</p>
        </div>
        <button onClick={() => handleOpenModal()} className="btn-primary w-fit">
          <Plus className="h-4 w-4" /> Nueva Evaluación
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
        <input type="text" placeholder="Buscar evaluación..." className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white pl-10 pr-4 py-2.5 rounded-md focus:border-[#00ff9d] focus:ring-1 focus:ring-[#00ff9d] outline-none transition font-mono text-sm" />
      </div>

      <div className="bg-[#121212] border border-[#2a2a2a] rounded-md overflow-hidden">
        {isLoading ? (
          <TableSkeleton />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#1a1a1a] border-b border-[#2a2a2a]">
                <tr>
                  <th className="p-4 text-xs font-bold text-[#00ff9d] uppercase tracking-wider">Equipo</th>
                  <th className="p-4 text-xs font-bold text-[#00ff9d] uppercase tracking-wider">Resultado</th>
                  <th className="p-4 text-xs font-bold text-[#00ff9d] uppercase tracking-wider">Fecha</th>
                  <th className="p-4 text-xs font-bold text-[#00ff9d] uppercase tracking-wider text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a2a2a]">
                {checks.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-12 text-center text-slate-500 flex flex-col items-center">
                      <ShieldCheck className="h-12 w-12 text-slate-600 mb-3" />
                      <p className="text-lg font-medium text-slate-400">No hay evaluaciones registradas</p>
                    </td>
                  </tr>
                ) : (
                  checks.map((check) => (
                    <tr key={check.id} className="hover:bg-[#1a1a1a] transition-colors">
                      <td className="p-4 text-sm text-[#00b8ff] font-mono">{getDeviceName(check.deviceId)}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-sm border ${
                          check.result.includes('Óptimo') 
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                            : check.result.includes('Compatible')
                              ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                              : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        }`}>
                          {check.result.includes('Óptimo') ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                          {check.result}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-slate-500 font-mono">{check.date}</td>
                      <td className="p-4 text-right flex justify-end gap-2">
                        <button 
                          onClick={() => handleOpenModal(check)} 
                          className="p-2 text-slate-500 hover:text-[#00b8ff] hover:bg-[#00b8ff]/10 rounded transition-colors"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        {user?.role === 'admin' && (
                          <button 
                            onClick={() => setCheckToDelete(check.id)} 
                            className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#121212] border border-[#2a2a2a] rounded-md shadow-2xl w-full max-w-md p-6 relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white">
              <X className="h-5 w-5" />
            </button>

            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              {editingId ? <Pencil className="text-[#00b8ff]" /> : <ShieldCheck className="text-[#00ff9d]" />}
              {editingId ? 'Editar Evaluación' : 'Evaluar Compatibilidad'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="form-label">Equipo</label>
                <select required className="input-field" value={formData.deviceId} onChange={e => setFormData({...formData, deviceId: e.target.value})}>
                  <option value="" disabled>Seleccione un equipo...</option>
                  {devices.map(d => (
                    <option key={d.id} value={d.id}>{d.brand} {d.model} ({d.type})</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-3 p-4 bg-[#1a1a1a] rounded-md border border-[#2a2a2a]">
                <p className="text-xs font-bold text-[#00ff9d] uppercase tracking-wider mb-3">Mejoras a evaluar:</p>
                
                <label className="flex items-center gap-3 text-sm text-slate-300 cursor-pointer">
                  <input type="checkbox" checked={formData.ramUpgrade} onChange={e => setFormData({...formData, ramUpgrade: e.target.checked})} className="w-4 h-4 rounded border-[#2a2a2a] bg-[#121212] text-[#00ff9d] focus:ring-[#00ff9d]" />
                  ¿Soporta ampliación de RAM?
                </label>
                
                <label className="flex items-center gap-3 text-sm text-slate-300 cursor-pointer">
                  <input type="checkbox" checked={formData.ssdUpgrade} onChange={e => setFormData({...formData, ssdUpgrade: e.target.checked})} className="w-4 h-4 rounded border-[#2a2a2a] bg-[#121212] text-[#00ff9d] focus:ring-[#00ff9d]" />
                  ¿Soporta disco SSD?
                </label>
                
                <label className="flex items-center gap-3 text-sm text-slate-300 cursor-pointer">
                  <input type="checkbox" checked={formData.osUpgrade} onChange={e => setFormData({...formData, osUpgrade: e.target.checked})} className="w-4 h-4 rounded border-[#2a2a2a] bg-[#121212] text-[#00ff9d] focus:ring-[#00ff9d]" />
                  ¿Soporta nuevo Sistema Operativo?
                </label>
              </div>

              <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-[#2a2a2a]">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancelar</button>
                <button type="submit" className="btn-primary">
                  {editingId ? 'Actualizar Evaluación' : 'Evaluar y Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal 
        isOpen={!!checkToDelete} 
        onClose={() => setCheckToDelete(null)} 
        onConfirm={handleConfirmDelete} 
        title="Eliminar Evaluación"
        message="¿Estás seguro de que deseas eliminar esta evaluación?"
      />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}