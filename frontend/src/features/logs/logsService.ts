export interface AccessLog {
  id: string;
  userName: string;
  email: string;
  event: 'ingreso' | 'salida';
  browser: string;
  timestamp: string;
}

const LOGS_KEY = 'revtek-access-logs';

export const logsService = {
  register: (email: string, event: 'ingreso' | 'salida') => {
    const logs = logsService.list();
    const newLog: AccessLog = {
      id: crypto.randomUUID(),
      userName: email.split('@')[0],
      email,
      event,
      browser: navigator.userAgent.includes('Mobile') ? 'Móvil' : 'Escritorio',
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem(LOGS_KEY, JSON.stringify([newLog, ...logs]));
  },

  list: (): AccessLog[] => {
    const data = localStorage.getItem(LOGS_KEY);
    return data ? JSON.parse(data) : [];
  }
};