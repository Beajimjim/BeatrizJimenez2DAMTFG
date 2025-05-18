import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { EstimadorService } from 'src/app/services/estimador.service';

@Component({
  selector: 'app-calendar-settings',
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule],
  templateUrl: './calendar-settings.component.html',
})
export class CalendarSettingsComponent implements OnInit {
  form = this.fb.group({
    horasPorDia: [8, [Validators.required, Validators.min(1), Validators.max(24)]],
    diasLaborablesPorSemana: [5, [Validators.required, Validators.min(1), Validators.max(7)]],
    socialRate: [30, [Validators.required, Validators.min(0), Validators.max(100)]],
  });

  constructor(
    private fb: FormBuilder,
    private estimadorService: EstimadorService
  ) {}

  ngOnInit() {
    const cfg = this.estimadorService.getCalendario();
    if (cfg) {
      this.form.patchValue({
        horasPorDia: cfg.horasPorDia,
        diasLaborablesPorSemana: cfg.diasLaborablesPorSemana,
        socialRate: cfg.socialRate ?? 30
      });
    }
  }

  guardarConfiguracion() {
    if (this.form.invalid) return;
    this.estimadorService.setCalendario({
      ...this.form.value
    });
  }
}
