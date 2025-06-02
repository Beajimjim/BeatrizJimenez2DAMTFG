/* ========================================================== 
   SERVICIO «ESTIMADOR SERVICE» ― Smart3Z
   Ruta     : src/app/services/estimador.service.ts
   Archivo  : estimador.service.ts
   Descripción:
   - Servicio auxiliar que actúa como "estado temporal" para
     almacenar datos de una estimación en curso.
   - Guarda la configuración del calendario y los perfiles 
     asignados para su posterior uso o envío al backend.
   - Incluye métodos para modificar, consultar y reiniciar 
     estos datos mientras se elabora una estimación.
   ========================================================== */

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root', // Servicio disponible en toda la app sin necesidad de importarlo en módulos
})
export class EstimadorService {

  /** Configuración temporal del calendario de estimación */
  private configuracionCalendario: any = null;

  /** Perfiles implicados en la estimación (con datos como horas, roles, etc.) */
  private perfiles: any[] = [];

  // ==========================================================
  // ========== MÉTODOS DE GESTIÓN DEL CALENDARIO ============
  // ==========================================================

  /**
   * setCalendario
   * --------------------------------------------------------
   * Guarda la configuración del calendario de trabajo 
   * (fechas, asignaciones, distribución por semanas, etc.).
   * @param config Objeto con datos del calendario
   */
  setCalendario(config: any) {
    this.configuracionCalendario = config;
  }

  /**
   * getCalendario
   * --------------------------------------------------------
   * Devuelve la configuración del calendario actual.
   * @returns Objeto de calendario almacenado
   */
  getCalendario(): any {
    return this.configuracionCalendario;
  }

  // ==========================================================
  // ============= MÉTODOS DE GESTIÓN DE PERFILES =============
  // ==========================================================

  /**
   * setPerfiles
   * --------------------------------------------------------
   * Guarda la lista de perfiles utilizada en la estimación.
   * Hace una copia para evitar mutaciones externas.
   * @param perfiles Array de perfiles con datos de planificación
   */
  setPerfiles(perfiles: any[]) {
    this.perfiles = [...perfiles]; // Copia defensiva
  }

  /**
   * getPerfiles
   * --------------------------------------------------------
   * Devuelve la lista actual de perfiles cargados.
   * @returns Array de perfiles
   */
  getPerfiles(): any[] {
    return this.perfiles;
  }

  // ==========================================================
  // ====================== UTILITARIOS ========================
  // ==========================================================

  /**
   * reset
   * --------------------------------------------------------
   * Limpia completamente los datos almacenados. Se llama 
   * normalmente al cerrar o reiniciar una estimación.
   */
  reset() {
    this.configuracionCalendario = null;
    this.perfiles = [];
  }

  /**
   * getResumenEstimacion
   * --------------------------------------------------------
   * Devuelve un resumen combinando los datos actuales del
   * calendario y los perfiles. Puede usarse para montar
   * el `payload` que se envía al servidor.
   * @returns Objeto con calendario y perfiles actuales
   */
  getResumenEstimacion() {
    return {
      calendario: this.configuracionCalendario,
      perfiles: this.perfiles,
    };
  }
}
