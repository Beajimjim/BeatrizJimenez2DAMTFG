import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { ProyectoService, Tarea } from 'src/app/services/proyectos.service';
import { EstimadorService } from 'src/app/services/estimador.service';
import {
  EstimacionesService,
  EstimacionPayload,
  ResumenPorPerfil
} from 'src/app/services/estimaciones.service';
import { PersonalService, Personal } from 'src/app/services/personal.service';

@Component({
  selector: 'app-resumen-estimacion',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './resumen-estimacion.component.html',
})
export class ResumenEstimacionComponent implements OnInit {
  @Input() proyectoId!: number;

  calendario: any;
  perfiles: any[] = [];
  tareas: Tarea[] = [];
  totalHoras = 0;
  costeTotal = 0;
  resultadoPorPerfil: ResumenPorPerfil[] = [];

  constructor(
    private proyectoSrv: ProyectoService,
    private estimadorService: EstimadorService,
    private estimacionesSrv: EstimacionesService,
    private personalSrv: PersonalService,
    private toast: ToastController
  ) {}

  async ngOnInit() {
    if (!this.proyectoId) return;

    this.calendario = this.estimadorService.getCalendario();
    this.perfiles = this.estimadorService.getPerfiles();

    const tareas = await this.proyectoSrv.getTareasPorProyecto(this.proyectoId).toPromise();
    this.tareas = tareas?.filter(t => t.estado === 'pendiente') ?? [];
    this.totalHoras = this.tareas.reduce((acc, t) => acc + t.horas, 0);

    const ps = await this.personalSrv.listarPorProyecto(this.proyectoId).toPromise();
    const personal = ps ?? [];

    const horasPorDia = this.calendario.horasPorDia;
    const diasSemana = this.calendario.diasLaborablesPorSemana;
    const socialRate = this.calendario.socialRate / 100;

    this.resultadoPorPerfil = this.perfiles.map(p => {
      const tareasPerfil = this.tareas.filter(t => t.id_perfil === p.id);
      const horasReq = tareasPerfil.reduce((s, t) => s + t.horas, 0);

      const eventos: { fecha: number; tipo: 'inicio' | 'fin' }[] = [];
      for (const t of tareasPerfil) {
        eventos.push({ fecha: new Date(t.fecha_inicio).getTime(), tipo: 'inicio' });
        eventos.push({ fecha: new Date(t.fecha_fin).getTime(), tipo: 'fin' });
      }
      eventos.sort((a, b) => a.fecha - b.fecha);

      let concurrencia = 0;
      let pico = 0;
      for (const e of eventos) {
        if (e.tipo === 'inicio') concurrencia++;
        else concurrencia--;
        if (concurrencia > pico) pico = concurrencia;
      }

      const personalPerfil = personal.filter(pers => pers.id_perfil === p.id);
      const disponibles = personalPerfil.filter(pers => {
        const vacaciones = Array.isArray(pers.vacaciones) ? pers.vacaciones : [];
        const tareasPrevias = this.tareas.filter(t =>
          t.id_usuario === pers.id_personal &&
          (t.estado === 'pendiente' || t.estado === 'en curso')
        );

        return tareasPerfil.every(({ fecha_inicio, fecha_fin }) => {
          const inicio = new Date(fecha_inicio);
          const fin = new Date(fecha_fin);

          const chocaConVac = vacaciones.some(v => {
            const vi = new Date(v.inicio);
            const vf = new Date(v.fin);
            return inicio <= vf && fin >= vi;
          });

          const chocaConTareas = tareasPrevias.some(t => {
            const ti = new Date(t.fecha_inicio);
            const tf = new Date(t.fecha_fin);
            return inicio <= tf && fin >= ti;
          });

          return !chocaConVac && !chocaConTareas;
        });
      });

      const fechasTodas = tareasPerfil
        .map((t: Tarea) => [new Date(t.fecha_inicio).getTime(), new Date(t.fecha_fin).getTime()])
        .reduce((acc, val) => acc.concat(val), []);
      const min = Math.min(...fechasTodas);
      const max = Math.max(...fechasTodas);
      const diasNaturales = (max - min) / (1000 * 60 * 60 * 24) + 1;
      const diasLab = diasNaturales * (diasSemana / 7);
      const horasPeriodo = diasLab * horasPorDia;

      const plantillaHoras = horasPeriodo > 0 ? Math.ceil(horasReq / horasPeriodo) : 0;
      const plantillaFinal = Math.max(plantillaHoras, pico);

      const costeBase = horasReq * p.tarifa;
      const costeSocial = plantillaFinal * horasPeriodo * p.tarifa * socialRate;
      const coste = costeBase + costeSocial;

      return {
        nombre: p.nombre,
        horas: horasReq,
        picoConcurrencia: pico,
        coberturaVacaciones: 0,
        plantillaFinal,
        recomendacion: `${plantillaFinal} persona(s)`,
        coste,
        hayCapacidad: disponibles.length >= plantillaFinal
      };
    }).filter(r => r.horas > 0);

    this.costeTotal = this.resultadoPorPerfil.reduce((sum, r) => sum + r.coste, 0);
  }

  async guardar() {
    const payload: EstimacionPayload = {
      id_proyecto: this.proyectoId,
      total_horas: this.totalHoras,
      coste_total: this.costeTotal,
      resumen_json: this.resultadoPorPerfil,
      calendario_json: this.calendario
    };

    this.estimacionesSrv.crearEstimacion(payload).subscribe({
      next: async () => {
        const toast = await this.toast.create({
          message: 'Estimación guardada ✔️',
          duration: 2000,
          color: 'success'
        });
        toast.present();
      },
      error: async () => {
        const toast = await this.toast.create({
          message: 'Error al guardar la estimación',
          duration: 2000,
          color: 'danger'
        });
        toast.present();
      }
    });
  }
}
