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
    return newUpdate;
  },
  async delete(id: string) {
    save(load().map(u => u.id === id ? { ...u, deleted: true } : u));
  }
};