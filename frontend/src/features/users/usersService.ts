import type { User } from '../../types';

const KEY = 'revtek-users-db';

const load = (): User[] => JSON.parse(localStorage.getItem(KEY) || '[]');
const save = (data: User[]) => localStorage.setItem(KEY, JSON.stringify(data));

export const usersService = {
  async list(): Promise<User[]> {
    await new Promise((r) => setTimeout(r, 300));
    return load().filter((u) => !u.deleted);
  },
  
  async create(data: Omit<User, 'id' | 'deleted'>) {
    // SOLUCIÓN: Tipamos explícitamente como User
    const newUser: User = {
      ...data,
      id: crypto.randomUUID(),
      deleted: false,
    } as User; // El 'as User' asegura que TypeScript no se queje

    save([...load(), newUser]);
    window.dispatchEvent(new Event('revtek-data-changed'));
    return newUser;
  },

  async update(id: string, updates: Partial<User>): Promise<void> {
    await new Promise((r) => setTimeout(r, 300));
    save(load().map(u => u.id === id ? { ...u, ...updates } : u));
    window.dispatchEvent(new Event('revtek-data-changed'));
  },

  async delete(id: string) {
    save(load().map(u => u.id === id ? { ...u, deleted: true } : u));
    window.dispatchEvent(new Event('revtek-data-changed'));
  }
};