import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Client, Device, Service } from '../types';

const addHeader = (doc: jsPDF, title: string) => {
  doc.setFillColor(10, 10, 10);
  doc.rect(0, 0, 210, 30, 'F');
  
  doc.setTextColor(0, 255, 157);
  doc.setFontSize(20);
  doc.setFont('courier', 'bold');
  doc.text('REVTEK.SYS', 14, 15);
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('courier', 'normal');
  doc.text(`> ${title}`, 14, 23);
  
  doc.setTextColor(150, 150, 150);
  doc.setFontSize(8);
  doc.text(`Generado: ${new Date().toLocaleString()}`, 140, 23);
};

const addFooter = (doc: jsPDF) => {
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(8);
    doc.text(`Sistema de Gestión Técnico - Revtek | Página ${i} de ${pageCount}`, 105, 290, { align: 'center' });
  }
};

export const generateClientsReport = (clients: Client[]) => {
  const doc = new jsPDF();
  addHeader(doc, 'Reporte de Clientes');

  const tableData = clients.map((c, i) => [
    (i + 1).toString(),
    c.fullName,
    c.email,
    c.phone,
    c.address
  ]);

  autoTable(doc, {
    startY: 40,
    head: [['#', 'Nombre', 'Email', 'Teléfono', 'Dirección']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [0, 255, 157], textColor: [0, 0, 0], fontStyle: 'bold' },
    styles: { fontSize: 9, font: 'courier' },
    alternateRowStyles: { fillColor: [245, 245, 245] },
  });

  addFooter(doc);
  doc.save('reporte-clientes.pdf');
};

export const generateDevicesReport = (devices: Device[], clients: Client[]) => {
  const doc = new jsPDF();
  addHeader(doc, 'Reporte de Equipos');

  const tableData = devices.map((d, i) => {
    const client = clients.find(c => c.id === d.clientId);
    return [
      (i + 1).toString(),
      d.type,
      d.brand,
      d.model,
      d.specs,
      client ? client.fullName : 'N/A',
      d.status.replace('_', ' ').toUpperCase()
    ];
  });

  autoTable(doc, {
    startY: 40,
    head: [['#', 'Tipo', 'Marca', 'Modelo', 'Specs', 'Propietario', 'Estado']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [0, 184, 255], textColor: [255, 255, 255], fontStyle: 'bold' },
    styles: { fontSize: 8, font: 'courier' },
    alternateRowStyles: { fillColor: [245, 245, 245] },
  });

  addFooter(doc);
  doc.save('reporte-equipos.pdf');
};

export const generateServicesReport = (services: Service[], devices: Device[]) => {
  const doc = new jsPDF();
  addHeader(doc, 'Reporte de Servicios');

  const tableData = services.map((s, i) => {
    const device = devices.find(d => d.id === s.deviceId);
    return [
      (i + 1).toString(),
      device ? `${device.brand} ${device.model}` : 'N/A',
      s.type.replace(/_/g, ' ').toUpperCase(),
      s.description,
      s.date
    ];
  });

  autoTable(doc, {
    startY: 40,
    head: [['#', 'Equipo', 'Tipo', 'Descripción', 'Fecha']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [255, 0, 85], textColor: [255, 255, 255], fontStyle: 'bold' },
    styles: { fontSize: 9, font: 'courier' },
    alternateRowStyles: { fillColor: [245, 245, 245] },
  });

  addFooter(doc);
  doc.save('reporte-servicios.pdf');
};