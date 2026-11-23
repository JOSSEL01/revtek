import { useEffect, useState } from 'react';
import { logsService, type AccessLog } from './logsService';
import { Monitor, Smartphone, LogIn, LogOut, Search, History } from 'lucide-react';

export function LogsPage() {
  const [logs, setLogs] = useState<AccessLog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setLogs(logsService.list());
  }, []);

  // Filtro de búsqueda por email o nombre de usuario
  const filteredLogs = logs.filter(log => 
    log.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
    log.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Logs de Acceso</h1>
          <p className="text-slate-400 text-sm mt-1">// Historial de ingresos y salidas del sistema.</p>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
        <input 
          type="text" 
          placeholder="Buscar por usuario o email..." 
          className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white pl-10 pr-4 py-2.5 rounded-md focus:border-[#00ff9d] focus:ring-1 focus:ring-[#00ff9d] outline-none transition font-mono text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-[#121212] border border-[#2a2a2a] rounded-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#1a1a1a] border-b border-[#2a2a2a]">
              <tr>
                <th className="p-4 text-xs font-bold text-[#00ff9d] uppercase tracking-wider">Usuario</th>
                <th className="p-4 text-xs font-bold text-[#00ff9d] uppercase tracking-wider">Evento</th>
                <th className="p-4 text-xs font-bold text-[#00ff9d] uppercase tracking-wider">Dispositivo</th>
                <th className="p-4 text-xs font-bold text-[#00ff9d] uppercase tracking-wider">Fecha y Hora</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2a2a]">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-slate-500 flex flex-col items-center">
                    <History className="h-12 w-12 text-slate-600 mb-3" />
                    <p className="text-lg font-medium text-slate-400">No hay registros de acceso</p>
                    <p className="text-sm mt-1 text-slate-500">Los logs aparecerán aquí cuando inicies sesión.</p>
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#1a1a1a] transition-colors">
                    <td className="p-4 text-sm text-slate-200 font-mono">{log.email}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-sm border ${
                        log.event === 'ingreso' 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      }`}>
                        {log.event === 'ingreso' ? <LogIn size={12} /> : <LogOut size={12} />}
                        {log.event === 'ingreso' ? 'INGRESO' : 'SALIDA'}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-slate-400">
                      <div className="flex items-center gap-2">
                        {log.browser === 'Móvil' ? <Smartphone size={14} /> : <Monitor size={14} />}
                        {log.browser}
                      </div>
                    </td>
                    <td className="p-4 text-sm text-slate-500 font-mono">
                      {new Date(log.timestamp).toLocaleString('es-ES')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}