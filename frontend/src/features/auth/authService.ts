interface UserDB {
  id: string;
  fullName: string;
  email: string;
  password: string;
}

const USERS_KEY = 'revtek-users-db';

export const authService = {
  register: (user: { fullName: string; email: string; password: string }) => {
    const users = authService.getUsers();
    if (users.some(u => u.email === user.email)) {
      throw new Error('El correo ya está registrado.');
    }
    const newUser: UserDB = { ...user, id: crypto.randomUUID() };
    localStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]));
    return newUser;
  },

  login: (email: string, password: string) => {
    const users = authService.getUsers();
    
    // Usuario por defecto para pruebas
    const defaultAdmin: UserDB = { id: '0', fullName: 'Admin', email: 'admin@revtek.com', password: 'admin123' };
    
    const found = users.find(u => u.email === email && u.password === password) || 
                  (email === defaultAdmin.email && password === defaultAdmin.password ? defaultAdmin : null);

    if (!found) throw new Error('Credenciales incorrectas. Revisa tu correo o contraseña.');
    return found;
  },

  getUsers: (): UserDB[] => {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  }
};