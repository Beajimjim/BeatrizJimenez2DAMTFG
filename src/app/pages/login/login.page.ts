import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
import { ToastController, LoadingController } from '@ionic/angular';
import { AuthService, Sesion } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage {
  form: FormGroup;
  loading!: HTMLIonLoadingElement;

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private authSrv: AuthService,
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],   
      contrasena: ['', Validators.required]
    });
  }

  async login() {
    if (this.form.invalid) {
      this.showToast('Por favor, completa todos los campos.Angular');
      return;
    }

    this.loading = await this.loadingCtrl.create({ message: 'Ingresando...' });
    await this.loading.present();

    this.loginService.login(
      this.form.value.email,
      this.form.value.contrasena
    ).subscribe({
      next: async (res) => {
        await this.loading.dismiss();
        // Aquí puedes guardar el usuario en localStorage si quieres
        const sesion: Sesion = {
          id:    res.id,
          nombre:res.nombre,
          rol:   res.rol,
          email: this.form.value.email,
          id_empresa: res.id_empresa,
          id_departamento:res.id_departamento      // res.id_empresa devuelto por PHP
        };
        this.authSrv.setUserSession(sesion);
        this.router.navigate(['/escritorio']);
      },
      error: async (res) => {
        await this.loading.dismiss();
        this.showToast('Credenciales incorrectas. Angular');
      }
    });
  }

  async showToast(mensaje: string) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 2000,
      color: 'danger'
    });
    await toast.present();
  }
}
