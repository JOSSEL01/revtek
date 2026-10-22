import { authService } from '../auth/authService';
import type { User } from '../../types';

export const usersService = {
  async list(): Promise<User[]> {
    // Simulamos un pequeño retraso de red
    await new Promise((resolve) => setTimeout(resolve, 400));
    
    // Traemos los usuarios desde el localStorage (donde los guarda el registro)
    const rawUsers = authService.getUsers();
    
    // Los mapeamos para no mostrar la contraseña en la tabla
    return rawUsers.map((u: any) => ({
      id: u.id,
      fullName: u.fullName,
      email: u.email,
      role: u.role || 'tecnico',
      active: true,
      deleted: false,
      createdAt: new Date().toISOString()
    }));
  }
};