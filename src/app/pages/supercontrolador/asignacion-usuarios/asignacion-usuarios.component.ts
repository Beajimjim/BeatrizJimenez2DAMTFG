import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-asignacion-usuarios',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './asignacion-usuarios.component.html',
  styleUrls: ['./asignacion-usuarios.component.scss'],
})
export class AsignacionUsuariosComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
