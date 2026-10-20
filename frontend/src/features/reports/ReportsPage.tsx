import { FileText, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function ReportsPage() {
  const generatePDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.setTextColor(31, 99, 214);
    doc.text('Revtek - Servicio Tecnico', 14, 20);
    
    doc.setFontSize(11);
    doc.setTextColor(100, 116, 139);
    doc.text('Reporte General de Clientes Registrados', 14, 28);
    doc.text(`Fecha de emision: ${new Date().toLocaleDateString()}`, 14, 34);

    const tableData = [
      ['1', 'Juan Perez', 'juan@email.com', '+591 77777777', 'Av. Principal 123'],
      ['2', 'Maria Gomez', 'maria@email.com', '+591 66666666', 'Calle Secundaria 456'],
    ];

    autoTable(doc, {
      startY: 40,
      head: [['ID', 'Nombre', 'Correo', 'Telefono', 'Direccion']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [31, 99, 214], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      styles: { fontSize: 10, cellPadding: 4 },
    });

    doc.save('Reporte_Clientes_Revtek.pdf');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Reportes del Sistema</h1>
        <p className="text-slate-500 text-sm mt-1">Genera documentos PDF con la informacion del taller.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div 
          className="card flex flex-col items-center justify-center p-8 text-center space-y-4 border-2 border-dashed border-slate-200 hover:border-brand-500 transition-colors cursor-pointer" 
          onClick={generatePDF}
        >
          <div className="h-16 w-16 bg-blue-50 text-brand-600 rounded-full flex items-center justify-center">
            <FileText className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">Reporte de Clientes</h2>
            <p className="text-sm text-slate-500 mt-1 max-w-[250px]">Descarga un PDF con el listado completo de clientes registrados.</p>
          </div>
          <button className="btn-primary mt-2 pointer-events-none">
            <Download className="h-4 w-4" /> Descargar PDF
          </button>
        </div>
      </div>
    </div>
  );
}