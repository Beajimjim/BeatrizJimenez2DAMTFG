import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ProyectoService } from '../../services/proyectos.service';

@Component({
  standalone: true,
  selector: 'app-supercontrolador',
  templateUrl: './supercontrolador.page.html',
  styleUrls: ['./supercontrolador.page.scss'],
  // ⬇️ Módulos que necesita la plantilla
  imports: [CommonModule, IonicModule, RouterModule],
})
export class SupercontroladorPage implements OnInit {

  /** ID que llega en la URL /proyecto/:id */
  public proyectoId!: number;
  public proyecto: any;

  public menu = [
    { label: 'Resumen',      icon: 'home-outline',   path: '/escritorio' },
    { label: 'Módulos',      icon: 'layers-outline', path: 'modulos' },
    { label: 'Estadísticas', icon: 'stats-chart',    path: 'estadisticas' },
  ];

  public usuario = 'Usuario';

  constructor(
    private route: ActivatedRoute,
    private proyectoSrv: ProyectoService,
  ) {}

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
