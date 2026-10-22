import type { Cleaning } from '../../types';

const KEY = 'revtek-cleaning-db';
const load = (): Cleaning[] => JSON.parse(localStorage.getItem(KEY) || '[]');
const save = (data: Cleaning[]) => localStorage.setItem(KEY, JSON.stringify(data));

export const cleaningService = {
  async list(): Promise<Cleaning[]> {
    await new Promise((r) => setTimeout(r, 300));
    return load().filter((c) => !c.deleted);
  },
  async create(data: Omit<Cleaning, 'id' | 'deleted' | 'createdAt'>) {
    const newItem: Cleaning = {
      ...data,
      id: crypto.randomUUID(),
      deleted: false,
      createdAt: new Date().toISOString(),
    };
    save([...load(), newItem]);
    return newItem;
  },
  async delete(id: string) {
    save(load().map(c => c.id === id ? { ...c, deleted: true } : c));
  }
};