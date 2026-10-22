import type { Service } from '../../types';

const KEY = 'revtek-services-db';
const load = (): Service[] => JSON.parse(localStorage.getItem(KEY) || '[]');
const save = (data: Service[]) => localStorage.setItem(KEY, JSON.stringify(data));

export const servicesService = {
  async list(): Promise<Service[]> {
    await new Promise((r) => setTimeout(r, 300));
    return load().filter((s) => !s.deleted);
  },
  async create(data: Omit<Service, 'id' | 'deleted' | 'createdAt'>) {
    const newService: Service = {
      ...data,
      id: crypto.randomUUID(),
      deleted: false,
      createdAt: new Date().toISOString(),
    };
    save([...load(), newService]);
    return newService;
  },
  async delete(id: string) {
    save(load().map(s => s.id === id ? { ...s, deleted: true } : s));
  }
};