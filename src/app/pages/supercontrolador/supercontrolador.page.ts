import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-supercontrolador',
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    RouterModule
  ],
  templateUrl: './supercontrolador.page.html',
  styleUrls: ['./supercontrolador.page.scss']
})
export class SupercontroladorPage {
  usuario = 'Carlos Ruiz';

  menu = [
    { icon: 'home-outline',        label: 'Inicio',         path: '/home'   },
    { icon: 'settings-outline',    label: 'Configuración',  path: '/escritorio' }
  ];
}
