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
  tareaForm!: FormGroup;
  usuarios: { id_usuario: number, nombre: string }[] = [];
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
      id_usuario: [null]
    });
  
    const raw = localStorage.getItem('smart3z-user');
    const usuario = raw ? JSON.parse(raw) : null;
    const idEmpresa = usuario?.id_empresa;
    
    console.log('id_empresa obtenido del objeto usuario:', idEmpresa);
  
    if (idEmpresa) {
      this.proyectoService.getUsuariosPorEmpresa(idEmpresa).subscribe({
        next: (usuarios) => {
          this.usuarios = usuarios;
          console.log('Usuarios cargados:', this.usuarios);
        },
        error: (err) => console.error('Error al cargar usuarios', err)
      });
    } else {
      console.warn('No se pudo obtener id_empresa desde localStorage');
    }
  }

  cargarTareas() {
    this.proyectoService.getTareasPorProyecto(this.proyectoId).subscribe({
      next: (response: any) => {
        console.log('Tareas recibidas:', response);
        this.tareas = Array.isArray(response) ? response : response.tareas;
      },
      error: (err) => console.error('Error al cargar tareas', err)
    });
  }

  editarTarea(tarea: Tarea) {
    this.mostrarFormulario = true;
    this.tareaEditandoId = tarea.id; // asegúrate de tener esta propiedad
    this.tareaForm.patchValue({
      ...tarea,
      id_usuario: tarea.id_usuario ?? null,
    });
  }

  crearTarea() {
    if (this.tareaForm.invalid || !this.proyectoId) return;
  
    const datos = {
      ...this.tareaForm.value,
      id_proyecto: this.proyectoId
    };
  
    if (this.tareaEditandoId) {
      // ✅ Modo actualización
      this.proyectoService.actualizarTarea(this.tareaEditandoId, datos).subscribe({
        next: async () => {
          this.tareaForm.reset({ estado: 'pendiente' });
          this.mostrarFormulario = false;
          this.tareaEditandoId = null;
          this.cargarTareas();
  
          const toast = await this.toastCtrl.create({
            message: 'Tarea actualizada correctamente',
            duration: 2000,
            color: 'success'
          });
          await toast.present();
        },
        error: (err) => console.error('Error al actualizar tarea', err)
      });
    } else {
      // ✅ Modo creación
      this.proyectoService.crearTarea(datos).subscribe({
        next: async () => {
          this.tareaForm.reset({ estado: 'pendiente' });
          this.mostrarFormulario = false;
          this.cargarTareas();
  
          const toast = await this.toastCtrl.create({
            message: 'Tarea creada correctamente',
            duration: 2000,
            color: 'success'
          });
          await toast.present();
        },
        error: (err) => console.error('Error al crear tarea', err)
      });
    }
  }

  cancelarEdicion() {
    this.tareaForm.reset({ estado: 'pendiente' });
    this.tareaEditandoId = null;
    this.mostrarFormulario = false;
  }

  getEstadoColor(estado: string): string {
    switch (estado.toLowerCase()) {
      case 'pendiente':
        return 'warning';
      case 'en curso':
        return 'primary';
      case 'finalizada':
        return 'success';
      default:
        return 'medium';
    }
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


