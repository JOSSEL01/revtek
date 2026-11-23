import { useEffect, useState } from 'react';
import { Plus, Trash2, Search, UserCircle, X } from 'lucide-react';
import { clientsService } from './clientsService';
import type { Client } from '../../types';
import { Toast } from '../../components/Toast';
import { ConfirmModal } from '../../components/ConfirmModal';
import { TableSkeleton } from '../../components/TableSkeleton';
import { useAuthStore } from '../../store/authStore';

export function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ fullName: '', email: '', phone: '', address: '' });
  
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [clientToDelete, setClientToDelete] = useState<string | null>(null);

  const user = useAuthStore((state) => state.user);

  const loadClients = () => {
    setIsLoading(true);
    clientsService.list().then((data) => {
      setClients(data);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    loadClients();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await clientsService.create(formData);
    setFormData({ fullName: '', email: '', phone: '', address: '' });
    setIsModalOpen(false);
    loadClients();
    setToast({ message: 'Cliente guardado exitosamente', type: 'success' });
  };

  const handleConfirmDelete = async () => {
    if (clientToDelete) {
      await clientsService.delete(clientToDelete);
      loadClients();
      setToast({ message: 'Cliente eliminado correctamente', type: 'success' });
      setClientToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Directorio de Clientes</h1>
          <p className="text-slate-400 text-sm mt-1">// Gestiona la información de los clientes del taller.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary w-fit">
          <Plus className="h-4 w-4" /> Nuevo Cliente
        </button>
      </div>

      {/* Buscador */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
        <input 
          type="text" 
          placeholder="Buscar cliente por nombre o email..." 
          className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white pl-10 pr-4 py-2.5 rounded-md focus:border-[#00ff9d] focus:ring-1 focus:ring-[#00ff9d] outline-none transition font-mono text-sm"
        />
      </div>

      {/* Tabla */}
      <div className="bg-[#121212] border border-[#2a2a2a] rounded-md overflow-hidden">
        {isLoading ? (
          <TableSkeleton />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#1a1a1a] border-b border-[#2a2a2a]">
                <tr>
                  <th className="p-4 text-xs font-bold text-[#00ff9d] uppercase tracking-wider">Cliente</th>
                  <th className="p-4 text-xs font-bold text-[#00ff9d] uppercase tracking-wider">Contacto</th>
                  <th className="p-4 text-xs font-bold text-[#00ff9d] uppercase tracking-wider">Dirección</th>
                  <th className="p-4 text-xs font-bold text-[#00ff9d] uppercase tracking-wider text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a2a2a]">
                {clients.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-12 text-center text-slate-500 flex flex-col items-center">
                      <UserCircle className="h-12 w-12 text-slate-600 mb-3" />
                      <p className="text-lg font-medium text-slate-400">No hay clientes registrados</p>
                      <p className="text-sm mt-1 text-slate-500">Haz clic en "Nuevo Cliente" para empezar.</p>
                    </td>
                  </tr>
                ) : (
                  clients.map((client) => (
                    <tr key={client.id} className="hover:bg-[#1a1a1a] transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-md bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center text-[#00ff9d] font-bold">
                            {client.fullName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-200">{client.fullName}</p>
                            <p className="text-xs text-slate-500">{client.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-slate-300 font-mono">{client.phone}</td>
                      <td className="p-4 text-sm text-slate-400 truncate max-w-[200px]">{client.address}</td>
                      <td className="p-4 text-right flex justify-end">
                        
                        {user?.role === 'admin' && (
                          <div className="relative group">
                            <button 
                              onClick={() => setClientToDelete(client.id)} 
                              className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block px-2 py-1 bg-[#1a1a1a] border border-[#2a2a2a] text-slate-300 text-xs rounded shadow-lg whitespace-nowrap z-50">
                              Eliminar
                            </div>
                          </div>
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

      {/* Modal oscuro */}
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
              <UserCircle className="text-[#00ff9d]" /> Registrar Nuevo Cliente
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="form-label">Nombre Completo</label>
                <input required className="input-field" placeholder="Ej. Juan Pérez" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
              </div>
              <div>
                <label className="form-label">Correo Electrónico</label>
                <input required type="email" className="input-field" placeholder="juan@ejemplo.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              <div>
                <label className="form-label">Teléfono</label>
                <input required className="input-field" placeholder="+591 77777777" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
              <div>
                <label className="form-label">Dirección</label>
                <input required className="input-field" placeholder="Av. Principal #123" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
              </div>
              <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-[#2a2a2a]">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancelar</button>
                <button type="submit" className="btn-primary">Guardar Cliente</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal 
        isOpen={!!clientToDelete} 
        onClose={() => setClientToDelete(null)} 
        onConfirm={handleConfirmDelete} 
        title="Eliminar Cliente"
        message="¿Estás seguro de que deseas eliminar este cliente? Esta acción no se puede deshacer."
      />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}