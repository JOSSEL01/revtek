import type { Update } from '../../types';

const KEY = 'revtek-updates-db';
const load = (): Update[] => JSON.parse(localStorage.getItem(KEY) || '[]');
const save = (data: Update[]) => localStorage.setItem(KEY, JSON.stringify(data));

export const updatesService = {
  async list(): Promise<Update[]> {
    await new Promise((r) => setTimeout(r, 300));
    return load().filter((u) => !u.deleted);
  },
  async create(data: Omit<Update, 'id' | 'deleted' | 'createdAt'>) {
    const newUpdate: Update = {
      ...data,
      id: crypto.randomUUID(),
      deleted: false,
      createdAt: new Date().toISOString(),
    };
    save([...load(), newUpdate]);
    window.dispatchEvent(new Event('revtek-data-changed')); // Evento para el Dashboard
    return newUpdate;
  },
  async update(id: string, updates: Partial<Update>): Promise<void> {
    await new Promise((r) => setTimeout(r, 300));
    save(load().map(u => u.id === id ? { ...u, ...updates } : u));
    window.dispatchEvent(new Event('revtek-data-changed')); // Evento
  },
  async delete(id: string) {
    save(load().map(u => u.id === id ? { ...u, deleted: true } : u));
    window.dispatchEvent(new Event('revtek-data-changed')); // Evento
  }
};