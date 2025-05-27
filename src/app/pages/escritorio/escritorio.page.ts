/* escritorio.page.ts */
import { Component } from '@angular/core';
import {
  ModalController,
  AlertController,
  ToastController
} from '@ionic/angular';
import { Router } from '@angular/router';

import { AuthService, Sesion }   from '../../services/auth.service';
import { ProyectoService }       from '../../services/proyectos.service';
import { NuevoProyectoModalComponent } from './nuevo-proyecto-modal/nuevo-proyecto-modal.component';

@Component({
  selector   : 'app-escritorio',
  templateUrl: './escritorio.page.html',
  styleUrls  : ['./escritorio.page.scss'],
  standalone : false,
})
export class EscritorioPage {

  sesion!: Sesion | null;
  proyectos: any[] = [];

  /* ------------ helpers de permisos ---------------- */
  get puedeCrear(): boolean   { return this.sesion?.rol === 'ADMIN' || this.sesion?.rol === 'PM'; }
  get puedeEliminar(): boolean{ return this.sesion?.rol === 'ADMIN' || this.sesion?.rol === 'PM'; }

  constructor(
    private authSrv   : AuthService,
    private router    : Router,
    private proyectoSrv: ProyectoService,
    private modalCtrl : ModalController,
    private alertCtrl : AlertController,
    private toastCtrl : ToastController
  ) {}

  /* ================================================= */
  /* Ciclos de vida                                    */
  /* ================================================= */
  ionViewWillEnter() {
    this.sesion = this.authSrv.getUserSession();

    if (!this.sesion) {
      this.router.navigate(['/login'], { replaceUrl: true });
      return;
    }
    this.cargarProyectos();
  }

  /* ================================================= */
  /* Cargar lista de proyectos                         */
  /* ================================================= */
  private cargarProyectos(): void {
    if (!this.sesion) return;

    /* ----------- 1. Usuarios EMP → solo proyectos con tareas asignadas */
    if (this.sesion.rol === 'EMP') {
      this.proyectoSrv.getProyectosDeEmpleado(this.sesion.id).subscribe({
        next : lista => this.proyectos = lista,
        error: err   => console.error('[ESCRITORIO] Error EMP proyectos:', err)
      });
      return;
    }

    /* ----------- 2. ADMIN / PM → lista completa según API original --- */
    this.proyectoSrv.getProyectosParaUsuario(this.sesion.id).subscribe({
      next : lista => this.proyectos = lista,
      error: err   => console.error('[ESCRITORIO] Error proyectos:', err)
    });
  }

  /* ================================================= */
  logout() {
    this.authSrv.clearSession();
    this.router.navigate(['/login'], { replaceUrl: true });
  }

  /* --------------- MODAL: nuevo proyecto ----------- */
  async abrirModal() {
    const modal = await this.modalCtrl.create({
      component      : NuevoProyectoModalComponent,
      componentProps : { id_empresa: this.sesion!.id_empresa }
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data?.nuevoProyecto) {
      this.proyectos.unshift(data.nuevoProyecto);  // feedback instantáneo
      this.cargarProyectos();                      // recarga oficial
    }
  }

  /* --------------- Eliminar proyecto -------------- */
  async confirmarBorrado(p: any) {
    const alert = await this.alertCtrl.create({
      header : 'Eliminar proyecto',
      message: `¿Realmente deseas eliminar “${p.nombre}”?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text   : 'Eliminar',
          role   : 'destructive',
          handler: () => this.eliminarProyecto(p)
        }
      ]
    });
    await alert.present();
  }

  private eliminarProyecto(p: any) {
    this.proyectoSrv.eliminarProyecto(p.id_proyecto).subscribe({
      next : async () => {
        this.proyectos = this.proyectos.filter(x => x.id_proyecto !== p.id_proyecto);
        (await this.toastCtrl.create({ message:'Proyecto eliminado', duration:1500, color:'success'})).present();
      },
      error: async err => {
        console.error('[ESCRITORIO] error borrando', err);
        (await this.toastCtrl.create({ message:'No se pudo eliminar', duration:1500, color:'danger'})).present();
      }
    });
  }
}
