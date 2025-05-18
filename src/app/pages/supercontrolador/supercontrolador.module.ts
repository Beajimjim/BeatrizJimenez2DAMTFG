import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { TareasComponent } from './tareas/tareas.component';
import { EstimadorComponent } from "./estimador/estimador.component";
import { GraficaGanttComponent } from './grafica-gantt/grafica-gantt.component';

import { AsignacionPersonalComponent } from "./asignacion-personal/asignacion-personal.component";
import { IncurridoTareasComponent } from "./incurrido-tareas/incurrido-tareas.component";

@Component({
  selector: 'app-supercontrolador',
  standalone: true,
  imports: [CommonModule, IonicModule, TareasComponent, EstimadorComponent, GraficaGanttComponent, AsignacionPersonalComponent, IncurridoTareasComponent],
  templateUrl: './supercontrolador.page.html',
  styleUrls: ['./supercontrolador.page.scss'],
})
export class SupercontroladorPage {
seleccionarSeccion(arg0: string) {
throw new Error('Method not implemented.');
}
  // Simulamos un usuario y un par de secciones de menú
  usuario = 'Carlos Ruiz';
  menu = [
    { icon: 'home-outline', label: 'Inicio', path: '/home' },
    { icon: 'settings-outline', label: 'Configuración', path: '/escritorio' },
  ];
seccionActiva: any;
proyectoId!: number;
proyecto: any;
}
