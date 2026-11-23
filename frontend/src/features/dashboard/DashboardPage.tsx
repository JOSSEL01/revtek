import { useEffect, useState } from 'react';
import { Users, MonitorSmartphone, Wrench, Clock, TrendingUp, Laptop, Smartphone } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { clientsService } from '../clients/clientsService';

export function DashboardPage() {
  const [stats, setStats] = useState({
    clients: 0,
    devices: 0,
    services: 0,
  });

  const dataBar = [
    { name: 'Instalación SO', cantidad: 12 },
    { name: 'Hardware', cantidad: 19 },
    { name: 'Software', cantidad: 8 },
    { name: 'Limpieza', cantidad: 15 },
  ];

  const dataPie = [
    { name: 'PC Escritorio', value: 10 },
    { name: 'Laptop', value: 15 },
    { name: 'Celular', value: 8 },
    { name: 'Tablet', value: 3 },
  ];
  const COLORS = ['#1152d4', '#3b7df6', '#e95420', '#f59e0b'];

  useEffect(() => {
    const loadStats = async () => {
      try {
        const clients = await clientsService.list();
        const devices = JSON.parse(localStorage.getItem('revtek-devices-mock') || '[]');
        const services = JSON.parse(localStorage.getItem('revtek-services-mock') || '[]');

        setStats({
          clients: clients.length,
          devices: devices.length,
          services: services.length,
        });
      } catch (error) {
        console.error("Error al cargar stats", error);
      }
    };

    loadStats();
  }, []);

  const cards = [
    { label: 'Clientes', value: stats.clients.toString(), icon: Users, color: 'bg-[#1152d4]' },
    { label: 'Equipos', value: stats.devices.toString(), icon: MonitorSmartphone, color: 'bg-indigo-600' },
    { label: 'Servicios', value: stats.services.toString(), icon: Wrench, color: 'bg-[#e95420]' },
    { label: 'Tiempo Promedio', value: '2 días', icon: Clock, color: 'bg-emerald-600' },
  ];

  return (
    <div className="space-y-6">
      {/* Tarjetas KPI */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`p-3 rounded-lg text-white ${stat.color}`}>
              <stat.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <TrendingUp size={20} className="text-[#1152d4]" /> Servicios por Tipo
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataBar} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: 'none' }} />
                <Bar dataKey="cantidad" fill="#1152d4" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <MonitorSmartphone size={20} className="text-[#e95420]" /> Distribución de Equipos
          </h3>
          <div className="h-72 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={dataPie} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                  {dataPie.map((item, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3 ml-4">
              {dataPie.map((item, index) => (
                <div key={item.name} className="flex items-center gap-2 text-sm">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></span>
                  <span className="text-slate-600">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Accesos Rápidos */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Accesos Rápidos</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 rounded-lg border border-slate-200 hover:border-[#1152d4] hover:bg-blue-50 transition-colors text-center group">
            <Users className="mx-auto text-slate-400 group-hover:text-[#1152d4] mb-2" size={24} />
            <span className="text-sm font-semibold text-slate-700">Nuevo Cliente</span>
          </button>
          <button className="p-4 rounded-lg border border-slate-200 hover:border-[#1152d4] hover:bg-blue-50 transition-colors text-center group">
            <Laptop className="mx-auto text-slate-400 group-hover:text-[#1152d4] mb-2" size={24} />
            <span className="text-sm font-semibold text-slate-700">Registrar Equipo</span>
          </button>
          <button className="p-4 rounded-lg border border-slate-200 hover:border-[#1152d4] hover:bg-blue-50 transition-colors text-center group">
            <Wrench className="mx-auto text-slate-400 group-hover:text-[#1152d4] mb-2" size={24} />
            <span className="text-sm font-semibold text-slate-700">Nuevo Servicio</span>
          </button>
          <button className="p-4 rounded-lg border border-slate-200 hover:border-[#1152d4] hover:bg-blue-50 transition-colors text-center group">
            <Smartphone className="mx-auto text-slate-400 group-hover:text-[#1152d4] mb-2" size={24} />
            <span className="text-sm font-semibold text-slate-700">Registrar Celular</span>
          </button>
        </div>
      </div>
    </div>
  );
}