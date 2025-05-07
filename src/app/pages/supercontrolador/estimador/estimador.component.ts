import { Component, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalendarSettingsComponent } from "./calendar-settings/calendar-settings.component";
import { ProfileEditorComponent } from "./profile-editor/profile-editor.component";
import { ResumenEstimacionComponent } from "./resumen-estimacion/resumen-estimacion.component";
import { ProyectoService } from 'src/app/services/proyectos.service';

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
    ProfileEditorComponent,
    ResumenEstimacionComponent
  ],
})
export class EstimadorComponent {
  @Input() proyectoId!: number; // ✅ Aquí lo colocas
  segmentoActual: string = 'jornada';
  tareasDelProyecto: any[] = [];

  constructor(private proyectoService: ProyectoService) {}

  ngOnInit(): void {
    const id = this.proyectoId;
    this.proyectoService.getTareasPorProyecto(id).subscribe(tareas => {
      this.tareasDelProyecto = tareas;
    });
  }
}
