import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile-editor',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, ReactiveFormsModule],
  templateUrl: './profile-editor.component.html',
})
export class ProfileEditorComponent {
  perfilForm: FormGroup;
  perfiles: any[] = [];

  constructor(private fb: FormBuilder) {
    this.perfilForm = this.fb.group({
      nombre: ['', Validators.required],
      tarifa: [null, [Validators.required, Validators.min(0)]],
      horasExtra: [false],
      tarifaExtra: [null],
      disponibilidad: [100, [Validators.required, Validators.min(10), Validators.max(100)]],
    });
  }

  agregarPerfil() {
    const perfil = { ...this.perfilForm.value };

    // Si no hace horas extra, quitamos la tarifaExtra
    if (!perfil.horasExtra) {
      perfil.tarifaExtra = null;
    }

    this.perfiles.push(perfil);
    this.perfilForm.reset({ horasExtra: false, disponibilidad: 100 });
  }

  eliminarPerfil(index: number) {
    this.perfiles.splice(index, 1);
  }

  getPerfiles(): any[] {
    return this.perfiles;
  }
}
