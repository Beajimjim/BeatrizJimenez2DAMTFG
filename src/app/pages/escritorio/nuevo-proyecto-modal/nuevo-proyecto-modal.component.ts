import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-nuevo-proyecto-modal',
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule
  ],
  templateUrl: './nuevo-proyecto-modal.component.html',
  styleUrls: ['./nuevo-proyecto-modal.component.scss']
})
export class NuevoProyectoModalComponent {
  formProyecto: FormGroup;

  constructor(private fb: FormBuilder) {
    // Definimos los campos
    this.formProyecto = this.fb.group({
      nombre: [''],
      fecha: [''],   // aquí guardamos la fecha
      jefe: [''],
      equipo: ['']
    });
  }

  cerrarModal() {
    // Aquí cierras el modal, por ejemplo con modalCtrl.dismiss()
    console.log('Modal cerrado');
  }

  guardarProyecto() {
    // Recoges los datos del formulario
    const datos = this.formProyecto.value;
    console.log('Datos del proyecto:', datos);
    // Podrías hacer una petición a tu backend, etc.
    this.cerrarModal();
  }
}
