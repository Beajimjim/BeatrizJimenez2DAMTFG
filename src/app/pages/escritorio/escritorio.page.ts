import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NuevoProyectoModalComponent } from './nuevo-proyecto-modal/nuevo-proyecto-modal.component'

@Component({
  selector: 'app-escritorio',
  templateUrl: './escritorio.page.html',
  styleUrls: ['./escritorio.page.scss'],
  standalone: false,
})
export class EscritorioPage {
  usuario = {
    nombre: 'Carlos Ruiz'
  };

  proyectos = [
    {
      nombre: 'Proyecto Alfa',
      jefe: 'Laura Martínez',
      inicio: new Date('2025-03-01'),
      fin: new Date('2025-05-31'),
      equipo: 8
    },
    {
      nombre: 'Proyecto Beta',
      jefe: 'Sergio Gómez',
      inicio: new Date('2025-02-15'),
      fin: new Date('2025-06-01'),
      equipo: 5
    }
    // Estos datos luego vendrán de la base de datos
  ];

  constructor(private modalCtrl: ModalController) {}

  logout() {
    // Lógica de cerrar sesión
    console.log('Sesión cerrada');
  }

  async abrirModal() {
    const modal = await this.modalCtrl.create({
      component: NuevoProyectoModalComponent,
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data?.nuevoProyecto) {
      this.proyectos.push(data.nuevoProyecto);
    }
  }
}
