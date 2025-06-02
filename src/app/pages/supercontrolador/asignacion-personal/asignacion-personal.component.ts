/* ==============================================================
   COMPONENTE «ASIGNACIÓN DE PERSONAL» ― Smart3Z
   Ruta   : src/app/pages/supercontrolador/asignacion-personal/
   Archivo: asignacion-personal.component.ts
   Objetivo:
   - Listar tareas pendientes sin usuario y mostrar personal
     compatible (perfil, disponibilidad, vacaciones).
   - Al pulsar “Asignar” se actualiza la tarea y se refresca
     la vista.
   ============================================================== */

import { Component, Input, OnInit } from '@angular/core';
import { CommonModule }             from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { finalize, firstValueFrom } from 'rxjs';

import { ProyectoService, Tarea }      from 'src/app/services/proyectos.service';
import { PersonalService, Personal }   from 'src/app/services/personal.service';

@Component({
  standalone : true,
  selector   : 'app-asignacion-personal',
  templateUrl: './asignacion-personal.component.html',
  styleUrls  : ['./asignacion-personal.component.scss'],
  imports    : [CommonModule, IonicModule]
})
export class AsignacionPersonalComponent implements OnInit {

  /* ────────────── Inputs ────────────── */
  @Input() proyectoId!: number;

  /* ────────────── estado local ────────────── */
  allTareas:    Tarea[]    = [];   // todas las tareas del proyecto
  tareas:       Tarea[]    = [];   // pendientes + sin usuario
  personal:     Personal[] = [];   // todo el personal del proyecto
  disponibles:  Personal[] = [];   // personal filtrado
  selectedTask?: Tarea;            // tarea seleccionada

  constructor(
    private proyectoSrv: ProyectoService,
    private personalSrv: PersonalService,
    private toast      : ToastController
  ) {}

  /* ------------------- ciclo ------------------- */
  ngOnInit(): void {
    this.cargarDatos();
  }

  /* ------------------- carga principal ------------------- */
  private cargarDatos(): void {
    /* 1 ) tareas */
    this.proyectoSrv.getTareasPorProyecto(this.proyectoId).subscribe(ts => {
      this.allTareas = ts;

      // solo pendientes sin asignar
      this.tareas = ts.filter(t =>
        t.estado?.toLowerCase() === 'pendiente' &&
        t.id_usuario == null
      );

      // revalida la selección
      if (this.selectedTask) {
        const keep = this.tareas.find(t => t.id === this.selectedTask!.id);
        keep ? this.onSelectTask(keep)
             : (this.selectedTask = undefined, this.disponibles = []);
      }
    });

    /* 2 ) personal */
    this.personalSrv.listarPorProyecto(this.proyectoId).subscribe(ps => {
      console.table(ps);  
      this.personal = ps.map(p => ({
        ...p,
        disponibilidad: typeof p.disponibilidad === 'string'
          ? JSON.parse(p.disponibilidad)
          : p.disponibilidad,
        vacaciones: typeof p.vacaciones === 'string'
          ? JSON.parse(p.vacaciones)
          : p.vacaciones
      }));
    });
  }

  /* ------------------- selección de tarea ------------------- */
  onSelectTask(t: Tarea): void {
    this.selectedTask = t;

    if (t.id_perfil == null) {
      this.disponibles = [];
      return;
    }

    const perfilId  = t.id_perfil;
    const iniTarea  = new Date(t.fecha_inicio);
    const finTarea  = new Date(t.fecha_fin);

    this.disponibles = this.personal.filter(p => {

      /* 1. mismo perfil */
      if (p.id_perfil !== perfilId) return false;

      /* 2. no choque con vacaciones */
      const solapaVac = (p.vacaciones ?? []).some(v => {
        const iniV = new Date(v.inicio);
        const finV = new Date(v.fin);
        return iniTarea <= finV && finTarea >= iniV;
      });
      if (solapaVac) return false;

      /* 3. no tenga ya otra tarea solapada */
      const solapaTask = this.allTareas.some(task => {
        if (task.id_usuario !== p.id_usuario) return false;

        const iniO = new Date(task.fecha_inicio);
        const finO = new Date(task.fecha_fin);
        return iniO <= finTarea && finO >= iniTarea;
      });
      if (solapaTask) return false;

      return true;
    });
  }

  /* ------------------- asignar ------------------- */
  async assign(p: Personal): Promise<void> {
    if (!this.selectedTask) return;


    await firstValueFrom(      
      this.proyectoSrv      
        .actualizarTarea(this.selectedTask.id, { id_usuario: p.id_usuario }) // 👈 pasa el id_usuario correcto
        .pipe(finalize(() => this.cargarDatos()))                            // refresca siempre
    );

    const t = await this.toast.create({
      message : `"${this.selectedTask.nombre}" asignada a ${p.nombre}`,
      duration: 1800,
      color   : 'success'
    });
    t.present();
  }
}
