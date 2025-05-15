import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ProyectoService } from '../../services/proyectos.service';
import { TareasComponent } from './tareas/tareas.component';
import { EstimadorComponent } from './estimador/estimador.component';
import { GraficaGanttComponent } from './grafica-gantt/grafica-gantt.component';

@Component({
  standalone: true,
  selector: 'app-supercontrolador',
  templateUrl: './supercontrolador.page.html',
  styleUrls: ['./supercontrolador.page.scss'],
  // ⬇️ Módulos que necesita la plantilla
  imports: [CommonModule, IonicModule, RouterModule,TareasComponent,EstimadorComponent, GraficaGanttComponent],
})
export class SupercontroladorPage implements OnInit {

  /** ID que llega en la URL /proyecto/:id */
  public proyectoId!: number;
  public proyecto: any;

  menu = [
    { icon: 'home-outline', label: 'Inicio', path: 'inicio' },
    { icon: 'settings-outline', label: 'Tareas', path: 'tareas' },    
    { icon: 'calculator-outline', label: 'Estimador', path: 'estimador' },
    { icon: 'bar-chart-outline', label: 'Gantt', path: 'gantt' } 
  ];
  seccionActiva = 'inicio';

  public usuario = 'Usuario';
  

  constructor(
    private route: ActivatedRoute,
    private proyectoSrv: ProyectoService,
  ) {}


  seleccionarSeccion(path: string) {
    this.seccionActiva = path;
  }
  ngOnInit(): void {
    this.proyectoId = +this.route.snapshot.paramMap.get('id')!;
    console.log(this.proyectoId);
    
    // (opcional) Si quisieras reaccionar a cambios dinámicos:
    // this.route.paramMap.subscribe(p => this.proyectoId = +p.get('id')!);
    this.cargarProyecto();
    
    
  }

  private cargarProyecto(): void {
    this.proyectoSrv.getProyectoCompleto(this.proyectoId).subscribe({
      next : (data: any) => {
        console.log('Proyecto recibido:', data);  // Agrega esto
        this.proyecto = data;
      },
      error: (err: any)  => console.error('Error cargando proyecto', err),
    });
  }
}
