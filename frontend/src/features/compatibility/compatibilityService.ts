import type { CompatibilityCheck } from '../../types';

const KEY = 'revtek-compatibility-db';
const load = (): CompatibilityCheck[] => JSON.parse(localStorage.getItem(KEY) || '[]');
const save = (data: CompatibilityCheck[]) => localStorage.setItem(KEY, JSON.stringify(data));

export const compatibilityService = {
  async list(): Promise<CompatibilityCheck[]> {
    await new Promise((r) => setTimeout(r, 300));
    return load().filter((c) => !c.deleted);
  },
  async create(data: Omit<CompatibilityCheck, 'id' | 'deleted' | 'createdAt'>) {
    const newCheck: CompatibilityCheck = {
      ...data,
      id: crypto.randomUUID(),
      deleted: false,
      createdAt: new Date().toISOString(),
    };
    save([...load(), newCheck]);
    window.dispatchEvent(new Event('revtek-data-changed'));
    return newCheck;
  },
  async update(id: string, updates: Partial<CompatibilityCheck>): Promise<void> {
    await new Promise((r) => setTimeout(r, 300));
    save(load().map(c => c.id === id ? { ...c, ...updates } : c));
    window.dispatchEvent(new Event('revtek-data-changed'));
  },
  async delete(id: string) {
    save(load().map(c => c.id === id ? { ...c, deleted: true } : c));
    window.dispatchEvent(new Event('revtek-data-changed'));
  }
};