/* ========================================================== 
   SERVICIO «PERSONAL SERVICE» ― Smart3Z
   Ruta     : src/app/services/personal.service.ts
   Archivo  : personal.service.ts
   Descripción:
   - Proporciona acceso al personal de la empresa o proyecto.
   - Expone método para listar personal asociado a un proyecto.
   - Utiliza el endpoint `personal.php` del backend PHP.
   ========================================================== */

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Interfaz Personal
 * --------------------------------------------------------
 * Define la estructura del objeto que representa a una persona
 * asignable a tareas en el sistema. Se incluye:
 * - Perfil profesional (id_perfil)
 * - Límites de horas semanales y diarias
 * - Disponibilidad diaria en formato { "L": 8, "M": 4, ... }
 * - Vacaciones con fechas de inicio y fin
 */
export interface Personal {
  id_usuario: any;
  id_personal       : number;
  id_perfil         : number;
  nombre            : string;
  horas_max_semana  : number;
  horas_max_dia     : number;
  disponibilidad    : Record<string, number>;
  vacaciones        : { inicio: string; fin: string }[];
}

@Injectable({ providedIn: 'root' })  // Servicio accesible globalmente
export class PersonalService {

  /** URL del endpoint PHP que maneja el personal disponible */
  private api = 'http://localhost/TFG/api/personal.php';

  /**
   * Constructor
   * --------------------------------------------------------
   * Inyecta el cliente HTTP de Angular para realizar peticiones.
   */
  constructor(private http: HttpClient) {}

  /**
   * listarPorProyecto
   * --------------------------------------------------------
   * Llama al backend para obtener una lista de personal disponible
   * para un proyecto concreto.
   * 
   * 1. Recibe el ID del proyecto como parámetro.
   * 2. Construye los parámetros HTTP (query string).
   * 3. Devuelve un observable con un array de objetos `Personal`.
   * 
   * @param idProyecto ID del proyecto del que se quiere obtener personal
   * @returns Observable con la lista de personal asignable
   */
  listarPorProyecto(idProyecto: number): Observable<Personal[]> {
    return this.http.get<Personal[]>(
      this.api,
      {
        params: new HttpParams().set('id_proyecto', idProyecto.toString())
      }
    );
  }
}
