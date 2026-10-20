import type { Client } from '../../types';

const STORAGE_KEY = 'revtek-clients-mock';

export const clientsService = {
  async list(): Promise<Client[]> {
    const data = localStorage.getItem(STORAGE_KEY);
    const clients = data ? JSON.parse(data) : [];
    return clients.filter((c: Client) => !c.deleted); // Eliminación lógica
  },

  async create(client: Omit<Client, 'id' | 'deleted'>): Promise<Client> {
    const data = await this.list();
    const newClient = { ...client, id: crypto.randomUUID(), deleted: false };
    const all = [...data, newClient];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    return newClient;
  },

  async delete(id: string): Promise<void> {
    const data = await this.list();
    const updated = data.map(c => c.id === id ? { ...c, deleted: true } : c);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }
};