import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Terminal, TrendingUp, MonitorSmartphone } from 'lucide-react';
import { clientsService } from '../clients/clientsService';
import { devicesService } from '../devices/devicesService';
import { servicesService } from '../services/servicesService';
import type { Client, Device, Service } from '../../types';

export function StatsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  
  // Estado para los datos de los gráficos
  const [serviceData, setServiceData] = useState<any[]>([]);
  const [deviceData, setDeviceData] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const c = await clientsService.list();
      const d = await devicesService.list();
      const s = await servicesService.list();
      
      setClients(c);
      setDevices(d);
      setServices(s);

      // --- PROCESAMIENTO DE DATOS PARA GRÁFICOS ---
      
      // 1. Gráfico de Equipos (Dona)
      const deviceCounts: Record<string, number> = { PC: 0, Laptop: 0, Celular: 0, Tablet: 0 };
      d.forEach(dev => { if (deviceCounts[dev.type] !== undefined) deviceCounts[dev.type]++; });
      setDeviceData([
        { name: 'PC Escritorio', value: deviceCounts.PC },
        { name: 'Laptops', value: deviceCounts.Laptop },
        { name: 'Celulares', value: deviceCounts.Celular },
        { name: 'Tablets', value: deviceCounts.Tablet },
      ]);

      // 2. Gráfico de Servicios (Barras por tipo)
      const serviceCounts: Record<string, number> = { instalacion_so: 0, actualizacion_hardware: 0, actualizacion_software: 0, limpieza: 0 };
      s.forEach(ser => { if (serviceCounts[ser.type] !== undefined) serviceCounts[ser.type]++; });
      setServiceData([
        { name: 'Instalación SO', servicios: serviceCounts.instalacion_so },
        { name: 'Hardware', servicios: serviceCounts.actualizacion_hardware },
        { name: 'Software', servicios: serviceCounts.actualizacion_software },
        { name: 'Limpieza', servicios: serviceCounts.limpieza },
      ]);
    };
    loadData();

    // Escuchamos cambios para actualizar en tiempo real
    window.addEventListener('revtek-data-changed', loadData);
    return () => window.removeEventListener('revtek-data-changed', loadData);
  }, []);

  const COLORS = ['#00ff9d', '#00b8ff', '#ff0055', '#ffcc00'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Estadísticas del Taller</h1>
          <p className="text-slate-400 text-sm mt-1">// Visualización del rendimiento y tipos de equipos atendidos.</p>
        </div>
      </div>

      <div className="border border-[#2a2a2a] bg-[#121212] p-4 rounded-md">
        <div className="flex items-center gap-2 text-[#00ff9d] mb-2">
          <Terminal size={16} /> <span className="font-bold">analytics.sh</span>
        </div>
        <p className="text-slate-400 text-xs">// Datos generados a partir de {clients.length} clientes, {devices.length} equipos y {services.length} servicios.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Gráfico de Barras: Servicios por Tipo */}
        <div className="bg-[#121212] p-6 rounded-md border border-[#2a2a2a]">
          <h2 className="text-sm font-bold text-[#00ff9d] mb-6 flex items-center gap-2">
            <TrendingUp size={16} /> Servicios por Tipo
          </h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={serviceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2a2a2a" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: '#1a1a1a' }} contentStyle={{ backgroundColor: '#121212', borderColor: '#2a2a2a', color: '#00ff9d', fontSize: '12px' }} />
                <Bar dataKey="servicios" fill="#00ff9d" radius={[2, 2, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico Circular: Distribución de Equipos */}
        <div className="bg-[#121212] p-6 rounded-md border border-[#2a2a2a]">
          <h2 className="text-sm font-bold text-[#00b8ff] mb-6 flex items-center gap-2">
            <MonitorSmartphone size={16} /> Equipos Atendidos
          </h2>
          <div className="h-72 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={deviceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="#0a0a0a"
                >
                  {deviceData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#121212', borderColor: '#2a2a2a', color: '#00b8ff', fontSize: '12px' }} />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  iconType="circle"
                  formatter={(value) => <span style={{ color: '#94a3b8', fontSize: '12px' }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}