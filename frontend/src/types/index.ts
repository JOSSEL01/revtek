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