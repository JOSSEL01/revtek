import { useEffect, useState } from 'react';
import { Users, MonitorSmartphone, Wrench, Clock } from 'lucide-react';
import { clientsService } from '../clients/clientsService';
// Nota: Cuando creemos los servicios de equipos y servicios, los importaremos aquí también.

export function DashboardPage() {
  const [stats, setStats] = useState({
    clients: 0,
    devices: 0,
    services: 0,
  });

  useEffect(() => {
    // Función para cargar los datos reales
    const loadStats = async () => {
      // 1. Cargar clientes reales
      const clients = await clientsService.list();
      
      // 2. Simular carga de equipos y servicios (por ahora 0 hasta que hagamos sus CRUDs)
      const devices = JSON.parse(localStorage.getItem('revtek-devices-mock') || '[]');
      const services = JSON.parse(localStorage.getItem('revtek-services-mock') || '[]');

      setStats({
        clients: clients.length,
        devices: devices.length,
        services: services.length,
      });
    };

    loadStats();
  }, []);

  const cards = [
    { label: 'Clientes Registrados', value: stats.clients.toString(), icon: Users, color: 'bg-blue-500' },
    { label: 'Equipos en Taller', value: stats.devices.toString(), icon: MonitorSmartphone, color: 'bg-amber-500' },
    { label: 'Servicios Realizados', value: stats.services.toString(), icon: Wrench, color: 'bg-emerald-500' },
    { label: 'Tiempo Promedio', value: '2 días', icon: Clock, color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Panel de Control</h1>
        <p className="text-slate-500 text-sm mt-1">Resumen general de la actividad en el taller Revtek.</p>
      </div>

      {/* Tarjetas de Estadísticas (KPIs) Dinámicas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((stat, i) => (
          <div key={i} className="card p-5 flex items-center gap-4 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            <div className={`p-3 rounded-xl text-white ${stat.color}`}>
              <stat.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Sección de Bienvenida / Tareas Rápidas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="card lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-slate-800 border-b pb-2">Últimos Ingresos</h2>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100 hover:bg-slate-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center font-bold">
                    L
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">Laptop HP Pavilion</p>
                    <p className="text-xs text-slate-500">Cliente: Juan Pérez</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">En revisión</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card space-y-4">
          <h2 className="text-lg font-bold text-slate-800 border-b pb-2">Accesos Rápidos</h2>
          <button className="w-full btn-primary justify-start">
            <Users className="h-4 w-4" /> Nuevo Cliente
          </button>
          <button className="w-full btn-secondary justify-start">
            <MonitorSmartphone className="h-4 w-4" /> Registrar Equipo
          </button>
        </div>
      </div>
    </div>
  );
}