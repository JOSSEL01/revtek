import { useEffect, useState } from 'react';
import { Plus, Trash2, Search, MonitorSmartphone, X, Pencil } from 'lucide-react';
import { devicesService } from './devicesService';
import { clientsService } from '../clients/clientsService';
import type { Device, Client } from '../../types';
import { TableSkeleton } from '../../components/TableSkeleton';
import { Toast } from '../../components/Toast';
import { ConfirmModal } from '../../components/ConfirmModal';
import { useAuthStore } from '../../store/authStore';

export function DevicesPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [clients, setClients] = useState<Client[]>([]); // Para el selector
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ 
    clientId: '', 
    type: 'Laptop', 
    brand: '', 
    model: '', 
    specs: '', 
    status: 'en_reparacion' 
  });
  
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [deviceToDelete, setDeviceToDelete] = useState<string | null>(null);
  
  const user = useAuthStore(state => state.user);

  const loadData = async () => {
    setIsLoading(true);
    const devicesData = await devicesService.list();
    const clientsData = await clientsService.list();
    setDevices(devicesData);
    setClients(clientsData);
    setIsLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const handleOpenModal = (device?: Device) => {
    if (device) {
      setEditingId(device.id);
      setFormData({ 
        clientId: device.clientId, 
        type: device.type, 
        brand: device.brand, 
        model: device.model, 
        specs: device.specs, 
        status: device.status 
      });
    } else {
      setEditingId(null);
      setFormData({ clientId: '', type: 'Laptop', brand: '', model: '', specs: '', status: 'en_reparacion' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      // AQUÍ ESTÁ LA CORRECCIÓN: formData as any
      await devicesService.update(editingId, formData as any);
      setToast({ message: 'Equipo actualizado correctamente', type: 'success' });
    } else {
      // AQUÍ TAMBIÉN: formData as any
      await devicesService.create(formData as any);
      setToast({ message: 'Equipo registrado exitosamente', type: 'success' });
    }
    setIsModalOpen(false);
    loadData();
  };

  const handleConfirmDelete = async () => {
    if (deviceToDelete) {
      await devicesService.delete(deviceToDelete);
      loadData();
      setToast({ message: 'Equipo eliminado', type: 'success' });
      setDeviceToDelete(null);
    }
  };

  // Función auxiliar para obtener el nombre del cliente en la tabla
  const getClientName = (id: string) => {
    const client = clients.find(c => c.id === id);
    return client ? client.fullName : 'Cliente Desconocido';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Directorio de Equipos</h1>
          <p className="text-slate-400 text-sm mt-1">// Gestiona los dispositivos que ingresan al taller.</p>
        </div>
        <button onClick={() => handleOpenModal()} className="btn-primary w-fit">
          <Plus className="h-4 w-4" /> Nuevo Equipo
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
        <input 
          type="text" 
          placeholder="Buscar equipo por marca o modelo..." 
          className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white pl-10 pr-4 py-2.5 rounded-md focus:border-[#00ff9d] focus:ring-1 focus:ring-[#00ff9d] outline-none transition font-mono text-sm"
        />
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
                  <th className="p-4 text-xs font-bold text-[#00ff9d] uppercase tracking-wider">Propietario</th>
                  <th className="p-4 text-xs font-bold text-[#00ff9d] uppercase tracking-wider">Especificaciones</th>
                  <th className="p-4 text-xs font-bold text-[#00ff9d] uppercase tracking-wider">Estado</th>
                  <th className="p-4 text-xs font-bold text-[#00ff9d] uppercase tracking-wider text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a2a2a]">
                {devices.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-slate-500 flex flex-col items-center">
                      <MonitorSmartphone className="h-12 w-12 text-slate-600 mb-3" />
                      <p className="text-lg font-medium text-slate-400">No hay equipos registrados</p>
                      <p className="text-sm mt-1 text-slate-500">Haz clic en "Nuevo Equipo" para empezar.</p>
                    </td>
                  </tr>
                ) : (
                  devices.map((device) => (
                    <tr key={device.id} className="hover:bg-[#1a1a1a] transition-colors">
                      <td className="p-4">
                        <p className="text-sm font-medium text-slate-200">{device.brand} {device.model}</p>
                        <p className="text-xs text-slate-500">{device.type}</p>
                      </td>
                      <td className="p-4 text-sm text-[#00b8ff] font-mono">{getClientName(device.clientId)}</td>
                      <td className="p-4 text-sm text-slate-400 truncate max-w-[200px]">{device.specs}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 text-xs font-medium rounded-sm capitalize border ${
                          device.status === 'en_reparacion' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 
                          device.status === 'reparado' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 
                          'bg-slate-500/10 text-slate-400 border-slate-500/30'
                        }`}>
                          {device.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-4 text-right flex justify-end gap-2">
                        <button 
                          onClick={() => handleOpenModal(device)} 
                          className="p-2 text-slate-500 hover:text-[#00b8ff] hover:bg-[#00b8ff]/10 rounded transition-colors"
                          title="Editar Equipo"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>

                        {user?.role === 'admin' && (
                          <button 
                            onClick={() => setDeviceToDelete(device.id)} 
                            className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                            title="Eliminar Equipo"
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
            <button 
              onClick={() => setIsModalOpen(false)} 
              className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              {editingId ? <Pencil className="text-[#00b8ff]" /> : <MonitorSmartphone className="text-[#00ff9d]" />}
              {editingId ? 'Editar Equipo' : 'Registrar Nuevo Equipo'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* SELECTOR DE CLIENTE */}
              <div>
                <label className="form-label">Propietario (Cliente)</label>
                <select 
                  required 
                  className="input-field" 
                  value={formData.clientId} 
                  onChange={e => setFormData({...formData, clientId: e.target.value})}
                >
                  <option value="" disabled>Seleccione un cliente...</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.fullName} ({c.email})</option>
                  ))}
                </select>
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

              <div>
                <label className="form-label">Estado del Equipo</label>
                <select className="input-field" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})}>
                  <option value="en_reparacion">En Reparación</option>
                  <option value="reparado">Reparado / Listo</option>
                  <option value="entregado">Entregado</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-[#2a2a2a]">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancelar</button>
                <button type="submit" className="btn-primary">
                  {editingId ? 'Actualizar Equipo' : 'Guardar Equipo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal 
        isOpen={!!deviceToDelete} 
        onClose={() => setDeviceToDelete(null)} 
        onConfirm={handleConfirmDelete} 
        title="Eliminar Equipo"
        message="¿Estás seguro de que deseas eliminar este equipo? Esta acción no se puede deshacer."
      />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}