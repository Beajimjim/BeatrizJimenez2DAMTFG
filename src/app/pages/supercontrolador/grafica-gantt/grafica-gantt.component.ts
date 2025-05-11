import { Component, Input, OnInit } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-grafica-gantt',
  templateUrl: './grafica-gantt.component.html',
  styleUrls: ['./grafica-gantt.component.scss'],
})
export class GraficaGanttComponent  implements OnInit {
  @Input() proyectoId!: number;
  
  constructor() { }

  ngOnInit() {}

}
