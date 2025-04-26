import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-supercontrolador',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './supercontrolador.page.html',
  styleUrls: ['./supercontrolador.page.scss'],
})
export class SupercontroladorPage {
  // Simulamos un usuario y un par de secciones de menú
  usuario = 'Carlos Ruiz';
  menu = [
    { icon: 'home-outline', label: 'Inicio', path: '/home' },
    { icon: 'settings-outline', label: 'Configuración', path: '/escritorio' },
  ];
}
