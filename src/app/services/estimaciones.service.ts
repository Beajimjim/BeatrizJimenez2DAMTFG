/* ========================================================== 
   SERVICIO «ESTIMACIONES SERVICE» ― Smart3Z
   Ruta     : src/app/services/estimaciones.service.ts
   Archivo  : estimaciones.service.ts
   Descripción:
   - Gestiona las operaciones relacionadas con estimaciones 
     de carga laboral y coste por perfil.
   - Permite enviar una nueva estimación al backend.
   - Permite recuperar el histórico de estimaciones guardadas.
   ========================================================== */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

/**
 * ResumenPorPerfil
 * --------------------------------------------------------
 * Interfaz que define el contenido del resumen por cada
 * perfil profesional implicado en la estimación.
 */
export interface ResumenPorPerfil {
  nombre: string;                  // Nombre del perfil (ej. "Backend", "Diseño")
  horas: number;                  // Total de horas asignadas
  picoConcurrencia: number;      // Máximo número de personas necesarias simultáneamente
  coberturaVacaciones: number;   // Porcentaje o cantidad adicional para cubrir ausencias
  plantillaFinal: number;        // Plantilla recomendada tras ajustes
  recomendacion: string;         // Texto con sugerencias del sistema
  coste: number;                 // Coste estimado para este perfil
  hayCapacidad: boolean;         // Si existe disponibilidad interna
}

/**
 * EstimacionPayload
 * --------------------------------------------------------
 * Objeto que se envía al backend al guardar una estimación.
 */
export interface EstimacionPayload {
  id_proyecto     : number;               // ID del proyecto
  total_horas     : number;               // Total de horas de la estimación
  coste_total     : number;               // Coste económico global del proyecto
  resumen_json    : ResumenPorPerfil[];   // Resumen desglosado por perfil (como objeto, no string)
  calendario_json : any;                  // Objeto con la planificación temporal
}

@Injectable({ providedIn: 'root' }) // Servicio global (singleton)
export class EstimacionesService {
  /** URL del endpoint del backend para estimaciones */
  private api = 'http://localhost/TFG/api/estimaciones.php';

  constructor(private http: HttpClient) {}

  /**
   * crearEstimacion
   * --------------------------------------------------------
   * Envia una nueva estimación al servidor para ser guardada.
   * @param payload Objeto de tipo EstimacionPayload con datos del proyecto.
   * @returns Observable con la respuesta del servidor.
   */
  crearEstimacion(payload: EstimacionPayload) {
    return this.http.post(this.api, payload);
  }

  /**
   * getHistorico
   * --------------------------------------------------------
   * Recupera el histórico de estimaciones guardadas para
   * un proyecto específico.
   * @param idProyecto ID del proyecto del cual se quieren consultar estimaciones pasadas.
   * @returns Observable con un array de resultados del backend.
   */
  getHistorico(idProyecto: number) {
    return this.http.post<any[]>(this.api, { id_proyecto: idProyecto });
  }
}
