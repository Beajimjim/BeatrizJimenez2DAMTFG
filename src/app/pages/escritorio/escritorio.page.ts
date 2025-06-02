/* ==========================================================
   PÁGINA «ESCRITORIO» ― Smart3Z
   Archivo  : escritorio.page.ts
   Objetivo :
   - Mostrar los proyectos accesibles al usuario autenticado.
   - Permitir crear o borrar proyectos según permisos (ADMIN / PM).
   - Gestionar redirecciones y feedback visual (toasts, alerts, modales).
   - Utiliza servicios compartidos para sesión y API REST.
   ========================================================== */

/* -------------------- IMPORTACIONES -------------------- *
 *  Agrupadas por bloques para legibilidad:
 *  1. Core Angular / Ionic
 *  2. Routing
 *  3. Servicios de negocio
 *  4. Componentes auxiliares
 */
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

/* -------------------- DECORADOR @Component -------------------- *
 *  selector    → etiqueta usada en el routing.
 *  templateUrl → HTML con la vista.
 *  styleUrls   → hoja de estilos específica de la página.
 *  standalone  → false porque la app usa módulos convencionales.
 */
@Component({
  selector   : 'app-escritorio',
  templateUrl: './escritorio.page.html',
  styleUrls  : ['./escritorio.page.scss'],
  standalone : false,
})
export class EscritorioPage {

  /* ==========================================================
     PROPIEDADES
     ========================================================== */
  sesion!: Sesion | null;     // Datos del usuario (rol, id, etc.)
  proyectos: any[] = [];      // Lista de proyectos renderizados

  /* ------------ GETTERS DE PERMISOS ------------ *
   *  Se calculan en tiempo real a partir del rol de la sesión.
   *  - ADMIN y PM: pueden crear y eliminar proyectos.
   *  - EMP: solo visualiza (filtros en cargarProyectos()).
   */
  get puedeCrear(): boolean   {
    return this.sesion?.rol === 'ADMIN' || this.sesion?.rol === 'PM';
  }
  get puedeEliminar(): boolean{
    return this.sesion?.rol === 'ADMIN' || this.sesion?.rol === 'PM';
  }

  /* -------------------- INYECCIÓN DE DEPENDENCIAS -------------------- *
   *  authSrv     → Gestiona autenticación y almacenamiento de la sesión.
   *  router      → Navegación programática entre páginas.
   *  proyectoSrv → CRUD de proyectos contra la API.
   *  modalCtrl   → Abre el modal para crear un proyecto.
   *  alertCtrl   → Diálogos de confirmación (borrado).
   *  toastCtrl   → Mensajes breves de feedback.
   */
  constructor(
    private authSrv     : AuthService,
    private router      : Router,
    private proyectoSrv : ProyectoService,
    private modalCtrl   : ModalController,
    private alertCtrl   : AlertController,
    private toastCtrl   : ToastController
  ) {}

  /* ==========================================================
     CICLOS DE VIDA
     ========================================================== */

  /**
   * ionViewWillEnter
   * --------------------------------------------------------
   * Se dispara cada vez que la vista está a punto de entrar
   * en el foco (antes de ser interactiva).
   * 1. Recupera la sesión del storage.
   * 2. Si no existe, redirige al login (usuario sin auth).
   * 3. Si existe, carga la lista de proyectos.
   */
  ionViewWillEnter(): void {
    this.sesion = this.authSrv.getUserSession();

    if (!this.sesion) {
      this.router.navigate(['/login'], { replaceUrl: true });
      return; // Evita seguir si la sesión es nula
    }

    this.cargarProyectos();
  }

  /* ==========================================================
     CARGA DE PROYECTOS
     ========================================================== */

