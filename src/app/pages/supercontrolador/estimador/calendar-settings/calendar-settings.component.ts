/* ==========================================================
   COMPONENTE «CONFIGURACIÓN DE CALENDARIO» ― Smart3Z
   Archivo  : calendar-settings.component.ts
   Objetivo :
   - Gestiona la configuración base del calendario laboral:
     · Horas de trabajo diarias
     · Días laborables por semana
     · Porcentaje de coste social
   - Persiste/recupera la información usando EstimadorService.
   - Se muestra dentro de un <ion-card> (ver plantilla HTML).
   ========================================================== */

/* -------------------- IMPORTACIONES -------------------- *
 *  1) Angular core + common    → Component, NgModules.
 *  2) Ionic UI                 → controles y estilos.
 *  3) Formularios reactivos    → FormBuilder, Validators.
 *  4) Servicio de dominio      → EstimadorService (gestión
 *     de calendario y estimaciones).
 */
import { Component, OnInit }          from '@angular/core';
import { CommonModule }               from '@angular/common';
import { IonicModule }                from '@ionic/angular';
import { FormBuilder, Validators,
         ReactiveFormsModule }        from '@angular/forms';
import { EstimadorService }           from 'src/app/services/estimador.service';

/* -------------------- METADATOS DEL COMPONENTE -------------------- *
 *  standalone:true   → se compila independientemente (Ng14+).
 *  selector          → etiqueta para incrustarlo en plantillas.
 *  imports           → módulos requeridos cuando se carga lazy.
 *  templateUrl       → HTML con el formulario (ion-card, etc.).
 */
@Component({
  selector    : 'app-calendar-settings',
  standalone  : true,
  imports     : [CommonModule, IonicModule, ReactiveFormsModule],
  templateUrl : './calendar-settings.component.html',
})
export class CalendarSettingsComponent implements OnInit {

  /* ==========================================================
     F O R M U L A R I O   R E A C T I V O
     ----------------------------------------------------------
     Se define de forma in-line para mayor concisión.
     • horasPorDia               : 1 – 24 h
     • diasLaborablesPorSemana   : 1 – 7 días
     • socialRate (%)            : 0 – 100 %
     ========================================================== */
  form = this.fb.group({
    horasPorDia: [
      8,
      [Validators.required, Validators.min(1), Validators.max(24)]
    ],
    diasLaborablesPorSemana: [
      5,
      [Validators.required, Validators.min(1), Validators.max(7)]
    ],
    socialRate: [
      30,
      [Validators.required, Validators.min(0), Validators.max(100)]
    ],
  });

  /* -------------------- CONSTRUCTOR / DI -------------------- *
   *  fb               → genera el FormGroup.
   *  estimadorService → provee getters/setters para la
   *                     configuración de calendario a nivel
   *                     aplicación/usuario.
   */
  constructor(
    private fb: FormBuilder,
    private estimadorService: EstimadorService
  ) {}

  /* ==========================================================
     CICLO DE VIDA
     ========================================================== */

  /**
   * ngOnInit
   * --------------------------------------------------------
   * 1. Recupera la configuración previa (si existe) desde
   *    EstimadorService.
   * 2. Aplica los valores al formulario con patchValue().
   */
  ngOnInit(): void {
    const cfg = this.estimadorService.getCalendario();
    if (cfg) {
      this.form.patchValue({
        horasPorDia:               cfg.horasPorDia,
        diasLaborablesPorSemana:   cfg.diasLaborablesPorSemana,
        socialRate:                cfg.socialRate ?? 30   // fallback 30 %
      });
    }
  }

  /* ==========================================================
     ACCIONES DE UI
     ========================================================== */

  /**
   * guardarConfiguracion
   * --------------------------------------------------------
   * 1. Valida el formulario.
   * 2. Persiste los valores mediante EstimadorService.
   *    (El propio servicio se encarga de cualquier almacenamiento
   *    en localStorage o llamada API, según la implementación).
   */
  guardarConfiguracion(): void {
    if (this.form.invalid) return;

    this.estimadorService.setCalendario({
      ...this.form.value
    });
  }
}
