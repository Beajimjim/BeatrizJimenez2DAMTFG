import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { ProyectoService, Tarea } from 'src/app/services/proyectos.service';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-incurrido-tareas',
  templateUrl: './incurrido-tareas.component.html',
  styleUrls: ['./incurrido-tareas.component.scss'],
  imports: [CommonModule, IonicModule, FormsModule],
})
export class IncurridoTareasComponent implements OnInit {
  @Input() proyectoId!: number;
  tareas: (Tarea & { editHoras: number; editEstado: string })[] = [];

  constructor(
    private proyectoSrv: ProyectoService,
    private toast: ToastController
  ) {}

  ngOnInit() {
    if (!this.proyectoId) return;

    this.proyectoSrv.getTareasPorProyecto(this.proyectoId).subscribe(ts => {
      this.tareas = ts.map(t => ({
        ...t,
        editHoras: 0,
        editEstado: t.estado ?? 'pendiente'
      }));
    });
  }

  async guardarCambios(t: Tarea & { editHoras: number; editEstado: string }) {
    // Protege contra valores inválidos
    if (t.editHoras < 0 || t.editHoras + (t.horas_incurridas ?? 0) > t.horas) {
      const toast = await this.toast.create({
        message: 'Las horas incurridas no pueden superar las horas totales ni ser negativas.',
        duration: 2500,
        color: 'danger'
      });
      toast.present();
      return;
    }

    const payload = {
      horas_incurridas: t.editHoras,
      estado: t.editEstado
    };

    this.proyectoSrv.actualizarHorasIncurridas(t.id, payload).subscribe({
      next: async () => {
        t.horas_incurridas = (t.horas_incurridas ?? 0) + t.editHoras;
        t.estado = t.editEstado as 'pendiente' | 'en curso' | 'finalizada';
        t.editHoras = 0;

        const toast = await this.toast.create({
          message: 'Cambios guardados correctamente ✔️',
          duration: 2000,
          color: 'success'
        });
        toast.present();
      },
      error: async () => {
        const toast = await this.toast.create({
          message: 'Error al guardar los cambios',
          duration: 2000,
          color: 'danger'
        });
        toast.present();
      }
    });
  }
}
