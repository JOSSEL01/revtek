import { useState, useEffect } from 'react';
import { Download, Users, MonitorSmartphone, Wrench, Terminal } from 'lucide-react';
import { clientsService } from '../clients/clientsService';
import { devicesService } from '../devices/devicesService';
import { servicesService } from '../services/servicesService';
import { generateClientsReport, generateDevicesReport, generateServicesReport } from '../../lib/pdf';
import type { Client, Device, Service } from '../../types';

export function ReportsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const c = await clientsService.list();
      const d = await devicesService.list();
      const s = await servicesService.list();
      setClients(c);
      setDevices(d);
      setServices(s);
    };
    loadData();
  }, []);

  const handleGenerate = async (type: 'clients' | 'devices' | 'services') => {
    setIsGenerating(true);
    // Pequeño delay para que se vea el "Generando..."
    await new Promise(r => setTimeout(r, 500));

    if (type === 'clients') generateClientsReport(clients);
    if (type === 'devices') generateDevicesReport(devices, clients);
    if (type === 'services') generateServicesReport(services, devices);
    
    setIsGenerating(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Reportes del Sistema</h1>
          <p className="text-slate-400 text-sm mt-1">// Genera documentos PDF con la información del taller.</p>
        </div>
      </div>

      <div className="border border-[#2a2a2a] bg-[#121212] p-4 rounded-md">
        <div className="flex items-center gap-2 text-[#00ff9d] mb-2">
          <Terminal size={16} /> <span className="font-bold">pdf.generator.sh</span>
        </div>
        <p className="text-slate-400 text-xs">// Selecciona el tipo de reporte que deseas descargar.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Reporte de Clientes */}
        <div className="bg-[#121212] border border-[#2a2a2a] p-6 rounded-md flex flex-col items-center text-center hover:border-[#00ff9d]/50 transition-colors">
          <div className="w-16 h-16 bg-[#1a1a1a] rounded-full flex items-center justify-center mb-4 border border-[#2a2a2a]">
            <Users className="text-[#00ff9d]" size={32} />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Reporte de Clientes</h3>
          <p className="text-slate-400 text-sm mb-6 flex-1">
            Descarga un PDF con el listado completo de los {clients.length} clientes registrados.
          </p>
          <button 
            onClick={() => handleGenerate('clients')}
            disabled={isGenerating}
            className="w-full flex items-center justify-center gap-2 bg-[#00ff9d]/10 text-[#00ff9d] border border-[#00ff9d]/30 py-2.5 rounded hover:bg-[#00ff9d] hover:text-black transition-all disabled:opacity-50"
          >
            <Download size={18} /> {isGenerating ? 'Generando...' : 'Descargar PDF'}
          </button>
        </div>

        {/* Reporte de Equipos */}
        <div className="bg-[#121212] border border-[#2a2a2a] p-6 rounded-md flex flex-col items-center text-center hover:border-[#00b8ff]/50 transition-colors">
          <div className="w-16 h-16 bg-[#1a1a1a] rounded-full flex items-center justify-center mb-4 border border-[#2a2a2a]">
            <MonitorSmartphone className="text-[#00b8ff]" size={32} />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Reporte de Equipos</h3>
          <p className="text-slate-400 text-sm mb-6 flex-1">
            Descarga un PDF con el listado de los {devices.length} equipos y sus propietarios.
          </p>
          <button 
            onClick={() => handleGenerate('devices')}
            disabled={isGenerating}
            className="w-full flex items-center justify-center gap-2 bg-[#00b8ff]/10 text-[#00b8ff] border border-[#00b8ff]/30 py-2.5 rounded hover:bg-[#00b8ff] hover:text-black transition-all disabled:opacity-50"
          >
            <Download size={18} /> {isGenerating ? 'Generando...' : 'Descargar PDF'}
          </button>
        </div>

        {/* Reporte de Servicios */}
        <div className="bg-[#121212] border border-[#2a2a2a] p-6 rounded-md flex flex-col items-center text-center hover:border-[#ff0055]/50 transition-colors">
          <div className="w-16 h-16 bg-[#1a1a1a] rounded-full flex items-center justify-center mb-4 border border-[#2a2a2a]">
            <Wrench className="text-[#ff0055]" size={32} />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Reporte de Servicios</h3>
          <p className="text-slate-400 text-sm mb-6 flex-1">
            Descarga un PDF con el historial de los {services.length} servicios realizados.
          </p>
          <button 
            onClick={() => handleGenerate('services')}
            disabled={isGenerating}
            className="w-full flex items-center justify-center gap-2 bg-[#ff0055]/10 text-[#ff0055] border border-[#ff0055]/30 py-2.5 rounded hover:bg-[#ff0055] hover:text-white transition-all disabled:opacity-50"
          >
            <Download size={18} /> {isGenerating ? 'Generando...' : 'Descargar PDF'}
          </button>
        </div>

      </div>
    </div>
  );
}