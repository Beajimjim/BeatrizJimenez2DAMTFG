/* ==========================================================
   PÁGINA DE LOGIN ― Smart3Z
   Archivo: login.page.ts
   Descripción:
   - Controla la autenticación del usuario.
   - Implementa un formulario reactivo, peticiones al backend
     y gestión de sesión para el TFG.
   ========================================================== */

/* -------------------- IMPORTACIONES -------------------- */
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
import { ToastController, LoadingController } from '@ionic/angular';
import { AuthService, Sesion } from 'src/app/services/auth.service';

/* -------------------- METADATOS DEL COMPONENTE -------------------- */
@Component({
  selector:   'app-login',            // Etiqueta usada en el template
  templateUrl:'./login.page.html',    // Vista asociada
  styleUrls:  ['./login.page.scss'],  // Hoja de estilos específica
  standalone: false,                  // Forma parte de un módulo clásico
})
export class LoginPage {

  /* -------------------- PROPIEDADES -------------------- */
  form:    FormGroup;                 // Formulario reactivo (email + contraseña)
  loading!: HTMLIonLoadingElement;    // Spin de carga (se crea dinámicamente)

  /* -------------------- CONSTRUCTOR / DI -------------------- *
   *  Se inyectan servicios mediante el constructor:
   *  - FormBuilder: genera el FormGroup con sus validaciones.
   *  - LoginService: comunica con la API de autenticación.
   *  - Router: navega a otras páginas tras el login.
   *  - ToastController: muestra avisos al usuario.
   *  - LoadingController: indica que hay una operación en curso.
   *  - AuthService: guarda la sesión del usuario en memoria / storage.
   */
  constructor(
    private fb:           FormBuilder,
    private loginService: LoginService,
    private router:       Router,
    private toastCtrl:    ToastController,
    private loadingCtrl:  LoadingController,
    private authSrv:      AuthService,
  ) {
    /* -------------------- DEFINICIÓN DEL FORMULARIO -------------------- *
     *  - email: requerido y con patrón de correo válido.
     *  - contrasena: simplemente requerido.
     */
    this.form = this.fb.group({
      email:      ['', [Validators.required, Validators.email]],
      contrasena: ['', Validators.required]
    });
  }

  /* -------------------- MÉTODO PRINCIPAL: login() -------------------- *
   *  1. Valida el formulario.
   *  2. Muestra un spinner mientras espera la respuesta.
   *  3. Llama a loginService.login().
   *  4. En éxito → crea la sesión y navega al escritorio.
   *  5. En error → avisa al usuario.
   */
  async login() {

    /* 1. VALIDACIÓN DEL FORMULARIO */
    if (this.form.invalid) {
      this.showToast('Por favor, completa todos los campos.');
      return;
    }

    /* 2. MOSTRAR SPINNER */
    this.loading = await this.loadingCtrl.create({ message: 'Ingresando...' });
    await this.loading.present();

    /* 3. PETICIÓN AL BACKEND */
    this.loginService
      .login(this.form.value.email, this.form.value.contrasena)
      .subscribe({

        /* ----------- ÉXITO ----------- */
        next: async (res) => {
          await this.loading.dismiss();           // Ocultar spinner

          /* 4.a. CREAR OBJETO SESIÓN */
          const sesion: Sesion = {
            id:              res.id,
            nombre:          res.nombre,
            rol:             res.rol,
            email:           this.form.value.email,
            id_empresa:      res.id_empresa,
            id_departamento: res.id_departamento
          };

          /* 4.b. GUARDAR SESIÓN Y NAVEGAR */
          this.authSrv.setUserSession(sesion);
          this.router.navigate(['/escritorio']);
        },

        /* ----------- ERROR ----------- */
        error: async () => {
          await this.loading.dismiss();           // Ocultar spinner
          this.showToast('Credenciales incorrectas.');
        }
      });
  }

  /* -------------------- UTILIDAD: showToast() -------------------- *
   *  Muestra un mensaje flotante de 2 s en color rojo.
   */
  async showToast(mensaje: string) {
    const toast = await this.toastCtrl.create({
      message:  mensaje,
      duration: 2000,
      color:    'danger'
    });
    await toast.present();
  }
}
