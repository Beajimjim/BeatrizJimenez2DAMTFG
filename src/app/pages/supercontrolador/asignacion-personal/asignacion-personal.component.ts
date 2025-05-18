// src/app/pages/supercontrolador/asignacion-personal/asignacion-personal.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule }             from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { ProyectoService, Tarea }        from 'src/app/services/proyectos.service';
import { PersonalService, Personal }     from 'src/app/services/personal.service';

@Component({
  standalone: true,
  selector: 'app-asignacion-personal',
  imports: [CommonModule, IonicModule],
  templateUrl: './asignacion-personal.component.html',
  styleUrls: ['./asignacion-personal.component.scss']
})
export class AsignacionPersonalComponent implements OnInit {
  @Input() proyectoId!: number;

  allTareas: Tarea[] = [];       // <-- TODAS las tareas del proyecto
  tareas: Tarea[] = [];          // <-- sólo las pendientes y sin asignar
  personal: Personal[] = [];
  disponibles: Personal[] = [];
  selectedTask?: Tarea;

  constructor(
    private proyectoSrv: ProyectoService,
    private personalSrv: PersonalService,
    private toast: ToastController
  ) {}

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    // 1A) Cargar TODAS las tareas
    this.proyectoSrv.getTareasPorProyecto(this.proyectoId)
      .subscribe(ts => {
        this.allTareas = ts;
        this.tareas = ts.filter(t =>
          t.estado === 'pendiente' &&
          t.id_usuario === null
        );

        // Si hay una tarea seleccionada, refrescar los disponibles
        if (this.selectedTask) {
          const stillExists = this.tareas.find(t => t.id === this.selectedTask!.id);
          if (stillExists) {
            this.onSelectTask(stillExists);
          } else {
            this.selectedTask = undefined;
            this.disponibles = [];
          }
        }
      });

    // 2) Cargar personal
    this.personalSrv.listarPorProyecto(this.proyectoId).subscribe(ps => {
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

  onSelectTask(t: Tarea) {
    this.selectedTask = t;

    if (t.id_perfil == null) {
      this.disponibles = [];
      return;
    }
    const perfilId = t.id_perfil;
    const taskStart = new Date(t.fecha_inicio);
    const taskEnd   = new Date(t.fecha_fin);

    this.disponibles = this.personal.filter(p => {
      if (p.id_perfil !== perfilId) return false;

      const vacs = Array.isArray(p.vacaciones) ? p.vacaciones : [];
      const choqueVac = vacs.some(v => {
        const vacStart = new Date(v.inicio);
        const vacEnd   = new Date(v.fin);
        return taskStart <= vacEnd && taskEnd >= vacStart;
      });
      if (choqueVac) return false;

      const solapaTarea = this.allTareas.some(task => {
        if (task.id_usuario == null) return false;
        const otherStart = new Date(task.fecha_inicio);
        const otherEnd   = new Date(task.fecha_fin);
        return (
          task.id_usuario === p.id_personal &&
          otherStart <= taskEnd &&
          otherEnd   >= taskStart
        );
      });
      if (solapaTarea) return false;

      return true;
    });
  }

  async assign(p: Personal) {
    if (!this.selectedTask) return;

    await this.proyectoSrv
      .actualizarTarea(
        this.selectedTask.id,
        { id_usuario: p.id_personal }
      )
      .toPromise();

    const toast = await this.toast.create({
      message: `"${this.selectedTask.nombre}" asignada a ${p.nombre}`,
      duration: 2000,
      color: 'success'
    });
    toast.present();

    // 3) Volver a cargar todas las tareas y refrescar selección
    this.cargarDatos();
  }
}
