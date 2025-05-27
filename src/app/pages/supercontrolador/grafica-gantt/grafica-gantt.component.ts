// src/app/pages/supercontrolador/grafica-gantt/grafica-gantt.component.ts
import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule }    from '@angular/forms';
import { IonicModule }    from '@ionic/angular';
import { Ng2GoogleChartsModule, GoogleChartInterface } from 'ng2-google-charts';
import { ProyectoService } from 'src/app/services/proyectos.service';

@Component({
  standalone : true,
  selector   : 'app-grafica-gantt',
  templateUrl: './grafica-gantt.component.html',
  styleUrls  : ['./grafica-gantt.component.scss'],
  imports    : [CommonModule, FormsModule, IonicModule, Ng2GoogleChartsModule]
})
export class GraficaGanttComponent implements OnInit {

  @Input() proyectoId!: number;

  tareasOriginal: any[] = [];
  tareas        : any[] = [];

  perfiles: string[] = [];
  usuarios: string[] = [];
  estados : string[] = [];

  perfilFiltro      = '';
  usuarioFiltro     = '';
  estadoFiltro      = '';
  fechaInicioFiltro = '';
  fechaFinFiltro    = '';

  ganttChart: GoogleChartInterface | null = null;

  constructor(
    private proyectoSrv: ProyectoService,
    private cdRef      : ChangeDetectorRef
  ) {}

  /* ------------------ carga inicial ------------------ */
  ngOnInit(): void {
    if (!this.proyectoId) { return; }

    this.proyectoSrv.getTareasPorProyecto(this.proyectoId).subscribe({
      next : tareas => {
        this.tareasOriginal = tareas.map((t:any) => ({
          ...t,
          nombre_perfil   : t.nombre_perfil  ?? 'Sin perfil',
          nombre_usuario  : t.nombre_usuario ?? 'Sin asignar',
          estado          : t.estado         ?? 'pendiente',
          horas_incurridas: t.horas_incurridas ?? 0
        }));

        this.perfiles = Array.from(new Set(this.tareasOriginal.map(t => t.nombre_perfil )));
        this.usuarios = Array.from(new Set(this.tareasOriginal.map(t => t.nombre_usuario)));
        this.estados  = Array.from(new Set(this.tareasOriginal.map(t => t.estado        )));

        this.aplicarFiltros();
      },
      error: err => console.error('❌ Error cargando tareas', err)
    });
  }

  /* ------------------ filtros ------------------ */
  limpiarFiltros(): void {
    this.perfilFiltro = this.usuarioFiltro = this.estadoFiltro = '';
    this.fechaInicioFiltro = this.fechaFinFiltro = '';
    this.aplicarFiltros();
  }

  aplicarFiltros(): void {
    const desde = this.fechaInicioFiltro ? new Date(this.fechaInicioFiltro) : null;
    const hasta = this.fechaFinFiltro   ? new Date(this.fechaFinFiltro)   : null;

    this.tareas = this.tareasOriginal.filter(t => {
      const matchPerfil  = !this.perfilFiltro  || t.nombre_perfil  === this.perfilFiltro;
      const matchUsuario = !this.usuarioFiltro || t.nombre_usuario === this.usuarioFiltro;
      const matchEstado  = !this.estadoFiltro  || t.estado         === this.estadoFiltro;

      const ini = new Date(t.fecha_inicio);
      const fin = new Date(t.fecha_fin);
      const matchDesde = !desde || fin >= desde;
      const matchHasta = !hasta || ini <= hasta;

      return matchPerfil && matchUsuario && matchEstado && matchDesde && matchHasta;
    });

    this.redibujarGantt();
  }

  /* ------------------ redibujo ------------------ */
  private redibujarGantt(): void {
    this.ganttChart = null;            // fuerza destrucción
    this.cdRef.detectChanges();

    const cols = [
      { type:'string', label:'Task ID'   },
      { type:'string', label:'Task Name' },
      { type:'string', label:'Resource'  },
      { type:'date'  , label:'Start'     },
      { type:'date'  , label:'End'       },
      { type:'number', label:'Duration'  },
      { type:'number', label:'% Compl.'  },
      { type:'string', label:'Dependencies' },
      { type:'string', role:'tooltip', p:{html:true} }
    ];

    const rows = this.tareas.map(t => {
      const [y1,m1,d1] = t.fecha_inicio.split('-').map(Number);
      const [y2,m2,d2] = t.fecha_fin   .split('-').map(Number);

      const pct = t.horas
        ? Math.round((t.horas_incurridas / t.horas) * 100)
        : 0;

      const tooltip = `
        <div style="padding:6px 8px">
          <strong>${t.nombre}</strong><br>
          ${t.nombre_perfil}<br>
          ${t.fecha_inicio} → ${t.fecha_fin}<br>
          <em>${pct}% completado</em>
        </div>`;

      return {
        c: [
          { v:`T${t.id}` },
          { v: t.nombre },
          { v: t.nombre_perfil },
          { v: new Date(y1, m1-1, d1) },
          { v: new Date(y2, m2-1, d2) },
          { v: null },
          { v: pct },
          { v: null },
          { v: tooltip }
        ]
      };
    });

    if (rows.length === 0) { return; }

    this.ganttChart = {
      chartType: 'Gantt',
      dataTable: { cols, rows },
      options  : {
        width :'100%',                 // ⬅️ ancho total
        chartArea:{ width:'100%' },    // ⬅️ área de dibujo al 100 %
        height : Math.max(200, rows.length * 30 + 60),
        gantt  : {
          trackHeight   : 30,
          percentEnabled: true
        },
        tooltip: { isHtml: true }
      }
    };

    this.cdRef.detectChanges();
  }
}
