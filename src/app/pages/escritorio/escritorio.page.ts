import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService, Sesion } from '../../services/auth.service';
import { ProyectoService } from '../../services/proyectos.service';
import { NuevoProyectoModalComponent } from './nuevo-proyecto-modal/nuevo-proyecto-modal.component';

@Component({
  selector: 'app-escritorio',
  templateUrl: './escritorio.page.html',
  styleUrls: ['./escritorio.page.scss'],
  standalone: false,
})
export class EscritorioPage {
  sesion!: Sesion | null;
  proyectos: any[] = [];

  constructor(
    private authSrv: AuthService,
    private router: Router,
    private proyectoSrv: ProyectoService,
    private modalCtrl: ModalController
  ) {}

  ionViewWillEnter() {
    this.sesion = this.authSrv.getUserSession();

    if (!this.sesion) {
      this.router.navigate(['/login'], { replaceUrl: true });
      return;
    }

    // Aquí llamamos al método que sí existe
    this.proyectoSrv.getProyectosParaUsuario(this.sesion.id)
      .subscribe((projs: any[]) => {
        this.proyectos = projs;
      }, err => {
        console.error('Error cargando proyectos:', err);
      });
  }

  logout() {
    this.authSrv.clearSession();
    this.router.navigate(['/login'], { replaceUrl: true });
  }

  async abrirModal() {
    const modal = await this.modalCtrl.create({
      component: NuevoProyectoModalComponent,
      componentProps: {
        id_empresa: this.sesion!.id_empresa        
      }
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data?.nuevoProyecto) {
      this.proyectos.push(data.nuevoProyecto);
    }
  }
}
