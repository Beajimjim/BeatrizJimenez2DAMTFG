import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-calendar-settings',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, ReactiveFormsModule],
  templateUrl: './calendar-settings.component.html',
  styleUrls: ['./calendar-settings.component.scss'],
})
export class CalendarSettingsComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      horasPorDia: [8],
      diasLaborablesPorSemana: [5],
      festivos: [0],
      vacaciones: [0],
      permitirExtras: [false],
      horasExtraMax: [null], // 👈 nuevo
    });
  }

  getConfiguracion() {
    return this.form.value;
  }
}
