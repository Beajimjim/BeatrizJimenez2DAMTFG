/* ==========================================================
   COMPONENTE «INCURRIDO POR TAREAS» ― Smart3Z
   Ruta     : src/app/pages/supercontrolador/incurrido-tareas/
   Archivo  : incurrido-tareas.component.ts
   Descripción:
   - Carga las tareas de un proyecto y permite al usuario
     registrar horas “incurridas” y actualizar el estado.
   - Valida entradas para evitar que las horas superen el
     total o sean negativas.
   - Muestra toasts de confirmación o error tras guardar.
   ========================================================== */

import { Component, Input, OnInit }      from '@angular/core';
import { CommonModule }                  from '@angular/common';
import { IonicModule, ToastController }  from '@ionic/angular';
import { FormsModule }                   from '@angular/forms';

import { ProyectoService, Tarea }        from 'src/app/services/proyectos.service';

@Component({
  standalone: true,                       // Se compila por sí solo (Angular 14+)
  selector  : 'app-incurrido-tareas',     // Etiqueta para usar en plantillas
  templateUrl: './incurrido-tareas.component.html',
  styleUrls  : ['./incurrido-tareas.component.scss'],
  imports    : [CommonModule, IonicModule, FormsModule],
})
export class IncurridoTareasComponent implements OnInit {

  /** ID del proyecto recibido desde el componente padre */
  @Input() proyectoId!: number;

  /**
   * Array de tareas enriquecidas con dos propiedades:
   * - editHoras: horas que el usuario desea añadir.
   * - editEstado: estado seleccionado para la tarea.
   */
  tareas: (Tarea & { editHoras: number; editEstado: string })[] = [];

  /**
   * Inyecta:
   * - proyectoSrv: para obtener y actualizar datos de tareas.
   * - toast: para mostrar notificaciones emergentes.
   */
  constructor(
    private proyectoSrv: ProyectoService,
    private toast: ToastController
  ) {}

  /**
   * ngOnInit
   * --------------------------------------------------------
   * 1. Comprueba que exista proyectoId.
   * 2. Llama a la API para obtener todas las tareas del proyecto.
   * 3. Inicializa `editHoras` a 0 y `editEstado` con el estado actual
   *    o 'pendiente' si viene nulo.
   */
  ngOnInit(): void {
    if (!this.proyectoId) return;

    this.proyectoSrv.getTareasPorProyecto(this.proyectoId)
      .subscribe(ts => {
        this.tareas = ts.map(t => ({
          ...t,
          editHoras:    0,
          editEstado:   t.estado ?? 'pendiente'
        }));
      });
  }

  /**
   * guardarCambios
   * --------------------------------------------------------
   * 1. Valida que las horas editadas no sean negativas ni
   *    excedan el total disponible tras sumarlas a las ya
   *    incurridas.
   * 2. Construye un payload con horas_incurridas y estado.
   * 3. Llama a la API para persistir cambios.
   * 4. En éxito:
   *    - Actualiza las propiedades locales t.horas_incurridas,
   *      t.estado y resetea t.editHoras.
   *    - Muestra toast de éxito.
   * 5. En error: muestra toast de fallo.
   * 
   * @param t Tarea modificada (objeto con editHoras/editEstado)
   */
  async guardarCambios(
    t: Tarea & { editHoras: number; editEstado: string }
  ): Promise<void> {
    // 1. Validación básica de horas
    const horasPrevias = t.horas_incurridas ?? 0;
    const totalTrasEdicion = horasPrevias + t.editHoras;
    if (t.editHoras < 0 || totalTrasEdicion > t.horas) {
      const toastErr = await this.toast.create({
        message: 'Las horas incurridas no pueden superar las horas totales ni ser negativas.',
        duration: 2500,
        color: 'danger'
      });
      await toastErr.present();
      return;
    }

    // 2. Preparar payload para la llamada HTTP
    const payload = {
      horas_incurridas: t.editHoras,
      estado:           t.editEstado
    };

    // 3. Invocar servicio de actualización
    this.proyectoSrv.actualizarHorasIncurridas(t.id, payload)
      .subscribe({
        // 4.a Éxito: actualizar datos locales y notificar
        next: async () => {
          t.horas_incurridas = horasPrevias + t.editHoras;
          t.estado = t.editEstado as 'pendiente' | 'en curso' | 'finalizada';
          t.editHoras = 0; // reset del input

          const toastOk = await this.toast.create({
            message: 'Cambios guardados correctamente ✔️',
            duration: 2000,
            color: 'success'
          });
          await toastOk.present();
        },
        // 4.b Error: informar al usuario
        error: async () => {
          const toastFail = await this.toast.create({
            message: 'Error al guardar los cambios',
            duration: 2000,
            color: 'danger'
          });
          await toastFail.present();
        }
      });
  }
}
