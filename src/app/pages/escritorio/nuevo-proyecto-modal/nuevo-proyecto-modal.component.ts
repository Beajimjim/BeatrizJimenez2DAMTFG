/* ==========================================================
   MODAL «NUEVO PROYECTO» ― Smart3Z
   
   Objetivo :
   - Formulario reactivo para crear un proyecto desde un modal.
   - Carga dinámicamente PMs y Departamentos de la empresa.
   - Devuelve el proyecto creado al componente padre.
   ========================================================== */

/* -------------------- IMPORTACIONES -------------------- *
 *  1) Angular core y utilidades.
 *  2) Módulos comunes / formularios.
 *  3) Ionic UI (ModalController, etc.).
 *  4) Servicios de dominio (ProyectoService).
 */
import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { ProyectoService, PM, Departamento } from 'src/app/services/proyectos.service';

/* -------------------- METADATOS DEL COMPONENTE -------------------- *
 *  selector   → etiqueta usada para instanciar el modal (interno).
 *  standalone → true porque se declara y compila por sí mismo.
 *  imports    → módulos que necesita cuando se lazy-carga.
 *  templateUrl/ styleUrls → Vista y estilos propios.
 */
@Component({
  selector    : 'app-nuevo-proyecto-modal',
  standalone  : true,
  imports     : [IonicModule, CommonModule, ReactiveFormsModule],
  templateUrl : './nuevo-proyecto-modal.component.html',
  styleUrls   : ['./nuevo-proyecto-modal.component.scss']
})
export class NuevoProyectoModalComponent implements OnInit {

  /* ==================== @INPUTS ==================== *
   *  id_empresa → llega desde el escritorio para filtrar
   *  PMs y departamentos.
   */
  @Input() id_empresa!: number;

  /* ==================== PROPIEDADES ==================== */
  formProyecto: FormGroup;      // Formulario reactivo
  pms:           PM[]           = []; // Lista de Project-Managers
  departamentos: Departamento[] = []; // Lista de departamentos

  /* -------------------- CONSTRUCTOR -------------------- *
   *  fb           → genera el FormGroup con validaciones.
   *  proyectoSrv  → llamadas REST (PMs, Dptos, crearProyecto).
   *  modalCtrl    → cierra o devuelve datos al padre.
   */
  constructor(
    private fb          : FormBuilder,
    private proyectoSrv : ProyectoService,
    private modalCtrl   : ModalController
  ) {

    /* -------- DEFINICIÓN DEL FORMULARIO --------
     *  - nombre          : requerido
     *  - id_jefe_pm      : select obligatorio
     *  - id_departamento : select obligatorio
     *  - fecha_inicio/fin: tipo date
     *  - estado          : por defecto «EN_CURSO»
     */
    this.formProyecto = this.fb.group({
      nombre:          ['', Validators.required],
      id_jefe_pm:      [null, Validators.required],
      id_departamento: [null, Validators.required],
      fecha_inicio:    ['', Validators.required],
      fecha_fin:       ['', Validators.required],
      estado:          ['EN_CURSO', Validators.required]
    });
  }

  /* ==========================================================
     CICLO DE VIDA
     ========================================================== */

  /** ngOnInit
   *  --------------------------------------------------------
   *  - Se ejecuta al crear el componente.
   *  - Carga la data auxiliar necesaria para los selects.
   */
  ngOnInit(): void {
    console.log('[MODAL] Empresa =>', this.id_empresa);
    this.cargarPMs();
    this.cargarDepartamentos();
  }

  /* ==========================================================
     CARGA DE LISTAS AUXILIARES
     ========================================================== */

  /** cargarPMs
   *  --------------------------------------------------------
   *  Consulta la API y llena el combo de PMs.
   */
  private cargarPMs(): void {
    this.proyectoSrv.getPMs(this.id_empresa).subscribe({
      next : (lista: PM[]) => {
        console.table(lista);
        this.pms = lista;
      },
      error: (e) => console.error('[MODAL] PMs ✖', e)
    });
  }

  /** cargarDepartamentos
   *  --------------------------------------------------------
   *  Obtiene los departamentos disponibles en la empresa.
   */
  private cargarDepartamentos(): void {
    this.proyectoSrv.getDepartamentosByEmpresa(this.id_empresa).subscribe({
      next : (lista) => {
        console.table(lista);
        this.departamentos = lista;
      },
      error: (err) => console.error('[MODAL] Dptos ✖', err)
    });
  }

  /* ==========================================================
     ACCIONES DE UI
     ========================================================== */

  /** guardarProyecto
   *  --------------------------------------------------------
   *  1. Valida formulario.
   *  2. Crea el payload rellenando id_empresa y casteando IDs.
   *  3. Llama a la API y, en éxito, cierra el modal enviando
   *     el proyecto nuevo al componente origen.
   */
  guardarProyecto(): void {
    if (this.formProyecto.invalid) { return; }

    const payload = {
      ...this.formProyecto.value,
      id_empresa     : this.id_empresa,
      id_jefe_pm     : Number(this.formProyecto.value.id_jefe_pm),
      id_departamento: Number(this.formProyecto.value.id_departamento)
    };

    console.log('[MODAL] payload →', payload);

    this.proyectoSrv.crearProyecto(payload).subscribe({
      next : (res) => {
        console.log('[MODAL] Creado ✔', res);
        this.modalCtrl.dismiss({ nuevoProyecto: res }); // Devuelve datos
      },
      error: (err) => console.error('[MODAL] Crear ✖', err)
    });
  }

  /** cerrarModal
   *  --------------------------------------------------------
   *  Cancela la operación sin retornar datos.
   */
  cerrarModal(): void {
    this.modalCtrl.dismiss();
  }
}
