import { useEffect, useState } from 'react';
import { Plus, Trash2, Search, UserCog, X, Pencil, Shield, User as UserIcon } from 'lucide-react';
import { usersService } from './usersService';
import type { User } from '../../types';
import { TableSkeleton } from '../../components/TableSkeleton';
import { Toast } from '../../components/Toast';
import { ConfirmModal } from '../../components/ConfirmModal';
import { useAuthStore } from '../../store/authStore';

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ 
    fullName: '', 
    email: '', 
    role: 'tecnico', 
    active: true 
  });
  
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  
  const currentUser = useAuthStore(state => state.user);

  const loadData = async () => {
    setIsLoading(true);
    const usersData = await usersService.list();
    setUsers(usersData);
    setIsLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const handleOpenModal = (user?: User) => {
    if (user) {
      setEditingId(user.id);
      setFormData({ 
        fullName: user.fullName, 
        email: user.email, 
        role: user.role, 
        active: user.active ?? true 
      });
    } else {
      setEditingId(null);
      setFormData({ fullName: '', email: '', role: 'tecnico', active: true });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await usersService.update(editingId, formData as any);
      setToast({ message: 'Usuario actualizado correctamente', type: 'success' });
    } else {
      await usersService.create({ ...formData, password: 'revtek123' } as any);
      setToast({ message: 'Usuario registrado exitosamente', type: 'success' });
    }
    setIsModalOpen(false);
    loadData();
  };

  const handleConfirmDelete = async () => {
    if (userToDelete) {
      await usersService.delete(userToDelete);
      loadData();
      setToast({ message: 'Usuario eliminado', type: 'success' });
      setUserToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Gestión de Usuarios</h1>
          <p className="text-slate-400 text-sm mt-1">// Administra las cuentas de técnicos y administradores.</p>
        </div>
        <button onClick={() => handleOpenModal()} className="btn-primary w-fit">
          <Plus className="h-4 w-4" /> Nuevo Usuario
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
        <input type="text" placeholder="Buscar usuario..." className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white pl-10 pr-4 py-2.5 rounded-md focus:border-[#00ff9d] focus:ring-1 focus:ring-[#00ff9d] outline-none transition font-mono text-sm" />
      </div>

      <div className="bg-[#121212] border border-[#2a2a2a] rounded-md overflow-hidden">
        {isLoading ? (
          <TableSkeleton />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#1a1a1a] border-b border-[#2a2a2a]">
                <tr>
                  <th className="p-4 text-xs font-bold text-[#00ff9d] uppercase tracking-wider">Usuario</th>
                  <th className="p-4 text-xs font-bold text-[#00ff9d] uppercase tracking-wider">Rol</th>
                  <th className="p-4 text-xs font-bold text-[#00ff9d] uppercase tracking-wider">Estado</th>
                  <th className="p-4 text-xs font-bold text-[#00ff9d] uppercase tracking-wider text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a2a2a]">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-12 text-center text-slate-500 flex flex-col items-center">
                      <UserCog className="h-12 w-12 text-slate-600 mb-3" />
                      <p className="text-lg font-medium text-slate-400">No hay usuarios registrados</p>
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="hover:bg-[#1a1a1a] transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-md bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center text-[#00ff9d] font-bold">
                            {user.fullName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-200">{user.fullName}</p>
                            <p className="text-xs text-slate-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-sm border ${
                          user.role === 'admin' 
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' 
                            : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                        }`}>
                          {user.role === 'admin' ? <Shield size={12} /> : <UserIcon size={12} />}
                          {user.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-sm border ${
                          user.active !== false 
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                            : 'bg-red-500/10 text-red-400 border-red-500/30'
                        }`}>
                          {user.active !== false ? 'ACTIVO' : 'INACTIVO'}
                        </span>
                      </td>
                      <td className="p-4 text-right flex justify-end gap-2">
                        <button 
                          onClick={() => handleOpenModal(user)} 
                          className="p-2 text-slate-500 hover:text-[#00b8ff] hover:bg-[#00b8ff]/10 rounded transition-colors"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        {currentUser?.role === 'admin' && currentUser.id !== user.id && (
                          <button 
                            onClick={() => setUserToDelete(user.id)} 
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
              {editingId ? <Pencil className="text-[#00b8ff]" /> : <UserCog className="text-[#00ff9d]" />}
              {editingId ? 'Editar Usuario' : 'Registrar Nuevo Usuario'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="form-label">Nombre Completo</label>
                <input required className="input-field" placeholder="Ej. Juan Pérez" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
              </div>

              <div>
                <label className="form-label">Correo Electrónico</label>
                <input required type="email" className="input-field" placeholder="juan@revtek.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>

              <div>
                <label className="form-label">Rol del Sistema</label>
                <select className="input-field" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value as any})}>
                  <option value="tecnico">Técnico</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input 
                  type="checkbox" 
                  id="active-check"
                  className="w-4 h-4 rounded border-[#2a2a2a] bg-[#1a1a1a] text-[#00ff9d] focus:ring-[#00ff9d]"
                  checked={formData.active} 
                  onChange={e => setFormData({...formData, active: e.target.checked})}
                />
                <label htmlFor="active-check" className="text-sm text-slate-300">Permitir acceso al sistema</label>
              </div>

              <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-[#2a2a2a]">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancelar</button>
                <button type="submit" className="btn-primary">
                  {editingId ? 'Actualizar Usuario' : 'Guardar Usuario'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal 
        isOpen={!!userToDelete} 
        onClose={() => setUserToDelete(null)} 
        onConfirm={handleConfirmDelete} 
        title="Eliminar Usuario"
        message="¿Estás seguro de que deseas eliminar este usuario? Ya no podrá acceder al sistema."
      />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}