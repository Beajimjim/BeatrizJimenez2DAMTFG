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

  tareasOriginal: any[] = [];          // copia inmutable
  tareas:          any[] = [];         // copia filtrada

  perfiles: string[] = [];
  usuarios: string[] = [];
  estados : string[] = [];

  // valores de los filtros
  perfilFiltro     = '';
  usuarioFiltro    = '';
  estadoFiltro     = '';
  fechaInicioFiltro= '';
  fechaFinFiltro   = '';

  ganttChart: GoogleChartInterface | null = null;   // null = gráfico oculto

  constructor(
    private proyectoSrv: ProyectoService,
    private cdRef      : ChangeDetectorRef
  ) {}

  /* ---------- CARGA INICIAL ---------- */

  ngOnInit(): void {
    if (!this.proyectoId) { return; }

    this.proyectoSrv.getTareasPorProyecto(this.proyectoId).subscribe({
      next : tareas => {
        // 1) normalizar nulos
        this.tareasOriginal = tareas.map((t:any) => ({
          ...t,
          nombre_perfil : t.nombre_perfil  ?? 'Sin perfil',
          nombre_usuario: t.nombre_usuario ?? 'Sin asignar',
          estado        : t.estado         ?? 'pendiente'
        }));

        // 2) poblar combos
        this.perfiles = Array.from(new Set(this.tareasOriginal.map(t => t.nombre_perfil )));
        this.usuarios = Array.from(new Set(this.tareasOriginal.map(t => t.nombre_usuario)));
        this.estados  = Array.from(new Set(this.tareasOriginal.map(t => t.estado        )));

        // 3) dibujar vista completa
        this.aplicarFiltros();
      },
      error: err => console.error('❌ Error cargando tareas', err)
    });
  }

  /* ---------- BOTÓN LIMPIAR ---------- */

  limpiarFiltros(): void {
    this.perfilFiltro   = '';
    this.usuarioFiltro  = '';
    this.estadoFiltro   = '';
    this.fechaInicioFiltro = '';
    this.fechaFinFiltro    = '';
    this.aplicarFiltros();
  }

  /* ---------- FILTRO + REDIBUJADO ---------- */

  aplicarFiltros(): void {

    const desde = this.fechaInicioFiltro ? new Date(this.fechaInicioFiltro) : null;
    const hasta = this.fechaFinFiltro   ? new Date(this.fechaFinFiltro)   : null;

    this.tareas = this.tareasOriginal.filter(t => {

      const okPerfil  = !this.perfilFiltro  || t.nombre_perfil  === this.perfilFiltro;
      const okUsuario = !this.usuarioFiltro || t.nombre_usuario === this.usuarioFiltro;
      const okEstado  = !this.estadoFiltro  || t.estado         === this.estadoFiltro;

      const inicio = new Date(t.fecha_inicio);
      const fin    = new Date(t.fecha_fin);
      const okDesde = !desde || fin    >= desde;
      const okHasta = !hasta || inicio <= hasta;

      return okPerfil && okUsuario && okEstado && okDesde && okHasta;
    });

    this.redibujarGantt();
  }

  /* ---------- CREA UN NUEVO OBJETO GRAFICO ---------- */

  private redibujarGantt(): void {

    /* 1) ocultar el chart para forzar destrucción */
    this.ganttChart = null;
    this.cdRef.detectChanges();

    /* 2) construir filas */
    const cols = [
      { type:'string', label:'Task ID'   },
      { type:'string', label:'Task Name' },
      { type:'string', label:'Resource'  },
      { type:'date'  , label:'Start'     },
      { type:'date'  , label:'End'       },
      { type:'number', label:'Duration'  },
      { type:'number', label:'% Compl.'  },
      { type:'string', label:'Dependencies' }
    ];

    const rows = this.tareas.map(t => {
      const [y1,m1,d1] = t.fecha_inicio.split('-').map(Number);
      const [y2,m2,d2] = t.fecha_fin   .split('-').map(Number);

      return {
        c: [
          { v: `T${t.id}`         },
          { v:  t.nombre          },
          { v:  t.nombre_perfil   },
          { v:  new Date(y1, m1-1, d1) },
          { v:  new Date(y2, m2-1, d2) },
          { v:  null              },   // duration
          { v:  1                 },   // percent
          { v:  null              }    // dependencias eliminadas
        ]
      };
    });

    /* 3) mostrar (o no) la gráfica */
    if (rows.length === 0) { return; }

    this.ganttChart = {
      chartType: 'Gantt',
      dataTable: { cols, rows },
      options  : {
        height: Math.max(200, rows.length*30 + 60),
        gantt : { trackHeight: 30 },
        tooltip: { isHtml: true }
      }
    };

    this.cdRef.detectChanges();
  }
}

