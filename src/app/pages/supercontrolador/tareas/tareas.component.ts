import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { ProyectoService, Tarea } from 'src/app/services/proyectos.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-tareas',
  imports: [CommonModule, IonicModule, ReactiveFormsModule],
  templateUrl: './tareas.component.html',
  styleUrls: ['./tareas.component.scss'],
})
export class TareasComponent implements OnInit, OnChanges {
  @Input() proyectoId!: number;

  tareas: Tarea[] = [];
  usuarios: { id_usuario: number, nombre: string }[] = [];
  perfiles: { id: number, nombre: string }[] = [];

  tareaForm!: FormGroup;
  mostrarFormulario = false;
  tareaEditandoId: number | null = null;


  constructor(
    private proyectoService: ProyectoService,
    private fb: FormBuilder,
    private toastCtrl: ToastController
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['proyectoId'] && this.proyectoId) {
      this.cargarTareas();
    }
  }

  ngOnInit() {
    this.tareaForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: [''],
      fecha_inicio: ['', Validators.required],
      fecha_fin: ['', Validators.required],
      horas: [1, [Validators.required, Validators.min(1)]],
      estado: ['pendiente', Validators.required],
      id_usuario: [null],
      id_perfil: [null, Validators.required],
      dependencia_ids: [[]]  // ⬅️ nuevo campo
    });

    const raw = localStorage.getItem('smart3z-user');
    const usuario = raw ? JSON.parse(raw) : null;
    const idEmpresa = usuario?.id_empresa;

    if (idEmpresa) {
      this.proyectoService.getUsuariosPorEmpresa(idEmpresa).subscribe({
        next: (usuarios) => this.usuarios = usuarios,
        error: (err) => console.error('Error al cargar usuarios', err)
      });
    }

    this.proyectoService.getListaPerfiles().subscribe({
      next: (res) => this.perfiles = res,
      error: (err) => console.error('Error al cargar perfiles', err)
    });
  }

  cargarTareas() {
    this.proyectoService.getTareasPorProyecto(this.proyectoId).subscribe({
      next: (response: any) => {
        this.tareas = Array.isArray(response) ? response : response.tareas;
      },
      error: (err) => console.error('Error al cargar tareas', err)
    });
  }

  editarTarea(tarea: Tarea) {
    this.mostrarFormulario = true;
    this.tareaEditandoId = tarea.id;
    this.tareaForm.patchValue({
      ...tarea,
      id_usuario: tarea.id_usuario ?? null,
      id_perfil: tarea.id_perfil ?? null,
      dependencia_ids: tarea.dependencia_ids ? tarea.dependencia_ids.split(',').map(Number) : []
    });
  }

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

  cancelarEdicion() {
    this.mostrarFormulario = false;
    this.tareaForm.reset({ estado: 'pendiente' });
    this.tareaEditandoId = null;
  }

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
