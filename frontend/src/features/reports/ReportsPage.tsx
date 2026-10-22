import { useState, useEffect } from 'react';
import { FileText, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { clientsService } from '../clients/clientsService';
import type { Client } from '../../types';

export function ReportsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    // Cargamos los clientes reales al entrar a la página
    clientsService.list().then(setClients);
  }, []);

  const generatePDF = async () => {
    setIsGenerating(true);
    
    // Obtenemos los datos más frescos por si acaso
    const currentClients = await clientsService.list();

    const doc = new jsPDF();
    
    // --- Encabezado del PDF ---
    doc.setFontSize(22);
    doc.setTextColor(31, 99, 214); // Azul de la marca
    doc.text('Revtek - Servicio Técnico', 14, 20);
    
    doc.setFontSize(12);
    doc.setTextColor(100, 116, 139);
    doc.text('Reporte General de Clientes Registrados', 14, 30);
    doc.text(`Fecha de emisión: ${new Date().toLocaleString()}`, 14, 36);
    doc.text(`Total de clientes: ${currentClients.length}`, 14, 42);

    // --- Tabla con Datos Reales ---
    // Si no hay clientes, mostramos un mensaje
    if (currentClients.length === 0) {
      doc.setFontSize(14);
      doc.setTextColor(200, 0, 0);
      doc.text('No hay clientes registrados en el sistema actualmente.', 14, 60);
    } else {
      // Mapeamos los clientes reales a un formato de filas y columnas
      const tableData = currentClients.map((client, index) => [
        (index + 1).toString(), // ID o número
        client.fullName,
        client.email,
        client.phone,
        client.address
      ]);

      autoTable(doc, {
        startY: 50, // Empezar la tabla debajo del encabezado
        head: [['#', 'Nombre Completo', 'Correo Electrónico', 'Teléfono', 'Dirección']],
        body: tableData,
        theme: 'grid',
        headStyles: { 
          fillColor: [31, 99, 214], 
          textColor: 255, 
          fontStyle: 'bold' 
        },
        alternateRowStyles: { 
          fillColor: [248, 250, 252] 
        },
        styles: { 
          fontSize: 9, 
          cellPadding: 4 
        },
      });
    }

    // Guardar el archivo
    doc.save(`Reporte_Clientes_Revtek_${new Date().toISOString().split('T')[0]}.pdf`);
    setIsGenerating(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Reportes del Sistema</h1>
        <p className="text-slate-500 text-sm mt-1">Genera documentos PDF con la información del taller.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tarjeta de Reporte de Clientes */}
        <div 
          className="card flex flex-col items-center justify-center p-8 text-center space-y-4 border-2 border-dashed border-slate-200 hover:border-brand-500 hover:bg-brand-50/30 transition-all cursor-pointer group" 
          onClick={generatePDF}
        >
          <div className="h-16 w-16 bg-blue-50 text-brand-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <FileText className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">Reporte de Clientes</h2>
            <p className="text-sm text-slate-500 mt-1 max-w-[250px]">
              Descarga un PDF con el listado completo de los {clients.length} clientes registrados.
            </p>
          </div>
          <button className="btn-primary mt-2 shadow-lg shadow-brand-500/30" disabled={isGenerating}>
            <Download className="h-4 w-4" /> 
            {isGenerating ? 'Generando...' : 'Descargar PDF'}
          </button>
        </div>
      </div>
    </div>
  );
}