import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { ProyectoService, PM, Departamento } from 'src/app/services/proyectos.service';

@Component({
  selector: 'app-nuevo-proyecto-modal',
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule],
  templateUrl: './nuevo-proyecto-modal.component.html',
  styleUrls: ['./nuevo-proyecto-modal.component.scss']
})
export class NuevoProyectoModalComponent implements OnInit {

  @Input() id_empresa!: number;        // viene vía componentProps

  formProyecto: FormGroup;
  pms:           PM[]           = [];
  departamentos: Departamento[] = [];

  constructor(
    private fb: FormBuilder,
    private proyectoSrv: ProyectoService,
    private modalCtrl: ModalController
  ) {
    this.formProyecto = this.fb.group({
      nombre:          ['', Validators.required],
      id_jefe_pm:      [null, Validators.required],
      id_departamento: [null, Validators.required],
      fecha_inicio:    ['', Validators.required],
      fecha_fin:       ['', Validators.required],
      estado:          ['EN_CURSO', Validators.required]
    });
  }

  /* ===== lifecycle ===== */
  ngOnInit(): void {
    console.log('[MODAL] Empresa =>', this.id_empresa);
    this.cargarPMs();
    this.cargarDepartamentos();
  }

  /* ===== datos auxiliares ===== */
  private cargarPMs() {
    this.proyectoSrv.getPMs(this.id_empresa)
        .subscribe({
          next: (lista:PM[]) => {
            console.table(lista);
            this.pms = lista;               // ← ahora es PM[]
          },
          error: (e) => console.error(e)
        });
  }
  

  private cargarDepartamentos(): void {
    this.proyectoSrv.getDepartamentosByEmpresa(this.id_empresa).subscribe({
      next : lista => {
        console.table(lista);
        this.departamentos = lista;
      },
      error: err   => console.error('[MODAL] Dptos ✖', err)
    });
  }

  /* ===== acciones UI ===== */
  guardarProyecto() {
    if (this.formProyecto.invalid) { return; }
  
    const payload = {
      ...this.formProyecto.value,
      id_empresa:      this.id_empresa,
      id_jefe_pm:      Number(this.formProyecto.value.id_jefe_pm),
      id_departamento: Number(this.formProyecto.value.id_departamento)
    };
  
    console.log('[MODAL] payload →', payload);
  
    this.proyectoSrv.crearProyecto(payload).subscribe({
      next: (res) => {
        console.log('[MODAL] Creado ✔', res);
        this.modalCtrl.dismiss({ nuevoProyecto: res });
      },
      error: (err) => console.error('[MODAL] Crear ✖', err)
    });
  }
  

  cerrarModal(): void {
    this.modalCtrl.dismiss();
  }

}

