import { useEffect, useState } from 'react';
import { Plus, Trash2, Search, Sparkles, X, Pencil } from 'lucide-react';
import { cleaningService } from './cleaningService';
import { devicesService } from '../devices/devicesService';
import type { Cleaning, Device } from '../../types';
import { TableSkeleton } from '../../components/TableSkeleton';
import { Toast } from '../../components/Toast';
import { ConfirmModal } from '../../components/ConfirmModal';
import { useAuthStore } from '../../store/authStore';

export function CleaningPage() {
  const [items, setItems] = useState<Cleaning[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ deviceId: '', type: 'fisica', notes: '', date: new Date().toISOString().split('T')[0] });
  
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  
  const user = useAuthStore(state => state.user);

  const loadData = async () => {
    setIsLoading(true);
    const cleaningData = await cleaningService.list();
    const devicesData = await devicesService.list();
    setItems(cleaningData);
    setDevices(devicesData);
    setIsLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const handleOpenModal = (item?: Cleaning) => {
    if (item) {
      setEditingId(item.id);
      setFormData({ deviceId: item.deviceId, type: item.type, notes: item.notes, date: item.date });
    } else {
      setEditingId(null);
      setFormData({ deviceId: '', type: 'fisica', notes: '', date: new Date().toISOString().split('T')[0] });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await cleaningService.update(editingId, formData as any);
      setToast({ message: 'Registro actualizado correctamente', type: 'success' });
    } else {
      await cleaningService.create(formData as any);
      setToast({ message: 'Limpieza registrada exitosamente', type: 'success' });
    }
    setIsModalOpen(false);
    loadData();
  };

  const handleConfirmDelete = async () => {
    if (itemToDelete) {
      await cleaningService.delete(itemToDelete);
      loadData();
      setToast({ message: 'Registro eliminado', type: 'success' });
      setItemToDelete(null);
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
          <h1 className="text-2xl font-bold text-white">Gestión de Limpieza</h1>
          <p className="text-slate-400 text-sm mt-1">// Registra la limpieza física y digital de los equipos.</p>
        </div>
        <button onClick={() => handleOpenModal()} className="btn-primary w-fit">
          <Plus className="h-4 w-4" /> Nuevo Registro
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
        <input type="text" placeholder="Buscar limpieza..." className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white pl-10 pr-4 py-2.5 rounded-md focus:border-[#00ff9d] focus:ring-1 focus:ring-[#00ff9d] outline-none transition font-mono text-sm" />
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
                  <th className="p-4 text-xs font-bold text-[#00ff9d] uppercase tracking-wider">Tipo</th>
                  <th className="p-4 text-xs font-bold text-[#00ff9d] uppercase tracking-wider">Notas</th>
                  <th className="p-4 text-xs font-bold text-[#00ff9d] uppercase tracking-wider">Fecha</th>
                  <th className="p-4 text-xs font-bold text-[#00ff9d] uppercase tracking-wider text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a2a2a]">
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-slate-500 flex flex-col items-center">
                      <Sparkles className="h-12 w-12 text-slate-600 mb-3" />
                      <p className="text-lg font-medium text-slate-400">No hay registros de limpieza</p>
                    </td>
                  </tr>
                ) : (
                  items.map((item) => (
                    <tr key={item.id} className="hover:bg-[#1a1a1a] transition-colors">
                      <td className="p-4 text-sm text-[#00b8ff] font-mono">{getDeviceName(item.deviceId)}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 text-xs font-medium rounded-sm capitalize border ${
                          item.type === 'fisica' 
                            ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' 
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        }`}>
                          {item.type}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-slate-400 truncate max-w-[300px]">{item.notes}</td>
                      <td className="p-4 text-sm text-slate-500 font-mono">{item.date}</td>
                      <td className="p-4 text-right flex justify-end gap-2">
                        <button 
                          onClick={() => handleOpenModal(item)} 
                          className="p-2 text-slate-500 hover:text-[#00b8ff] hover:bg-[#00b8ff]/10 rounded transition-colors"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        {user?.role === 'admin' && (
                          <button 
                            onClick={() => setItemToDelete(item.id)} 
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
              {editingId ? <Pencil className="text-[#00b8ff]" /> : <Sparkles className="text-[#00ff9d]" />}
              {editingId ? 'Editar Registro' : 'Registrar Limpieza'}
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

              <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-[#2a2a2a]">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancelar</button>
                <button type="submit" className="btn-primary">
                  {editingId ? 'Actualizar Registro' : 'Guardar Registro'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal 
        isOpen={!!itemToDelete} 
        onClose={() => setItemToDelete(null)} 
        onConfirm={handleConfirmDelete} 
        title="Eliminar Registro"
        message="¿Estás seguro de que deseas eliminar este registro de limpieza?"
      />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}