export type Role = 'admin' | 'tecnico';
export interface User {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  active: boolean;
}

export interface Client {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  deleted: boolean;
}

export type DeviceType = 'PC' | 'Laptop' | 'Celular' | 'Tablet';
export type DeviceStatus = 'operativo' | 'en_reparacion' | 'reparado';

export interface Device {
  id: string;
  clientId: string;
  type: DeviceType | string;
  brand: string;
  model: string;
  specs: string;
  status: DeviceStatus;
  deleted: boolean;
  createdAt: string;
}