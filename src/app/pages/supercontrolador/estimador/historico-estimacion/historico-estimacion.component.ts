/**********************************************************************
 * Histórico de estimaciones
 *********************************************************************/

import { CommonModule }  from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { IonicModule }   from '@ionic/angular';
import html2pdf          from 'html2pdf.js';
import { EstimacionesService } from 'src/app/services/estimaciones.service';

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

    // 1 ▸ Localizamos el div con la estimación
    const element = document.getElementById(`estimacion-${e.id_estimacion}`);
    if (!element) return;

    // 2 ▸ Abrimos el accordion si está cerrado
    const accordion = element.closest('ion-accordion') as any;
    const group     = accordion?.closest('ion-accordion-group') as any;

    // valor antes de abrir, para restaurarlo luego
    const prevValue = group?.value;

    // Ion 7 usa el atributo/property 'value' para marcar el abierto
    if (accordion && group && prevValue !== accordion.value) {
      group.value = accordion.value;          // abre el actual
    }

    // 3 ▸ Esperamos a que el DOM pinte el contenido
    setTimeout(() => {

      const options: any = {
        margin      : 10,
        filename    : `estimacion_${e.id_estimacion}.pdf`,
        html2canvas : { scale: 2, useCORS: true, allowTaint: true },
        jsPDF       : { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak   : { mode: ['avoid-all', 'css', 'legacy'] },
      };

      // 4 ▸ IMPORTANTE: primero .from(), luego .set(), luego .save()
      html2pdf()
        .from(element)
        .set(options)
        .save()
        .then(() => {
          // 5 ▸ Cerramos el accordion si antes estaba cerrado
          if (group && prevValue !== accordion.value) {
            group.value = prevValue;
          }
        });

    }, 200);   // 100 ms es suficiente para que el accordion se pinte
  }

}
