import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { ProyectoService } from '../../services/proyectos.service';
import { AuthService, Sesion } from '../../services/auth.service';

import { TareasComponent } from './tareas/tareas.component';
import { EstimadorComponent } from './estimador/estimador.component';
import { GraficaGanttComponent } from './grafica-gantt/grafica-gantt.component';
import { AsignacionPersonalComponent } from './asignacion-personal/asignacion-personal.component';
import { IncurridoTareasComponent } from './incurrido-tareas/incurrido-tareas.component';

@Component({
  standalone: true,
  selector: 'app-supercontrolador',
  templateUrl: './supercontrolador.page.html',
  styleUrls: ['./supercontrolador.page.scss'],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    TareasComponent,
    EstimadorComponent,
    GraficaGanttComponent,
    AsignacionPersonalComponent,
    IncurridoTareasComponent,
  ],
})
export class SupercontroladorPage implements OnInit {

  /* ------------------ datos de proyecto ---------------------- */
  proyectoId!: number;
  proyecto  : any;

  /* ------------------ datos de usuario / rol ----------------- */
  sesion  : Sesion | null = null;
  usuario = 'Usuario';
  rol     : 'ADMIN' | 'PM' | 'EMP' | '' = '';

  /* ------------------ menú lateral dinámico ------------------ */
  menu: { icon: string; label: string; path: string }[] = [];
  seccionActiva = 'inicio';

  constructor(
    private route       : ActivatedRoute,
    private proyectoSrv : ProyectoService,
    private authSrv     : AuthService
  ) {}

  /* =========================================================== */
  ngOnInit(): void {
    /* 1 ▸ ID del proyecto  */
    this.proyectoId = +this.route.snapshot.paramMap.get('id')!;

    /* 2 ▸ Sesión y rol */
    this.sesion = this.authSrv.getUserSession();
    if (this.sesion) {
      this.usuario = this.sesion.nombre;
      this.rol     = (this.sesion.rol || '').toUpperCase() as any;
    }

    /* 3 ▸ Menú según rol */
    this.menu = this.buildMenuByRole(this.rol);

    /*  Ajustar sección activa si el rol EMP no incluye 'inicio'  */
    if (!this.menu.find(m => m.path === this.seccionActiva)) {
      this.seccionActiva = this.menu[0]?.path || '';
    }

    /* 4 ▸ Proyecto */
    this.cargarProyecto();
  }

  /* =========================================================== */
  seleccionarSeccion(path: string) {
    this.seccionActiva = path;
  }

  private buildMenuByRole(rol: string) {
    const menuCompleto = [
      { icon: 'home-outline',      label: 'Inicio',     path: 'inicio'     },
      { icon: 'settings-outline',  label: 'Tareas',     path: 'tareas'     },
      { icon: 'calculator-outline',label: 'Estimador',  path: 'estimador'  },
      { icon: 'people-outline',    label: 'Asignación', path: 'asignacion' },
      { icon: 'bar-chart-outline', label: 'Gantt',      path: 'gantt'      },
      { icon: 'time-outline',      label: 'Incurrido',  path: 'incurrido'  },
    ];

    const menuEmp = [
      { icon: 'bar-chart-outline', label: 'Gantt',      path: 'gantt'     },
      { icon: 'time-outline',      label: 'Incurrido',  path: 'incurrido' },
    ];

    return rol === 'EMP' ? menuEmp : menuCompleto;
  }

  private cargarProyecto(): void {
    this.proyectoSrv.getProyectoCompleto(this.proyectoId).subscribe({
      next : data => this.proyecto = data,
      error: err  => console.error('Error cargando proyecto', err),
    });
  }
}