  /**
   * cargarProyectos
   * --------------------------------------------------------
   * Orquesta la obtención de proyectos según el rol:
   * - EMP: solo los proyectos donde tiene tareas asignadas.
   * - ADMIN / PM: todos los proyectos accesibles.
   * Utiliza distintos endpoints del ProyectoService.
   */
  private cargarProyectos(): void {
    if (!this.sesion) return; // Seguridad adicional

    /* --------- Caso EMP (empleado) --------- */
    if (this.sesion.rol === 'EMP') {
      this.proyectoSrv.getProyectosDeEmpleado(this.sesion.id).subscribe({
        next : lista => (this.proyectos = lista),
        error: err   => console.error('[ESCRITORIO] Error EMP proyectos:', err)
      });
      return;
    }

    /* --------- Caso ADMIN / PM --------- */
    this.proyectoSrv.getProyectosParaUsuario(this.sesion.id).subscribe({
      next : lista => (this.proyectos = lista),
      error: err   => console.error('[ESCRITORIO] Error proyectos:', err)
    });
  }

  /* ==========================================================
     LOGOUT
     ========================================================== */

  /**
   * logout
   * --------------------------------------------------------
   * 1. Limpia la sesión almacenada.
   * 2. Redirige al login.
   */
  logout(): void {
    this.authSrv.clearSession();
    this.router.navigate(['/login'], { replaceUrl: true });
  }

  /* ==========================================================
     CREACIÓN DE PROYECTO (Modal)
     ========================================================== */

  /**
   * abrirModal
   * --------------------------------------------------------
   * Lanza el modal para crear un nuevo proyecto.
   * - Pasa id_empresa como prop necesaria al componente hijo.
   * - Tras cerrar, inserta el proyecto a la lista si procede
   *   y recarga la lista oficial para reflejar datos del server.
   */
  async abrirModal(): Promise<void> {
    /* 1. Configurar y mostrar modal */
    const modal = await this.modalCtrl.create({
      component     : NuevoProyectoModalComponent,
      componentProps: { id_empresa: this.sesion!.id_empresa }
    });
    await modal.present();

    /* 2. Esperar resultado al cerrar */
    const { data } = await modal.onWillDismiss();

    /* 3. Si se creó un proyecto, actualizar UI */
    if (data?.nuevoProyecto) {
      this.proyectos.unshift(data.nuevoProyecto); // Feedback instantáneo
      this.cargarProyectos();                     // Recarga oficial
    }
  }

  /* ==========================================================
     ELIMINACIÓN DE PROYECTO
     ========================================================== */

  /**
   * confirmarBorrado
   * --------------------------------------------------------
   * 1. Muestra un AlertController para confirmar la acción.
   * 2. Si el usuario confirma, llama a eliminarProyecto().
   * @param p Proyecto a eliminar
   */
 async confirmarBorrado(p: any, ev: Event): Promise<void> {
  ev.stopPropagation();   // ← evita que el click llegue al ion-card
  ev.preventDefault();    // ← evita comportamientos por defecto

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

  /**
   * eliminarProyecto
   * --------------------------------------------------------
   * Llama al servicio para borrar el proyecto y actualiza la UI.
   * - En éxito: quita el proyecto del array y muestra toast verde.
   * - En error: mantiene la lista y muestra toast rojo.
   * @param p Proyecto a borrar
   */
  private eliminarProyecto(p: any): void {
    this.proyectoSrv.eliminarProyecto(p.id_proyecto).subscribe({
      next : async () => {
        /* Filtra localmente para feedback inmediato */
        this.proyectos = this.proyectos.filter(x => x.id_proyecto !== p.id_proyecto);

        /* Toast de éxito */
        (await this.toastCtrl.create({
          message : 'Proyecto eliminado',
          duration: 1500,
          color   : 'success'
        })).present();
      },
      error: async err => {
        console.error('[ESCRITORIO] error borrando', err);

        /* Toast de error */
        (await this.toastCtrl.create({
          message : 'No se pudo eliminar',
          duration: 1500,
          color   : 'danger'
        })).present();
      }
    });
  }
}
