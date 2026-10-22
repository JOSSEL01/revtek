import { useEffect, useState } from 'react';
import { Plus, Trash2, Search, Wrench } from 'lucide-react';
import { servicesService } from './servicesService';
import type { Service } from '../../types';
import { TableSkeleton } from '../../components/TableSkeleton';
import { Toast } from '../../components/Toast';
import { useAuthStore } from '../../store/authStore';

export function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ deviceId: '', type: 'instalacion_so' as const, description: '', date: new Date().toISOString().split('T')[0] });
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  const user = useAuthStore(state => state.user);

  const loadServices = () => {
    setIsLoading(true);
    servicesService.list().then((data) => {
      setServices(data);
      setIsLoading(false);
    });
  };

  useEffect(() => { loadServices(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await servicesService.create(formData);
    setFormData({ deviceId: '', type: 'instalacion_so', description: '', date: new Date().toISOString().split('T')[0] });
    setIsModalOpen(false);
    loadServices();
    setToast({ message: 'Servicio registrado exitosamente', type: 'success' });
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Eliminar este servicio?')) {
      await servicesService.delete(id);
      loadServices();
      setToast({ message: 'Servicio eliminado', type: 'success' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Gestión de Servicios</h1>
          <p className="text-slate-500 text-sm mt-1">Registra los trabajos y reparaciones realizados.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary w-fit">
          <Plus className="h-4 w-4" /> Nuevo Servicio
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input type="text" placeholder="Buscar servicio..." className="input-field pl-10 bg-white" />
      </div>

      <div className="card p-0 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
        {isLoading ? (
          <TableSkeleton />
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Tipo de Servicio</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Descripción</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Fecha</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {services.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-slate-500">
                    <Wrench className="h-12 w-12 text-slate-300 mb-3 mx-auto" />
                    <p>No hay servicios registrados.</p>
                  </td>
                </tr>
              ) : (
                services.map((service) => (
                  <tr key={service.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <span className="px-2.5 py-1 bg-brand-50 text-brand-700 text-xs font-medium rounded-full capitalize">
                        {service.type.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-slate-600 truncate max-w-[300px]">{service.description}</td>
                    <td className="p-4 text-sm text-slate-600">{service.date}</td>
                    <td className="p-4 text-right flex justify-end">
                      {user?.role === 'admin' && (
                        <button onClick={() => handleDelete(service.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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
            <h2 className="text-xl font-bold mb-6">Registrar Servicio</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="form-label">ID del Equipo</label>
                <input required className="input-field" placeholder="Ej. 1234" value={formData.deviceId} onChange={e => setFormData({...formData, deviceId: e.target.value})} />
              </div>
              <div>
                <label className="form-label">Tipo de Servicio</label>
                <select className="input-field" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as any})}>
                  <option value="instalacion_so">Instalación de SO</option>
                  <option value="actualizacion_hardware">Actualización de Hardware</option>
                  <option value="actualizacion_software">Actualización de Software</option>
                  <option value="limpieza">Limpieza</option>
                </select>
              </div>
              <div>
                <label className="form-label">Descripción del trabajo</label>
                <input required className="input-field" placeholder="Detalles de la reparación..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>
              <div>
                <label className="form-label">Fecha</label>
                <input required type="date" className="input-field" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancelar</button>
                <button type="submit" className="btn-primary">Guardar Servicio</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}