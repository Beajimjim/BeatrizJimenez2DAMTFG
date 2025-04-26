import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NuevoProyectoModalComponent } from './nuevo-proyecto-modal/nuevo-proyecto-modal.component'
import { ProyectosService, Proyecto } from '../../services/proyectos.service';

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

  proyectos: Proyecto[] = [];

  constructor(
    private modalCtrl: ModalController,
    private proyectosSvc: ProyectosService
  ){}

  ionViewWillEnter() {
    this.proyectosSvc.lista().subscribe(data => this.proyectos = data);
  }

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
