import { useEffect, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, LineChart, Line 
} from 'recharts';
import { Terminal, TrendingUp, MonitorSmartphone, DollarSign, Users, Wrench } from 'lucide-react';
import { clientsService } from '../clients/clientsService';
import { devicesService } from '../devices/devicesService';
import { servicesService } from '../services/servicesService';
import { updatesService } from '../updates/updatesService';
import type { Client, Device, Service, Update } from '../../types';

export function StatsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [updates, setUpdates] = useState<Update[]>([]);
  
  // Estados para los datos de los gráficos
  const [serviceData, setServiceData] = useState<any[]>([]);
  const [deviceData, setDeviceData] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [totalIncome, setTotalIncome] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      const c = await clientsService.list();
      const d = await devicesService.list();
      const s = await servicesService.list();
      const u = await updatesService.list();
      
      setClients(c);
      setDevices(d);
      setServices(s);
      setUpdates(u);

      // --- 1. PROCESAMIENTO DE INGRESOS (Actualizaciones) ---
      const income = u.reduce((sum, item) => sum + (item.cost || 0), 0);
      setTotalIncome(income);

      // --- 2. GRÁFICO DE DONA (Distribución de Equipos) ---
      const deviceCounts: Record<string, number> = { PC: 0, Laptop: 0, Celular: 0, Tablet: 0 };
      d.forEach(dev => { if (deviceCounts[dev.type] !== undefined) deviceCounts[dev.type]++; });
      setDeviceData([
        { name: 'PC Escritorio', value: deviceCounts.PC },
        { name: 'Laptops', value: deviceCounts.Laptop },
        { name: 'Celulares', value: deviceCounts.Celular },
        { name: 'Tablets', value: deviceCounts.Tablet },
      ]);

      // --- 3. GRÁFICO DE BARRAS (Servicios por Tipo) ---
      const serviceCounts: Record<string, number> = { instalacion_so: 0, actualizacion_hardware: 0, actualizacion_software: 0, limpieza: 0 };
      s.forEach(ser => { if (serviceCounts[ser.type] !== undefined) serviceCounts[ser.type]++; });
      setServiceData([
        { name: 'Instalación SO', servicios: serviceCounts.instalacion_so },
        { name: 'Hardware', servicios: serviceCounts.actualizacion_hardware },
        { name: 'Software', servicios: serviceCounts.actualizacion_software },
        { name: 'Limpieza', servicios: serviceCounts.limpieza },
      ]);

      // --- 4. GRÁFICO DE LÍNEAS (Tendencia Mensual) ---
      // Agrupamos los servicios por mes (últimos 6 meses)
      const monthlyCounts: Record<string, number> = {};
      const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      
      // Inicializamos los últimos 6 meses en 0
      const today = new Date();
      for (let i = 5; i >= 0; i--) {
        const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const monthName = months[d.getMonth()];
        monthlyCounts[monthName] = 0;
      }

      // Contamos los servicios por mes
      s.forEach(ser => {
        const date = new Date(ser.date);
        const monthName = months[date.getMonth()];
        if (monthlyCounts[monthName] !== undefined) {
          monthlyCounts[monthName]++;
        }
      });

      const monthlyArray = Object.keys(monthlyCounts).map(month => ({
        name: month,
        servicios: monthlyCounts[month]
      }));
      setMonthlyData(monthlyArray);
    };

    loadData();
    window.addEventListener('revtek-data-changed', loadData);
    return () => window.removeEventListener('revtek-data-changed', loadData);
  }, []);

  const COLORS = ['#00ff9d', '#00b8ff', '#ff0055', '#ffcc00'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Estadísticas del Taller</h1>
          <p className="text-slate-400 text-sm mt-1">// Visualización completa del rendimiento del negocio.</p>
        </div>
      </div>

      {/* --- TARJETAS KPI --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#121212] border border-[#2a2a2a] p-4 rounded-md flex items-center gap-4">
          <div className="p-2 bg-[#1a1a1a] rounded text-[#00ff9d] border border-[#2a2a2a]"><Users size={20} /></div>
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider">Clientes</p>
            <p className="text-2xl font-bold text-slate-200">{clients.length}</p>
          </div>
        </div>
        <div className="bg-[#121212] border border-[#2a2a2a] p-4 rounded-md flex items-center gap-4">
          <div className="p-2 bg-[#1a1a1a] rounded text-[#00b8ff] border border-[#2a2a2a]"><MonitorSmartphone size={20} /></div>
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider">Equipos</p>
            <p className="text-2xl font-bold text-slate-200">{devices.length}</p>
          </div>
        </div>
        <div className="bg-[#121212] border border-[#2a2a2a] p-4 rounded-md flex items-center gap-4">
          <div className="p-2 bg-[#1a1a1a] rounded text-[#ff0055] border border-[#2a2a2a]"><Wrench size={20} /></div>
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider">Servicios</p>
            <p className="text-2xl font-bold text-slate-200">{services.length}</p>
          </div>
        </div>
        <div className="bg-[#121212] border border-[#2a2a2a] p-4 rounded-md flex items-center gap-4">
          <div className="p-2 bg-[#1a1a1a] rounded text-[#ffcc00] border border-[#2a2a2a]"><DollarSign size={20} /></div>
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider">Ingresos Totales</p>
            <p className="text-2xl font-bold text-slate-200">Bs. {totalIncome}</p>
          </div>
        </div>
      </div>

      <div className="border border-[#2a2a2a] bg-[#121212] p-4 rounded-md">
        <div className="flex items-center gap-2 text-[#00ff9d] mb-2">
          <Terminal size={16} /> <span className="font-bold">analytics.sh</span>
        </div>
        <p className="text-slate-400 text-xs">// Datos generados en tiempo real a partir de la actividad del taller.</p>
      </div>

      {/* --- FILA 1: GRÁFICOS --- */}
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
                <Pie data={deviceData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value" stroke="#0a0a0a">
                  {deviceData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#121212', borderColor: '#2a2a2a', color: '#00b8ff', fontSize: '12px' }} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" formatter={(value) => <span style={{ color: '#94a3b8', fontSize: '12px' }}>{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* --- FILA 2: TENDENCIA --- */}
      <div className="bg-[#121212] p-6 rounded-md border border-[#2a2a2a]">
        <h2 className="text-sm font-bold text-[#ffcc00] mb-6 flex items-center gap-2">
          <TrendingUp size={16} /> Tendencia de Servicios (Últimos 6 meses)
        </h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2a2a2a" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#121212', borderColor: '#2a2a2a', color: '#ffcc00', fontSize: '12px' }} />
              <Line type="monotone" dataKey="servicios" stroke="#ffcc00" strokeWidth={3} dot={{ r: 4, fill: '#ffcc00' }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}