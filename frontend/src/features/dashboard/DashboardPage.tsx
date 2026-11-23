import { useEffect, useState } from 'react';
import { Users, MonitorSmartphone, Wrench, Clock, Laptop, Smartphone, Terminal } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { clientsService } from '../clients/clientsService';
import { devicesService } from '../devices/devicesService';
import { servicesService } from '../services/servicesService';

export function DashboardPage() {
  const [stats, setStats] = useState({ clients: 0, devices: 0, services: 0 });
  const [dataPie, setDataPie] = useState<any[]>([]);
  const [dataBar, setDataBar] = useState<any[]>([]);

  const loadStats = async () => {
    try {
      // 1. Traemos los datos reales
      const clients = await clientsService.list();
      const devices = await devicesService.list();
      const services = await servicesService.list();

      // 2. Actualizamos los contadores
      setStats({ clients: clients.length, devices: devices.length, services: services.length });

      // 3. Agrupamos equipos para el gráfico de dona
      const deviceCounts: Record<string, number> = { PC: 0, Laptop: 0, Celular: 0, Tablet: 0 };
      devices.forEach(d => { if (deviceCounts[d.type] !== undefined) deviceCounts[d.type]++; });
      setDataPie([
        { name: 'PC', value: deviceCounts.PC },
        { name: 'Laptop', value: deviceCounts.Laptop },
        { name: 'Celular', value: deviceCounts.Celular },
        { name: 'Tablet', value: deviceCounts.Tablet },
      ]);

      // 4. Agrupamos servicios para el gráfico de barras
      const serviceCounts: Record<string, number> = { instalacion_so: 0, actualizacion_hardware: 0, actualizacion_software: 0, limpieza: 0 };
      services.forEach(s => { if (serviceCounts[s.type] !== undefined) serviceCounts[s.type]++; });
      setDataBar([
        { name: 'SO', cantidad: serviceCounts.instalacion_so },
        { name: 'HW', cantidad: serviceCounts.actualizacion_hardware },
        { name: 'SW', cantidad: serviceCounts.actualizacion_software },
        { name: 'Limp', cantidad: serviceCounts.limpieza },
      ]);

    } catch (error) {
      console.error("Error al cargar stats", error);
    }
  };

  useEffect(() => {
    loadStats();
    // Escuchamos el evento para actualizar si hay cambios
    window.addEventListener('revtek-data-changed', loadStats);
    
    // Limpiamos el evento al salir del componente
    return () => {
      window.removeEventListener('revtek-data-changed', loadStats);
    };
  }, []);

  const COLORS = ['#00ff9d', '#00b8ff', '#ff0055', '#ffcc00'];

  const cards = [
    { label: 'CLIENTES', value: stats.clients.toString(), icon: Users },
    { label: 'EQUIPOS', value: stats.devices.toString(), icon: MonitorSmartphone },
    { label: 'SERVICIOS', value: stats.services.toString(), icon: Wrench },
    { label: 'TIEMPO', value: '2d', icon: Clock },
  ];

  return (
    <div className="space-y-6">
      <div className="border border-[#2a2a2a] bg-[#121212] p-4 rounded-md">
        <div className="flex items-center gap-2 text-[#00ff9d] mb-2">
          <Terminal size={16} /> <span className="font-bold">system.status</span>
        </div>
        <p className="text-slate-400 text-xs">// Resumen general de la actividad en el taller Revtek.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((stat, i) => (
          <div key={i} className="bg-[#121212] border border-[#2a2a2a] p-4 rounded-md flex items-center gap-4 hover:border-[#00ff9d]/50 transition-colors">
            <div className="p-2 rounded bg-[#1a1a1a] border border-[#2a2a2a] text-[#00ff9d]">
              <stat.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-200 mt-1">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#121212] p-5 rounded-md border border-[#2a2a2a]">
          <h3 className="text-sm font-bold text-[#00ff9d] mb-4 flex items-center gap-2">
            <span className="text-slate-500">$</span> cat servicios.log
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataBar} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2a2a2a" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: '#1a1a1a' }} contentStyle={{ backgroundColor: '#121212', borderColor: '#2a2a2a', color: '#00ff9d', fontSize: '12px' }} />
                <Bar dataKey="cantidad" fill="#00ff9d" radius={[2, 2, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#121212] p-5 rounded-md border border-[#2a2a2a]">
          <h3 className="text-sm font-bold text-[#00b8ff] mb-4 flex items-center gap-2">
            <span className="text-slate-500">$</span> ls /devices
          </h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={dataPie} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="value" stroke="#0a0a0a">
                  {dataPie.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#121212', borderColor: '#2a2a2a', color: '#00b8ff', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 ml-4">
              {dataPie.map((item, index) => (
                <div key={item.name} className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: COLORS[index] }}></span>
                  <span>{item.name}: {item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#121212] p-5 rounded-md border border-[#2a2a2a]">
        <h3 className="text-sm font-bold text-slate-300 mb-4">// ejecutar_comando</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button className="p-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-md hover:border-[#00ff9d] hover:text-[#00ff9d] transition-colors text-center group flex flex-col items-center gap-2">
            <Users size={20} className="text-slate-500 group-hover:text-[#00ff9d]" />
            <span className="text-xs text-slate-400 group-hover:text-[#00ff9d]">new_client.sh</span>
          </button>
          <button className="p-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-md hover:border-[#00b8ff] hover:text-[#00b8ff] transition-colors text-center group flex flex-col items-center gap-2">
            <Laptop size={20} className="text-slate-500 group-hover:text-[#00b8ff]" />
            <span className="text-xs text-slate-400 group-hover:text-[#00b8ff]">add_device.sh</span>
          </button>
          <button className="p-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-md hover:border-[#ff0055] hover:text-[#ff0055] transition-colors text-center group flex flex-col items-center gap-2">
            <Wrench size={20} className="text-slate-500 group-hover:text-[#ff0055]" />
            <span className="text-xs text-slate-400 group-hover:text-[#ff0055]">new_service.sh</span>
          </button>
          <button className="p-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-md hover:border-[#ffcc00] hover:text-[#ffcc00] transition-colors text-center group flex flex-col items-center gap-2">
            <Smartphone size={20} className="text-slate-500 group-hover:text-[#ffcc00]" />
            <span className="text-xs text-slate-400 group-hover:text-[#ffcc00]">add_mobile.sh</span>
          </button>
        </div>
      </div>
    </div>
  );
}