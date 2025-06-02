/* ============================================================
   SupercontroladorPage
   ------------------------------------------------------------
   Página principal del módulo de gestión de proyectos.
   Controla la sección visible según el menú lateral y
   carga los datos del proyecto según el ID recibido.
   ============================================================ */

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

  /* ------------------ DATOS DEL PROYECTO ---------------------- */
  proyectoId!: number;  // ID recibido por ruta
  proyecto  : any;      // Objeto del proyecto completo

  /* ------------------ DATOS DEL USUARIO ----------------------- */
  sesion  : Sesion | null = null; // Sesión del usuario logueado
  usuario = 'Usuario';            // Nombre para mostrar
  rol     : 'ADMIN' | 'PM' | 'EMP' | '' = ''; // Rol para control de acceso

  /* ------------------ MENÚ DINÁMICO --------------------------- */
  menu: { icon: string; label: string; path: string }[] = [];
  seccionActiva = 'inicio'; // Sección que se muestra

  constructor(
    private route       : ActivatedRoute,
    private proyectoSrv : ProyectoService,
    private authSrv     : AuthService
  ) {}

  /* ============================================================
     MÉTODO PRINCIPAL DE INICIALIZACIÓN
     ------------------------------------------------------------
     1. Extrae el ID de proyecto desde la ruta.
     2. Obtiene la sesión del usuario y su rol.
     3. Construye el menú lateral según el rol.
     4. Carga los datos completos del proyecto.
     ============================================================ */
  ngOnInit(): void {
    /* 1 ▸ ID del proyecto desde la URL */
    this.proyectoId = +this.route.snapshot.paramMap.get('id')!;

    /* 2 ▸ Sesión de usuario y rol */
    this.sesion = this.authSrv.getUserSession();
    if (this.sesion) {
      this.usuario = this.sesion.nombre;
      this.rol     = (this.sesion.rol || '').toUpperCase() as any;
    }

    /* 3 ▸ Menú lateral personalizado según el rol */
    this.menu = this.buildMenuByRole(this.rol);

    /* Redirige a una sección permitida si 'inicio' no está disponible */
    if (!this.menu.find(m => m.path === this.seccionActiva)) {
      this.seccionActiva = this.menu[0]?.path || '';
    }

    /* 4 ▸ Carga del proyecto */
    this.cargarProyecto();
  }

  /* ============================================================
     CAMBIA LA SECCIÓN ACTIVA (vista actual)
     ============================================================ */
  seleccionarSeccion(path: string) {
    this.seccionActiva = path;
  }

  /* ============================================================
     CONSTRUYE EL MENÚ LATERAL SEGÚN EL ROL
     - ADMIN y PM: acceso completo
     - EMP: acceso restringido
     ============================================================ */
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

  /* ============================================================
     CARGA EL PROYECTO COMPLETO DESDE EL SERVICIO
     ============================================================ */
  private cargarProyecto(): void {
    this.proyectoSrv.getProyectoCompleto(this.proyectoId).subscribe({
      next : data => this.proyecto = data,
      error: err  => console.error('Error cargando proyecto', err),
    });
  }
}
