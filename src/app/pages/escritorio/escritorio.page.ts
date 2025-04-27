import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService, Sesion } from '../../services/auth.service';
import { NuevoProyectoModalComponent } from './nuevo-proyecto-modal/nuevo-proyecto-modal.component'
import { ProyectoService } from '../../services/proyectos.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-escritorio',
  templateUrl: './escritorio.page.html',
  styleUrls: ['./escritorio.page.scss'],
  standalone: false,
})
export class EscritorioPage {
  sesion!: Sesion | null;          // ⇠ aquí guardamos la sesión
  proyectos$: Observable<any[]> | undefined;   // si ya traes proyectos como stream
  proyectos: any[] = []; 
  modalCtrl: any;

  constructor(
    private authSrv: AuthService,
    private router: Router,
    private proyectoSrv: ProyectoService,
    
  ){}

  ionViewWillEnter() {
    this.sesion = this.authSrv.getUserSession();

    /* si quieres redirigir si no hay sesión */
    if (!this.sesion) {
      this.router.navigate(['/login'], { replaceUrl: true });
      return;
    }

    this.proyectoSrv.proyectosParaUsuario(this.sesion.id)    
        .subscribe(projs => this.proyectos = projs);  
  }

  logout() {
    this.authSrv.clearSession();
    this.router.navigate(['/login'], { replaceUrl: true });
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
