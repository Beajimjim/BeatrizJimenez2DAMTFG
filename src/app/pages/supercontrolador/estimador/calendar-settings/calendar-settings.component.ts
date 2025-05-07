import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { EstimadorService } from 'src/app/services/estimador.service';

@Component({
  selector: 'app-calendar-settings',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, ReactiveFormsModule],
  templateUrl: './calendar-settings.component.html',
  styleUrls: ['./calendar-settings.component.scss'],
})
export class CalendarSettingsComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder, private estimadorService: EstimadorService) {
    this.form = this.fb.group({
      horasPorDia: [8, [Validators.required, Validators.min(1), Validators.max(24)]],
      diasLaborablesPorSemana: [5, [Validators.required, Validators.min(1), Validators.max(7)]],
      festivos: [0, [Validators.required, Validators.min(0)]],
      vacaciones: [0, [Validators.required, Validators.min(0)]],
      permitirExtras: [false],
      horasExtraMax: [null], // No se valida aquí, porque es condicional
    });
  }

  guardarConfiguracion() {
    this.estimadorService.setCalendario(this.form.value);
  }
}
