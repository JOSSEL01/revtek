import type { Device } from '../../types';

const KEY = 'revtek-devices-db';

const load = (): Device[] => JSON.parse(localStorage.getItem(KEY) || '[]');
const save = (data: Device[]) => localStorage.setItem(KEY, JSON.stringify(data));

export const devicesService = {
  async list(): Promise<Device[]> {
    await new Promise((r) => setTimeout(r, 300));
    return load().filter((d) => !d.deleted);
  },
  async create(data: Omit<Device, 'id' | 'deleted' | 'createdAt'>) {
    const newDevice: Device = {
      ...data,
      id: crypto.randomUUID(),
      deleted: false,
      createdAt: new Date().toISOString(),
    };
    save([...load(), newDevice]);
    return newDevice;
  },
  async delete(id: string) {
    save(load().map(d => d.id === id ? { ...d, deleted: true } : d));
  }
};