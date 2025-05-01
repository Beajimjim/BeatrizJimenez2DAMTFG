import { Component } from '@angular/core';
import { ModalController, AlertController, ToastController } from '@ionic/angular';
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
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {}

  /* ------------------------------------------------------------------ */
  ionViewWillEnter() {
    this.sesion = this.authSrv.getUserSession();

    if (!this.sesion) {
      this.router.navigate(['/login'], { replaceUrl: true });
      return;
    }

    this.cargarProyectos();                         // ⬅︎ usa el método común
  }

  /* ----------------- carga/refresca la lista de proyectos ----------- */
  private cargarProyectos(): void {
    if (!this.sesion) { return; }

    this.proyectoSrv.getProyectosParaUsuario(this.sesion.id)
      .subscribe({
        next: lista => {
          console.table(lista, ['id_proyecto','nombre','jefe','departamento']);
          this.proyectos = lista;
        },
        error: err => console.error('Error cargando proyectos:', err)
      });
  }

  /* ------------------------------------------------------------------ */
  logout() {
    this.authSrv.clearSession();
    this.router.navigate(['/login'], { replaceUrl: true });
  }

  /* ------------------- modal “Nuevo proyecto” ----------------------- */
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
      /* feedback inmediato */
      this.proyectos.unshift(data.nuevoProyecto);

      /* refresco “oficial” desde el backend */
      this.cargarProyectos();
    }
  }

  /* ----------------------- Borrar proyecto -------------------------- */
  async confirmarBorrado(p: any) {
    const alert = await this.alertCtrl.create({
      header: 'Eliminar proyecto',
      message: `¿Realmente deseas eliminar “${p.nombre}”?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => this.eliminarProyecto(p)
        }
      ]
    });
    await alert.present();
  }

  private eliminarProyecto(p: any) {
    console.log('[UI] solicitar borrado →', p.id_proyecto);

    this.proyectoSrv.eliminarProyecto(p.id_proyecto).subscribe({
      next: async () => {
        console.log('[UI] borrado OK', p.id_proyecto);
        this.proyectos = this.proyectos.filter(x => x.id_proyecto !== p.id_proyecto);
        (await this.toastCtrl.create({ message:'Proyecto eliminado', duration:1500, color:'success'})).present();
      },
      error: async err => {
        console.error('[UI] error borrando', err);
        (await this.toastCtrl.create({ message:'No se pudo eliminar', duration:1500, color:'danger'})).present();
      }
    });
  }
}
