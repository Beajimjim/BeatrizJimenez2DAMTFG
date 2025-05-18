/**********************************************************************
 * Histórico de estimaciones
 *********************************************************************/

import { CommonModule }  from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { IonicModule }   from '@ionic/angular';
import html2pdf          from 'html2pdf.js';
import { EstimacionesService } from 'src/app/services/estimaciones.service';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

/* ------------------------------------------------------------------ */
/*  Tipos                                                             */
/* ------------------------------------------------------------------ */
interface EstimacionAPI {
  id_estimacion : number;
  fecha_generada: string;
  total_horas   : number;
  coste_total   : number;
  resumen_json  : string;
  calendario_json: string;
}
interface EstimacionUI extends Omit<EstimacionAPI,
  'resumen_json'|'calendario_json'> {
  resumen   : any[];
  calendario: any;
}

/* ------------------------------------------------------------------ */
/*  Componente                                                         */
/* ------------------------------------------------------------------ */
@Component({
  standalone: true,
  selector   : 'app-historico-estimacion',
  templateUrl: './historico-estimacion.component.html',
  styleUrls  : ['./historico-estimacion.component.scss'],
  imports    : [CommonModule, IonicModule, FormsModule],
})
export class HistoricoEstimacionComponent implements OnInit {

  @Input() proyectoId!: number;

  segmentoActual = 'jornada';
  items: EstimacionUI[] = [];

  constructor(private estSrv: EstimacionesService) {}

  ngOnInit(): void {
    if (!this.proyectoId) return;

    this.estSrv.getHistorico(this.proyectoId).subscribe({
      next : resp => this.items = resp.map(e => ({
        ...e,
        resumen   : e.resumen_json    ? JSON.parse(e.resumen_json)    : [],
        calendario: e.calendario_json ? JSON.parse(e.calendario_json) : {}
      })),
      error: err => console.error(err)
    });
  }

   /* ================================================================
   *  Generar PDF sin páginas en blanco
   * ================================================================*/
 descargarPDF(e: EstimacionUI): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const socialRate = e.calendario?.socialRate ?? 0;

  doc.setFontSize(16);
  doc.text('Estimación del proyecto', 105, 15, { align: 'center' });

  doc.setFontSize(11);
  doc.text(`Fecha: ${new Date(e.fecha_generada).toLocaleString()}`, 15, 25);
  doc.text(`Total de horas: ${e.total_horas}`, 15, 32);
  doc.text(`Coste total: ${e.coste_total.toLocaleString('es-ES',{style:'currency',currency:'EUR'})}`, 15, 39);

  const head = [['Perfil', 'Horas', 'Plantilla', 'Coste base', 'Coste social', 'Coste total', 'Capacidad']];
  const body = e.resumen.map(r => {
    const costeBase = r.coste / (1 + socialRate / 100);
    const costeSocial = r.coste - costeBase;
    const capacidadOk = r.hayCapacidad ? 'Sí' : 'No';

    return [
      r.nombre,
      r.horas,
      r.plantillaFinal,
      costeBase.toFixed(2),
      costeSocial.toFixed(2),
      r.coste.toFixed(2),
      capacidadOk
    ];
  });

  autoTable(doc, {
    head,
    body,
    startY: 46,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [0, 123, 255] },
    columnStyles: {
      3: { halign: 'right' },
      4: { halign: 'right' },
      5: { halign: 'right' },
      6: { halign: 'center' },
    }
  });

  doc.save(`estimacion_${e.id_estimacion}.pdf`);
}

}
