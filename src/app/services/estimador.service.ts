import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EstimadorService {
  private configuracionCalendario: any = null;
  private perfiles: any[] = [];

  // === CALENDARIO ===
  setCalendario(config: any) {
    this.configuracionCalendario = config;
  }

  getCalendario(): any {
    return this.configuracionCalendario;
  }

  // === PERFILES ===
  setPerfiles(perfiles: any[]) {
    this.perfiles = [...perfiles]; // copia por seguridad
  }

  getPerfiles(): any[] {
    return this.perfiles;
  }

  reset() {
    this.configuracionCalendario = null;
    this.perfiles = [];
  }

  // === Si quisieras crear una estimación completa:
  getResumenEstimacion() {
    return {
      calendario: this.configuracionCalendario,
      perfiles: this.perfiles,
    };
  }
}
