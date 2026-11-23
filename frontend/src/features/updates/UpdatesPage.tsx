import { useEffect, useState } from 'react';
import { Plus, Trash2, Search, Cpu, X, Pencil } from 'lucide-react';
import { updatesService } from './updatesService';
import { devicesService } from '../devices/devicesService';
import type { Update, Device } from '../../types';
import { TableSkeleton } from '../../components/TableSkeleton';
import { Toast } from '../../components/Toast';
import { ConfirmModal } from '../../components/ConfirmModal';
import { useAuthStore } from '../../store/authStore';

export function UpdatesPage() {
  const [updates, setUpdates] = useState<Update[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ deviceId: '', type: 'RAM', detail: '', cost: 0 });
  
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  
  const user = useAuthStore(state => state.user);

  const loadData = async () => {
    setIsLoading(true);
    const updatesData = await updatesService.list();
    const devicesData = await devicesService.list();
    setUpdates(updatesData);
    setDevices(devicesData);
    setIsLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const handleOpenModal = (item?: Update) => {
    if (item) {
      setEditingId(item.id);
      setFormData({ deviceId: item.deviceId, type: item.type, detail: item.detail, cost: item.cost });
    } else {
      setEditingId(null);
      setFormData({ deviceId: '', type: 'RAM', detail: '', cost: 0 });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await updatesService.update(editingId, formData as any);
      setToast({ message: 'Actualización editada correctamente', type: 'success' });
    } else {
      await updatesService.create(formData as any);
      setToast({ message: 'Actualización registrada', type: 'success' });
    }
    setIsModalOpen(false);
    loadData();
  };

  const handleConfirmDelete = async () => {
    if (itemToDelete) {
      await updatesService.delete(itemToDelete);
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
          <h1 className="text-2xl font-bold text-white">Actualizaciones de Hardware/Software</h1>
          <p className="text-slate-400 text-sm mt-1">// Gestiona las mejoras aplicadas a los equipos.</p>
        </div>
        <button onClick={() => handleOpenModal()} className="btn-primary w-fit">
          <Plus className="h-4 w-4" /> Nueva Actualización
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
        <input type="text" placeholder="Buscar actualización..." className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white pl-10 pr-4 py-2.5 rounded-md focus:border-[#00ff9d] focus:ring-1 focus:ring-[#00ff9d] outline-none transition font-mono text-sm" />
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
                  <th className="p-4 text-xs font-bold text-[#00ff9d] uppercase tracking-wider">Componente</th>
                  <th className="p-4 text-xs font-bold text-[#00ff9d] uppercase tracking-wider">Detalle</th>
                  <th className="p-4 text-xs font-bold text-[#00ff9d] uppercase tracking-wider">Costo</th>
                  <th className="p-4 text-xs font-bold text-[#00ff9d] uppercase tracking-wider text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a2a2a]">
                {updates.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-slate-500 flex flex-col items-center">
                      <Cpu className="h-12 w-12 text-slate-600 mb-3" />
                      <p className="text-lg font-medium text-slate-400">No hay actualizaciones registradas</p>
                    </td>
                  </tr>
                ) : (
                  updates.map((update) => (
                    <tr key={update.id} className="hover:bg-[#1a1a1a] transition-colors">
                      <td className="p-4 text-sm text-[#00b8ff] font-mono">{getDeviceName(update.deviceId)}</td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 bg-[#ffcc00]/10 text-[#ffcc00] border border-[#ffcc00]/30 text-xs font-medium rounded-sm">
                          {update.type}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-slate-400 truncate max-w-[300px]">{update.detail}</td>
                      <td className="p-4 text-sm font-medium text-slate-300 font-mono">Bs. {update.cost}</td>
                      <td className="p-4 text-right flex justify-end gap-2">
                        <button 
                          onClick={() => handleOpenModal(update)} 
                          className="p-2 text-slate-500 hover:text-[#00b8ff] hover:bg-[#00b8ff]/10 rounded transition-colors"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        {user?.role === 'admin' && (
                          <button 
                            onClick={() => setItemToDelete(update.id)} 
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
              {editingId ? <Pencil className="text-[#00b8ff]" /> : <Cpu className="text-[#00ff9d]" />}
              {editingId ? 'Editar Actualización' : 'Registrar Actualización'}
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
                <label className="form-label">Tipo de Mejora</label>
                <select className="input-field" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                  <option value="RAM">Memoria RAM</option>
                  <option value="SSD">Disco SSD</option>
                  <option value="SO">Sistema Operativo</option>
                  <option value="Software">Software</option>
                </select>
              </div>

              <div>
                <label className="form-label">Detalle</label>
                <input required className="input-field" placeholder="Ej. 8GB a 16GB RAM" value={formData.detail} onChange={e => setFormData({...formData, detail: e.target.value})} />
              </div>

              <div>
                <label className="form-label">Costo (Bs/USD)</label>
                <input required type="number" step="0.01" className="input-field" placeholder="0.00" value={formData.cost} onChange={e => setFormData({...formData, cost: Number(e.target.value)})} />
              </div>

              <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-[#2a2a2a]">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancelar</button>
                <button type="submit" className="btn-primary">
                  {editingId ? 'Actualizar Registro' : 'Guardar'}
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
        title="Eliminar Actualización"
        message="¿Estás seguro de que deseas eliminar este registro de actualización?"
      />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}