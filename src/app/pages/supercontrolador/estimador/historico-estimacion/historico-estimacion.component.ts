/**********************************************************************
 *  HISTÓRICO DE ESTIMACIONES ― Smart3Z
 *  Ruta     : src/app/pages/supercontrolador/…
 *  Archivo  : historico-estimacion.component.ts
 *  Objetivo :
 *  - Mostrar todas las estimaciones guardadas de un proyecto.
 *  - Permitir descargar cada estimación como PDF (sin páginas en
 *    blanco) usando jsPDF + autotable.
 *  - Convertir los campos JSON del API a objetos útiles para la UI.
 *********************************************************************/

/* ------------------------------------------------------------------ */
/*  IMPORTACIONES                                                     */
/* ------------------------------------------------------------------ */
/* Angular / Ionic -------------------------------------------------- */
import { CommonModule }               from '@angular/common';
import { Component, Input, OnInit }   from '@angular/core';
import { FormsModule }                from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';

/* Librerías externas ---------------------------------------------- */
import html2pdf                       from 'html2pdf.js'; // (no se usa aquí, pero puede emplearse fuera)
import { jsPDF }                      from 'jspdf';
import autoTable                      from 'jspdf-autotable';

/* Servicios propios ------------------------------------------------ */
import { EstimacionesService }        from 'src/app/services/estimaciones.service';

/* ------------------------------------------------------------------ */
/*  TIPOS                                                             */
/* ------------------------------------------------------------------ */
/** Estructura exacta devuelta por la API */
interface EstimacionAPI {
  id_estimacion   : number;
  fecha_generada  : string;
  total_horas     : number;
  coste_total     : number;
  resumen_json    : string;
  calendario_json : string;
}

/** Estructura adaptada para la UI */
interface EstimacionUI
  extends Omit<EstimacionAPI, 'resumen_json' | 'calendario_json'> {
  resumen    : any[];   // ← objeto real (parsed)
  calendario : any;     // ← objeto real (parsed)
}

/* ------------------------------------------------------------------ */
/*  COMPONENTE                                                        */
/* ------------------------------------------------------------------ */
@Component({
  standalone : true,                                 // Ng14+ modo autónomo
  selector   : 'app-historico-estimacion',           // etiqueta HTML
  templateUrl: './historico-estimacion.component.html',
  styleUrls  : ['./historico-estimacion.component.scss'],
  imports    : [CommonModule, IonicModule, FormsModule],
})
export class HistoricoEstimacionComponent implements OnInit {

  /* ======================= @INPUTS ======================= */
  /** Identificador del proyecto del que se muestran las estimaciones */
  @Input() proyectoId!: number;

  /* ======================= PROPIEDADES =================== */
  segmentoActual = 'jornada';   // (por si hay segmentos/filtros)
  items: EstimacionUI[] = [];   // Lista en la vista (accordion)

  /* -------------------- CONSTRUCTOR -------------------- *
   *  Solo inyectamos el servicio que consulta el backend.
   */
  constructor(private estSrv: EstimacionesService) {}

  /* ======================================================
     CICLO DE VIDA
     ====================================================== */
  /** ngOnInit
   *  ----------------------------------------------------
   *  1. Comprueba que exista proyectoId.
   *  2. Llama al servicio y transforma los JSON strings
   *     en objetos reales para la vista.
   */
  ngOnInit(): void {
    if (!this.proyectoId) return;

    this.estSrv.getHistorico(this.proyectoId).subscribe({
      next : resp => this.items = resp.map<EstimacionUI>(e => ({
        ...e,
        resumen    : e.resumen_json    ? JSON.parse(e.resumen_json)    : [],
        calendario : e.calendario_json ? JSON.parse(e.calendario_json) : {}
      })),
      error: err => console.error('[HISTÓRICO] Error cargando:', err)
    });
  }

  /* ======================================================
     DESCARGA DE PDF
     ====================================================== */

  /**
   * descargarPDF
   * ------------------------------------------------------
   * Genera un PDF resumen de la estimación seleccionada
   * sin dejar páginas en blanco (usa jsPDF + autotable).
   * @param e Estimación que se va a exportar.
   */
  descargarPDF(e: EstimacionUI): void {

    /* ---------- 1. Instancia base de jsPDF ---------- */
    const doc = new jsPDF({
      orientation: 'portrait',
      unit       : 'mm',
      format     : 'a4',
    });

    const socialRate = e.calendario?.socialRate ?? 0;

    /* ---------- 2. Cabecera del documento ---------- */
    doc.setFontSize(16);
    doc.text('Estimación del proyecto', 105, 15, { align: 'center' });

    doc.setFontSize(11);
    doc.text(`Fecha: ${new Date(e.fecha_generada).toLocaleString()}`, 15, 25);
    doc.text(`Total de horas: ${e.total_horas}`,                     15, 32);
    doc.text(
      `Coste total: ${e.coste_total.toLocaleString('es-ES', {
        style: 'currency',
        currency: 'EUR'
      })}`,
      15, 39
    );

    /* ---------- 3. Tabla de perfiles (autotable) ---------- */
    const head = [[
      'Perfil', 'Horas', 'Plantilla',
      'Coste base', 'Coste social', 'Coste total', 'Capacidad'
    ]];

    /* Generar body a partir del resumen */
    const body = e.resumen.map(r => {
      const costeBase    = r.coste / (1 + socialRate / 100);
      const costeSocial  = r.coste - costeBase;
      const capacidadOk  = r.hayCapacidad ? 'Sí' : 'No';

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

    /* Configuración y render de la tabla */
    autoTable(doc, {
      head,
      body,
      startY      : 46,
      styles      : { fontSize: 9 },
      headStyles  : { fillColor: [0, 123, 255] },  // color primario
      columnStyles: {
        3: { halign: 'right' },
        4: { halign: 'right' },
        5: { halign: 'right' },
        6: { halign: 'center' },
      }
    });

    /* ---------- 4. Guardar el archivo ---------- */
    doc.save(`estimacion_${e.id_estimacion}.pdf`);
  }
}
