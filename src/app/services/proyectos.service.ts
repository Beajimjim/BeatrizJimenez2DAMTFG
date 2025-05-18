import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PM {
  id_usuario: number;
  nombre:     string;
  email:      string;
}

export interface Departamento {
  id_departamento: number;
  nombre:          string;
}
export interface Tarea {
  dependencia_ids: any;
nombre_perfil: any;
  id_perfil: null;
  id: number;
  id_usuario: number | null;
  nombre: string;
  descripcion: string;
  fecha_inicio: string;
  fecha_fin: string;
  horas: number;
  estado: 'pendiente' | 'en curso' | 'finalizada';
  nombre_usuario?: string; // puede venir null si no tiene usuario
  horas_incurridas?: number;
}

@Injectable({ providedIn: 'root' })
export class ProyectoService {
  private api = 'http://localhost/TFG/api';

  constructor(private http: HttpClient) {}

  getProyectosParaUsuario(id_usuario: number): Observable<any[]> {
    return this.http.post<any[]>(
      `${this.api}/proyectos.php`,
      { id_usuario }
    );
  }

  getPMs(idEmpresa: number): Observable<PM[]> {
    return this.http.post<PM[]>(`${this.api}/pm-lista.php`, { id_empresa: idEmpresa });
  }
  
  /** Departamentos de una empresa */
  getDepartamentosByEmpresa(idEmpresa: number): Observable<Departamento[]> {
    return this.http.post<Departamento[]>(`${this.api}/departamentos-lista.php`, { id_empresa: idEmpresa });
  }

  crearProyecto(payload: any): Observable<any> {
    return this.http.post<any>(`${this.api}/proyectos.php`, payload);
  }

  eliminarProyecto(id: number) {
    // POST porque así ya lo tienes configurado
    return this.http.post<{deleted:number}>(`${this.api}/proyectos.php`, { id_proyecto: id });
  }

  getProyectoCompleto(id: number) {
    const payload = {
      id_proyecto: id,
      detalle: true
    };
    console.log('Enviando payload:', payload); 
    return this.http.post(`${this.api}/proyectos.php`, payload);
  }
    
  getTareasPorProyecto(id_proyecto: number): Observable<any[]> {
    return this.http.post<any[]>(`${this.api}/tareas.php`, { id_proyecto });
  }
  crearTarea(payload: any): Observable<any> {
    return this.http.post(`${this.api}/tareas.php`, payload);
  }

  eliminarTarea(id_tarea: number): Observable<any> {
    return this.http.post(`${this.api}/tareas.php`, { id_tarea });
  }

  getUsuariosPorEmpresa(id_empresa: number): Observable<{ id_usuario: number; nombre: string }[]> {
    return this.http.post<{ id_usuario: number; nombre: string }[]>(`${this.api}/usuarios-lista.php`, {
      id_empresa
    });
  }
  actualizarTarea(id: number, payload: any) {
    return this.http.post(`${this.api}/tareas.php`, { id_tarea: id, ...payload });
  }

  getListaPerfiles(): Observable<any[]> {
  return this.http.get<any[]>(`${this.api}/perfiles.php`);
}

/** Actualiza horas incurridas y estado de una tarea */
  actualizarHorasIncurridas(id: number, payload: { horas_incurridas: number, estado: string }) {
    return this.http.put(`${this.api}/tareas.php?incurrido=${id}`, payload);
  }
}
