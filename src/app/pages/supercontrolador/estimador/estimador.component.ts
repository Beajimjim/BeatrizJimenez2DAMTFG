import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalendarSettingsComponent } from "./calendar-settings/calendar-settings.component";
import { ProfileEditorComponent } from "./profile-editor/profile-editor.component"; // 👈 AÑADE ESTO

@Component({
  standalone: true,
  selector: 'app-estimador',
  templateUrl: './estimador.component.html',
  styleUrls: ['./estimador.component.scss'],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule // 👈 IMPORTA ESTO
    ,
    CalendarSettingsComponent,
    ProfileEditorComponent
],
})
export class EstimadorComponent {
  segmentoActual: string = 'jornada';
}
