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
  @Input() tareas: any[] = [];

  totalHoras = 0;
  calendario: any;
  perfiles: any[] = [];

  resultadoPorPerfil: {
coste: any;
    nombre: string;
    horas: number;
    picoConcurrencia: number;
    coberturaVacaciones: number;
    plantillaFinal: number;
    recomendacion: string;
  }[] = [];

  costeTotal = 0;

  constructor(private estimadorService: EstimadorService) {}

  ngOnInit() {
    if (!this.tareas?.length) return;

    this.totalHoras = this.tareas.reduce((acc, t) => acc + t.horas, 0);
    this.calendario = this.estimadorService.getCalendario();
    this.perfiles = this.estimadorService.getPerfiles();

    this.calcularPlantillaConSolapamientos();
  }

  calcularPlantillaConSolapamientos() {
    if (!this.calendario || !this.perfiles?.length) return;

    const perfilesUnicos = new Map<string, any>();
    for (const perfil of this.perfiles) {
      if (!perfilesUnicos.has(perfil.nombre)) {
        perfilesUnicos.set(perfil.nombre, perfil);
      }
    }

    const diasProyecto = this.getDiasDelProyecto();
    const diasTotales = diasProyecto.length;

    const festivos = this.calendario.festivos ?? 0;
    const vacaciones = this.calendario.vacaciones ?? 0;
    const diasLaborablesPorSemana = this.calendario.diasLaborablesPorSemana ?? 5;
    const diasLaborablesTotales = diasTotales * (diasLaborablesPorSemana / 7) - festivos;

    const tareasPorDia: Record<string, Record<string, number>> = {};

    for (const dia of diasProyecto) {
      tareasPorDia[dia] = {};
      const fechaActual = new Date(dia);

      for (const tarea of this.tareas) {
        const perfil = this.perfiles.find(p => p.id === tarea.id_perfil);
        if (!perfil) continue;
        const nombre = perfil.nombre;
        const inicio = new Date(tarea.fecha_inicio);
        const fin = new Date(tarea.fecha_fin);

        if (fechaActual >= inicio && fechaActual <= fin) {
          tareasPorDia[dia][nombre] = (tareasPorDia[dia][nombre] || 0) + 1;
        }
      }
    }

    const picoConcurrenciaPorPerfil: Record<string, number> = {};

    for (const dia in tareasPorDia) {
      const ocupacion = tareasPorDia[dia];
      for (const nombre in ocupacion) {
        picoConcurrenciaPorPerfil[nombre] = Math.max(
          picoConcurrenciaPorPerfil[nombre] || 0,
          ocupacion[nombre]
        );
      }
    }

    this.resultadoPorPerfil = [];
    this.costeTotal = 0;

    for (const [nombre, pico] of Object.entries(picoConcurrenciaPorPerfil)) {
      const perfil = perfilesUnicos.get(nombre);
      const tarifa = perfil.tarifa ?? 0;
      const disponibilidad = (perfil.disponibilidad ?? 100) / 100;

      const coberturaVacaciones = vacaciones / diasLaborablesTotales;
      const plantillaAjustada = pico / disponibilidad * (1 + coberturaVacaciones);
      const plantillaRedondeada = Math.ceil(plantillaAjustada * 10) / 10;

      const enteras = Math.floor(plantillaRedondeada);
      const decimales = plantillaRedondeada - enteras;
      const porcentaje = Math.round(decimales * 100);

      let recomendacion = `${enteras} completo${enteras === 1 ? '' : 's'}`;
      if (porcentaje > 0) {
        recomendacion += ` + 1 al ${porcentaje}%`;
      }

      const horasTotales = this.tareas
        .filter(t => this.perfiles.find(p => p.id === t.id_perfil)?.nombre === nombre)
        .reduce((acc, t) => acc + t.horas, 0);

      const coste = horasTotales * tarifa;

      this.resultadoPorPerfil.push({
        nombre,
        horas: Math.round(horasTotales),
        picoConcurrencia: pico,
        coberturaVacaciones: Math.round(coberturaVacaciones * 100),
        plantillaFinal: plantillaRedondeada,
        recomendacion,
        coste
      });

      this.costeTotal += coste;
    }
  }

  getDiasDelProyecto(): string[] {
    const fechas = this.tareas.map(t => ({
      inicio: new Date(t.fecha_inicio),
      fin: new Date(t.fecha_fin),
    }));
    const inicio = new Date(Math.min(...fechas.map(f => f.inicio.getTime())));
    const fin = new Date(Math.max(...fechas.map(f => f.fin.getTime())));

    const dias: string[] = [];
    for (let d = new Date(inicio); d <= fin; d.setDate(d.getDate() + 1)) {
      dias.push(new Date(d).toISOString().slice(0, 10));
    }
    return dias;
  }

  getDisponibilidad(nombrePerfil: string): number {
    const perfil = this.perfiles.find(p => p.nombre === nombrePerfil);
    return perfil?.disponibilidad ?? 100;
  }
  
  getPlantillaBase(r: any): string {
    const disponibilidad = this.getDisponibilidad(r.nombre) / 100;
    const horasDiarias = this.calendario.horasPorDia;
    const diasSemana = this.calendario.diasLaborablesPorSemana;
    const diasEfectivos = diasSemana / 7;
    const personas = r.horas / (horasDiarias * diasEfectivos * disponibilidad);
    return personas.toFixed(2);
  }
}
