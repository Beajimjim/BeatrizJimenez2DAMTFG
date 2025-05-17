import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { EstimadorService } from 'src/app/services/estimador.service';
import { EstimacionesService, EstimacionPayload } from 'src/app/services/estimaciones.service';

@Component({
  selector: 'app-resumen-estimacion',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './resumen-estimacion.component.html',
})
export class ResumenEstimacionComponent implements OnInit {
  @Input() tareas: any[] = [];
  @Input() proyectoId!: number;

  /* ★ lista solo con tareas pendientes */
  private pendientes: any[] = [];

  totalHoras = 0;
  calendario: any;
  perfiles: any[] = [];

  resultadoPorPerfil: {
    nombre: string;
    horas: number;
    picoConcurrencia: number;
    coberturaVacaciones: number;
    plantillaFinal: number;
    recomendacion: string;
    coste: number;
  }[] = [];

  costeTotal = 0;

  constructor(
    private estimadorService: EstimadorService,
    private estimacionesSrv: EstimacionesService,
    private toast: ToastController
  ) {}

  ngOnInit() {
    if (!this.tareas?.length) return;

    /* ────────────────────────────────────────────────────────────
       1 ▸ Filtramos solo tareas PENDIENTES
       ──────────────────────────────────────────────────────────── */
    this.pendientes = this.tareas.filter(t => t.estado === 'pendiente');  // ★

    /* Si no hay pendientes, no hacemos nada */
    if (!this.pendientes.length) return;

    /* ──────────────────────────────────────────────────────────── */
    this.totalHoras = this.pendientes.reduce((acc, t) => acc + t.horas, 0);  // ★
    this.calendario = this.estimadorService.getCalendario();
    this.perfiles   = this.estimadorService.getPerfiles();

    this.calcularPlantillaConSolapamientos();
  }

  /* ================================================================
   *  Cálculo usando solo tareas pendientes
   * ================================================================*/
  calcularPlantillaConSolapamientos() {
    if (!this.calendario || !this.perfiles?.length) return;

    const perfilesUnicos = new Map<string, any>();
    for (const perfil of this.perfiles) {
      if (!perfilesUnicos.has(perfil.nombre)) perfilesUnicos.set(perfil.nombre, perfil);
    }

    const diasProyecto   = this.getDiasDelProyecto();
    const diasTotales    = diasProyecto.length;
    const festivos       = this.calendario.festivos ?? 0;
    const vacaciones     = this.calendario.vacaciones ?? 0;
    const diasLabSemana  = this.calendario.diasLaborablesPorSemana ?? 5;
    const diasLaborables = diasTotales * (diasLabSemana / 7) - festivos;

    /* ── mapa día → { perfil: nº tareas } ──────────────────────── */
    const tareasPorDia: Record<string, Record<string, number>> = {};
    for (const dia of diasProyecto) {
      tareasPorDia[dia] = {};
      const fechaActual = new Date(dia);

      for (const tarea of this.pendientes) {                                  // ★
        const perfil = this.perfiles.find(p => p.id === tarea.id_perfil);
        if (!perfil) continue;

        const nombre = perfil.nombre;
        const inicio = new Date(tarea.fecha_inicio);
        const fin    = new Date(tarea.fecha_fin);

        if (fechaActual >= inicio && fechaActual <= fin) {
          tareasPorDia[dia][nombre] = (tareasPorDia[dia][nombre] || 0) + 1;
        }
      }
    }

    /* ── pico de concurrencia por perfil ───────────────────────── */
    const picoConcurrenciaPorPerfil: Record<string, number> = {};
    for (const ocupacion of Object.values(tareasPorDia)) {
      for (const nombre in ocupacion) {
        picoConcurrenciaPorPerfil[nombre] = Math.max(
          picoConcurrenciaPorPerfil[nombre] || 0,
          ocupacion[nombre]
        );
      }
    }

    /* ── construimos el resultado ─────────────────────────────── */
    this.resultadoPorPerfil = [];
    this.costeTotal = 0;

    for (const [nombre, pico] of Object.entries(picoConcurrenciaPorPerfil)) {
      const perfil   = perfilesUnicos.get(nombre);
      const tarifa   = perfil.tarifa ?? 0;
      const disp     = (perfil.disponibilidad ?? 100) / 100;

      const cobVac   = vacaciones / diasLaborables;
      const plantilla= pico / disp * (1 + cobVac);
      const plantRnd = Math.ceil(plantilla * 10) / 10;

      const enteras  = Math.floor(plantRnd);
      const dec      = plantRnd - enteras;
      const pct      = Math.round(dec * 100);

      const recomendacion =
        pct > 0
          ? `${enteras} completo${enteras === 1 ? '' : 's'} + 1 al ${pct}%`
          : `${enteras} completo${enteras === 1 ? '' : 's'}`;

      const horasTotales = this.pendientes                                  // ★
        .filter(t => this.perfiles.find(p => p.id === t.id_perfil)?.nombre === nombre)
        .reduce((acc, t) => acc + t.horas, 0);

      const coste = horasTotales * tarifa;

      this.resultadoPorPerfil.push({
        nombre,
        horas: Math.round(horasTotales),
        picoConcurrencia: pico,
        coberturaVacaciones: Math.round(cobVac * 100),
        plantillaFinal: plantRnd,
        recomendacion,
        coste
      });

      this.costeTotal += coste;
    }
  }

  /* ============================================================= */
  /*  Utilidades                                                   */
  /* ============================================================= */
  getDiasDelProyecto(): string[] {
    const fechas = this.pendientes.map(t => ({                              // ★
      inicio: new Date(t.fecha_inicio),
      fin   : new Date(t.fecha_fin),
    }));
    const inicio = new Date(Math.min(...fechas.map(f => f.inicio.getTime())));
    const fin    = new Date(Math.max(...fechas.map(f => f.fin.getTime())));

    const dias: string[] = [];
    for (let d = new Date(inicio); d <= fin; d.setDate(d.getDate() + 1)) {
      dias.push(new Date(d).toISOString().slice(0, 10));
    }
    return dias;
  }

  getDisponibilidad(nombrePerfil: string): number {
    return this.perfiles.find(p => p.nombre === nombrePerfil)?.disponibilidad ?? 100;
  }

  /* plantilla base (sin cambios, aunque usa horas de pendientes) */
  getPlantillaBase(r: any): string {
    const disp      = this.getDisponibilidad(r.nombre) / 100;
    const hDia      = this.calendario.horasPorDia;
    const diasSem   = this.calendario.diasLaborablesPorSemana;
    const diasEfect = diasSem / 7;
    const personas  = r.horas / (hDia * diasEfect * disp);
    return personas.toFixed(2);
  }

  /* ============================================================= */
  /*  Guardar                                                     */
  /* ============================================================= */
  async guardar() {
    if (!this.proyectoId || !this.calendario) return;

    const payload: EstimacionPayload = {
      id_proyecto     : this.proyectoId,
      total_horas     : this.totalHoras,
      coste_total     : this.costeTotal,
      resumen_json    : this.resultadoPorPerfil,
      calendario_json : this.calendario
    };

    this.estimacionesSrv.crearEstimacion(payload).subscribe({
      next : async () => (await this.toast.create({
                message : 'Estimación guardada ✔️',
                duration: 2000,
                color   : 'success'
              })).present(),
      error: async err => {
        console.error(err);
        (await this.toast.create({
          message : 'No se pudo guardar la estimación',
          duration: 2000,
          color   : 'danger'
        })).present();
      }
    });
  }
}
