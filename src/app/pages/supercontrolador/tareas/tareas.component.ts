/* ========================================================== 
   COMPONENTE «TAREAS» ― Smart3Z
   Ruta     : src/app/pages/supercontrolador/tareas/
   Archivo  : tareas.component.ts
   Descripción:
   - Permite crear, editar, eliminar y listar tareas 
     asociadas a un proyecto.
   - Usa Reactive Forms para gestionar el formulario.
   - Recupera datos de usuarios y perfiles desde el backend.
   - Muestra notificaciones tipo toast al realizar acciones.
   ========================================================== */

import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { ProyectoService, Tarea } from 'src/app/services/proyectos.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  standalone: true,                         // Componente independiente (Angular 14+)
  selector  : 'app-tareas',                 // Selector para usar en HTML
  templateUrl: './tareas.component.html',
  styleUrls  : ['./tareas.component.scss'],
  imports    : [CommonModule, IonicModule, ReactiveFormsModule],
})
export class TareasComponent implements OnInit, OnChanges {

  /** ID del proyecto recibido como entrada */
  @Input() proyectoId!: number;

  /** Listado de tareas del proyecto actual */
  tareas: Tarea[] = [];

  /** Listado de usuarios disponibles en la empresa */
  usuarios: { id_usuario: number, nombre: string }[] = [];

  /** Listado de perfiles de rol disponibles */
  perfiles: { id: number, nombre: string }[] = [];

  /** Formulario reactivo para crear o editar tareas */
  tareaForm!: FormGroup;

  /** Estado visual del formulario (mostrar/ocultar) */
  mostrarFormulario = false;

  /** ID de la tarea que se está editando (null si es nueva) */
  tareaEditandoId: number | null = null;

  constructor(
    private proyectoService: ProyectoService,
    private fb: FormBuilder,
    private toastCtrl: ToastController
  ) {}

  /**
   * ngOnChanges
   * --------------------------------------------------------
   * - Se ejecuta cuando cambia el input `proyectoId`.
   * - Si el ID está definido, carga las tareas asociadas.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['proyectoId'] && this.proyectoId) {
      this.cargarTareas();
    }
  }

  /**
   * ngOnInit
   * --------------------------------------------------------
   * - Inicializa el formulario con validaciones.
   * - Recupera los usuarios y perfiles disponibles.
   * - Asocia la tarea al ID del proyecto correspondiente.
   */
  ngOnInit() {
    this.tareaForm = this.fb.group({
      nombre:         ['', Validators.required],
      descripcion:    [''],
      fecha_inicio:   ['', Validators.required],
      fecha_fin:      ['', Validators.required],
      horas:          [1, [Validators.required, Validators.min(1)]],
      estado:         ['pendiente', Validators.required],
      id_usuario:     [null],
      id_perfil:      [null, Validators.required],
      dependencia_ids: [[]] // IDs de tareas de las que depende esta
    });

    const raw = localStorage.getItem('smart3z-user');
    const usuario = raw ? JSON.parse(raw) : null;
    const idEmpresa = usuario?.id_empresa;

    if (idEmpresa) {
      this.proyectoService.getUsuariosPorEmpresa(idEmpresa).subscribe({
        next:  (usuarios) => this.usuarios = usuarios,
        error: (err) => console.error('Error al cargar usuarios', err)
      });
    }

    this.proyectoService.getListaPerfiles().subscribe({
      next:  (res) => this.perfiles = res,
      error: (err) => console.error('Error al cargar perfiles', err)
    });
  }

  /**
   * cargarTareas
   * --------------------------------------------------------
   * - Solicita al servicio las tareas asociadas al proyecto.
   * - Almacena el resultado en la variable `tareas`.
   */
  cargarTareas() {
    this.proyectoService.getTareasPorProyecto(this.proyectoId).subscribe({
      next:  (response: any) => {
        this.tareas = Array.isArray(response) ? response : response.tareas;
      },
      error: (err) => console.error('Error al cargar tareas', err)
    });
  }

  /**
   * editarTarea
   * --------------------------------------------------------
   * - Rellena el formulario con los datos de una tarea existente.
   * - Convierte `dependencia_ids` de string a array numérico.
   */
  editarTarea(tarea: Tarea) {
    this.mostrarFormulario = true;
    this.tareaEditandoId = tarea.id;
    this.tareaForm.patchValue({
      ...tarea,
      id_usuario: tarea.id_usuario ?? null,
      id_perfil:  tarea.id_perfil  ?? null,
      dependencia_ids: tarea.dependencia_ids 
        ? tarea.dependencia_ids.split(',').map(Number) 
        : []
    });
  }

  /**
   * crearTarea
   * --------------------------------------------------------
   * - Valida el formulario.
   * - Construye el payload con los datos del formulario.
   * - Si hay `tareaEditandoId`, actualiza; si no, crea nueva.
   * - Muestra toast y recarga tareas.
   */
  crearTarea() {
    if (this.tareaForm.invalid || !this.proyectoId) return;

    const datos = {
      ...this.tareaForm.value,
      dependencia_ids: (this.tareaForm.value.dependencia_ids || []).join(','),
      id_proyecto: this.proyectoId
    };

    const request = this.tareaEditandoId
      ? this.proyectoService.actualizarTarea(this.tareaEditandoId, datos)
      : this.proyectoService.crearTarea(datos);

    console.log('🔽 Enviando datos a backend:', datos);

    request.subscribe({
      next: async () => {
        this.tareaForm.reset({ estado: 'pendiente' });
        this.mostrarFormulario = false;
        this.tareaEditandoId = null;
        this.cargarTareas();
        const toast = await this.toastCtrl.create({
          message: this.tareaEditandoId ? 'Tarea actualizada' : 'Tarea creada',
          duration: 2000,
          color: 'success'
        });
        await toast.present();
      },
      error: (err) => console.error('Error al guardar tarea', err)
    });
  }

  /**
   * cancelarEdicion
   * --------------------------------------------------------
   * - Resetea el formulario y oculta el panel.
   * - Borra la referencia a `tareaEditandoId`.
   */
  cancelarEdicion() {
    this.mostrarFormulario = false;
    this.tareaForm.reset({ estado: 'pendiente' });
    this.tareaEditandoId = null;
  }

  /**
   * eliminarTarea
   * --------------------------------------------------------
   * - Elimina la tarea seleccionada por su ID.
   * - Muestra un toast y recarga las tareas.
   */
  eliminarTarea(id_tarea: number) {
    this.proyectoService.eliminarTarea(id_tarea).subscribe({
      next: async () => {
        this.cargarTareas();
        const toast = await this.toastCtrl.create({
          message: 'Tarea eliminada correctamente',
          duration: 2000,
          color: 'danger'
        });
        await toast.present();
      },
      error: (err) => console.error('Error al eliminar tarea', err)
    });
  }
}
