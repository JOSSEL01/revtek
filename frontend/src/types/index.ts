export type Role = 'admin' | 'tecnico';

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  active: boolean;
  password?: string;       // <-- Opcional para no dar error en el registro
  deleted?: boolean;       // <-- AGREGADO: Para eliminación lógica
  createdAt?: string;      // <-- AGREGADO: Para mantener el orden
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
export type DeviceStatus = 'operativo' | 'en_reparacion' | 'reparado' | 'entregado';

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

export type ServiceType = 'instalacion_so' | 'actualizacion_hardware' | 'actualizacion_software' | 'limpieza';

export interface Service {
  id: string;
  deviceId: string;
  type: ServiceType;
  description: string;
  date: string;
  deleted: boolean;
  createdAt: string;
}

export interface Cleaning {
  id: string;
  deviceId: string;
  type: 'fisica' | 'digital';
  notes: string;
  date: string;
  deleted: boolean;
  createdAt: string;
}

export interface Update {
  id: string;
  deviceId: string;
  type: 'RAM' | 'SSD' | 'Software' | 'SO';
  detail: string;
  cost: number;
  deleted: boolean;
  createdAt: string;
}

export interface CompatibilityCheck {
  id: string;
  deviceId: string;
  ramUpgrade: boolean;
  ssdUpgrade: boolean;
  osUpgrade: boolean;
  result: string;
  date: string;
  deleted: boolean;
  createdAt: string;
}