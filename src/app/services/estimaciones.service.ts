import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// ① — describe el formato real que vas a mandar
export interface ResumenPorPerfil {
  nombre: string;
  horas: number;
  picoConcurrencia: number;
  coberturaVacaciones: number;
  plantillaFinal: number;
  recomendacion: string;
  coste: number;
  hayCapacidad: boolean;     
}

export interface EstimacionPayload {
  id_proyecto      : number;
  total_horas      : number;
  coste_total      : number;
  resumen_json     : ResumenPorPerfil[]; // NO string
  calendario_json  : any;                // tu objeto de calendario
}

@Injectable({ providedIn: 'root' })
export class EstimacionesService {
  private api = 'http://localhost/TFG/api/estimaciones.php';

  crearEstimacion(payload: EstimacionPayload) {
    return this.http.post(this.api, payload);
  }

  getHistorico(idProyecto: number) {
    return this.http.post<any[]>(this.api, { id_proyecto: idProyecto });
  }
  
  constructor(private http: HttpClient) {}
}
