import { Component, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalendarSettingsComponent } from "./calendar-settings/calendar-settings.component";
import { ResumenEstimacionComponent } from "./resumen-estimacion/resumen-estimacion.component";
import { ProyectoService } from 'src/app/services/proyectos.service';
import { EstimadorService } from 'src/app/services/estimador.service';

@Component({
  standalone: true,
  selector: 'app-estimador',
  templateUrl: './estimador.component.html',
  styleUrls: ['./estimador.component.scss'],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    CalendarSettingsComponent,
    ResumenEstimacionComponent
  ],
})
export class EstimadorComponent {
  @Input() proyectoId!: number;
  segmentoActual: string = 'jornada';
  tareasDelProyecto: any[] = [];
  perfiles: any[] = []; // ✅ Inicializado correctamente

  constructor(
    private proyectoService: ProyectoService,
    private estimadorService: EstimadorService
  ) {}

  ngOnInit(): void {
    const id = this.proyectoId;
    this.proyectoService.getTareasPorProyecto(id).subscribe(tareas => {
      this.tareasDelProyecto = tareas;
    });
    this.proyectoService.getListaPerfiles().subscribe(perfiles => {
      this.perfiles = perfiles;
      this.estimadorService.setPerfiles(this.perfiles); // ✅ Guardarlos en el estimador
    });
  }
}
