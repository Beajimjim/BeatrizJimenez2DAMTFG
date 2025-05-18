import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Personal {
  id_personal: number;
  id_perfil:   number;
  nombre:      string;
  horas_max_semana: number;
  horas_max_dia:    number;
  disponibilidad:   Record<string,number>;
  vacaciones:       { inicio:string; fin:string }[];
}

@Injectable({ providedIn: 'root' })
export class PersonalService {
  private api = 'http://localhost/TFG/api/personal.php';

  constructor(private http: HttpClient) {}

  listarPorProyecto(idProyecto: number): Observable<Personal[]> {
    return this.http.get<Personal[]>(
      this.api,
      { params: new HttpParams().set('id_proyecto', idProyecto.toString()) }
    );
  }
}
