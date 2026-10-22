import { useEffect, useState } from 'react';
import { Plus, Trash2, Search, MonitorSmartphone } from 'lucide-react';
import { devicesService } from './devicesService';
import type { Device } from '../../types';
import { TableSkeleton } from '../../components/TableSkeleton';
import { Toast } from '../../components/Toast';
import { useAuthStore } from '../../store/authStore';

export function DevicesPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ clientId: '', type: 'Laptop', brand: '', model: '', specs: '', status: 'en_reparacion' as const });
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  const user = useAuthStore(state => state.user);

  const loadDevices = () => {
    setIsLoading(true);
    devicesService.list().then((data) => {
      setDevices(data);
      setIsLoading(false);
    });
  };

  useEffect(() => { loadDevices(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await devicesService.create(formData);
    setFormData({ clientId: '', type: 'Laptop', brand: '', model: '', specs: '', status: 'en_reparacion' });
    setIsModalOpen(false);
    loadDevices();
    setToast({ message: 'Equipo registrado exitosamente', type: 'success' });
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Eliminar este equipo?')) {
      await devicesService.delete(id);
      loadDevices();
      setToast({ message: 'Equipo eliminado', type: 'success' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Directorio de Equipos</h1>
          <p className="text-slate-500 text-sm mt-1">Gestiona los dispositivos que ingresan al taller.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary w-fit">
          <Plus className="h-4 w-4" /> Nuevo Equipo
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input type="text" placeholder="Buscar equipo por marca o modelo..." className="input-field pl-10 bg-white" />
      </div>

      <div className="card p-0 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
        {isLoading ? (
          <TableSkeleton />
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Equipo</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Especificaciones</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Estado</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {devices.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-slate-500">
                    <MonitorSmartphone className="h-12 w-12 text-slate-300 mb-3 mx-auto" />
                    <p>No hay equipos registrados.</p>
                  </td>
                </tr>
              ) : (
                devices.map((device) => (
                  <tr key={device.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <p className="text-sm font-medium text-slate-800">{device.brand} {device.model}</p>
                      <p className="text-xs text-slate-500">{device.type}</p>
                    </td>
                    <td className="p-4 text-sm text-slate-600 truncate max-w-[200px]">{device.specs}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                        {device.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-4 text-right flex justify-end">
                      {user?.role === 'admin' && (
                        <button onClick={() => handleDelete(device.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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
            <h2 className="text-xl font-bold mb-6">Registrar Equipo</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="form-label">ID del Cliente (Simulado)</label>
                <input required className="input-field" placeholder="Ej. 1234" value={formData.clientId} onChange={e => setFormData({...formData, clientId: e.target.value})} />
              </div>
              <div>
                <label className="form-label">Tipo de Equipo</label>
                <select className="input-field" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                  <option value="PC">PC de Escritorio</option>
                  <option value="Laptop">Laptop</option>
                  <option value="Celular">Celular</option>
                  <option value="Tablet">Tablet</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Marca</label>
                  <input required className="input-field" placeholder="HP, Lenovo..." value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} />
                </div>
                <div>
                  <label className="form-label">Modelo</label>
                  <input required className="input-field" placeholder="Pavilion..." value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="form-label">Especificaciones</label>
                <input required className="input-field" placeholder="Core i5, 8GB RAM, 256GB SSD" value={formData.specs} onChange={e => setFormData({...formData, specs: e.target.value})} />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancelar</button>
                <button type="submit" className="btn-primary">Guardar Equipo</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}