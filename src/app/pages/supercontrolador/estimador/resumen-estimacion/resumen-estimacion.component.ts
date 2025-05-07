import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { EstimadorService } from 'src/app/services/estimador.service';

@Component({
  selector: 'app-resumen-estimacion',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './resumen-estimacion.component.html',
})
export class ResumenEstimacionComponent implements OnInit {
  @Input() tareas: any[] = []; // Tareas del proyecto, recibidas del padre

  totalHoras: number = 0;
  calendario: any;
  perfiles: any[] = [];
  resultado: {
    personasNecesarias: number;
    costeTotal: number;
  } = { personasNecesarias: 0, costeTotal: 0 };

  constructor(private estimadorService: EstimadorService) {}

  ngOnInit() {
    if (!this.tareas || this.tareas.length === 0) return;
  
    this.totalHoras = this.tareas.reduce((acc, t) => acc + t.horas, 0);
  
    // Calcular rango de fechas del proyecto
    const fechas = this.tareas.map(t => ({
      inicio: new Date(t.fecha_inicio),
      fin: new Date(t.fecha_fin),
    }));
  
    const fechaInicio = new Date(Math.min(...fechas.map(f => f.inicio.getTime())));
    const fechaFin = new Date(Math.max(...fechas.map(f => f.fin.getTime())));
    const diasProyecto = Math.ceil((fechaFin.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24));
  
    this.calendario = this.estimadorService.getCalendario();
    this.perfiles = this.estimadorService.getPerfiles();
  
    this.calcular(diasProyecto);
  }

  calcular(diasProyecto: number) {
    if (!this.calendario || !this.perfiles?.length || this.totalHoras === 0) return;
  
    const festivos = this.calendario.festivos ?? 0;
    const vacaciones = this.calendario.vacaciones ?? 0;
  
    const diasEfectivos = Math.floor(
      diasProyecto * (this.calendario.diasLaborablesPorSemana / 7)
    ) - festivos - vacaciones;
  
    const horasDisponiblesPorPersona = diasEfectivos * this.calendario.horasPorDia;
    const personasNecesarias = Math.ceil(this.totalHoras / horasDisponiblesPorPersona);
  
    const costeBase = this.perfiles.reduce((acc, perfil) => {
      const proporcional = (perfil.disponibilidad ?? 100) / 100;
      return acc + (perfil.tarifa * horasDisponiblesPorPersona * proporcional / this.perfiles.length);
    }, 0) * personasNecesarias;
  
    this.resultado = {
      personasNecesarias,
      costeTotal: Math.round(costeBase),
    };
  }
}
