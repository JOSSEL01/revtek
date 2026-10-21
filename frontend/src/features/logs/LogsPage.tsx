import { useEffect, useState } from 'react';
import { logsService, type AccessLog } from './logsService';
import { Monitor, Smartphone, LogIn, LogOut } from 'lucide-react';

export function LogsPage() {
  const [logs, setLogs] = useState<AccessLog[]>([]);

  useEffect(() => {
    setLogs(logsService.list());
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Logs de Acceso</h1>
        <p className="text-slate-500 text-sm mt-1">Historial de ingresos y salidas del sistema.</p>
      </div>

      <div className="card p-0 overflow-hidden shadow-md">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Usuario</th>
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Evento</th>
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Dispositivo</th>
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Fecha y Hora</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {logs.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-500">No hay registros de acceso aún.</td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="p-4 text-sm text-slate-800">{log.email}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${log.event === 'ingreso' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {log.event === 'ingreso' ? <LogIn className="h-3 w-3" /> : <LogOut className="h-3 w-3" />}
                      {log.event === 'ingreso' ? 'Ingreso' : 'Salida'}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      {log.browser === 'Móvil' ? <Smartphone className="h-4 w-4" /> : <Monitor className="h-4 w-4" />}
                      {log.browser}
                    </div>
                  </td>
                  <td className="p-4 text-sm text-slate-600">{new Date(log.timestamp).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}