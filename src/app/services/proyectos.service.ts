/* ========================================================== 
   SERVICIO «PROYECTO SERVICE» ― Smart3Z
   Ruta     : src/app/services/proyecto.service.ts
   Archivo  : proyecto.service.ts
   Descripción:
   - Gestiona proyectos, tareas, perfiles, usuarios y PMs.
   - Accede al backend vía múltiples endpoints PHP.
   - Se utiliza para cargar y actualizar datos del proyecto.
   ========================================================== */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Interfaces de datos utilizadas por el servicio
 * --------------------------------------------------------
 * PM: Representa a un Project Manager.
 * Departamento: Representa un departamento dentro de la empresa.
 * Tarea: Objeto que define una tarea con sus propiedades clave.
 */
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
  nombre_usuario?: string;
  horas_incurridas?: number;
}

@Injectable({ providedIn: 'root' })
export class ProyectoService {

  /** Ruta base del backend PHP para acceder a datos de proyectos */
  private api = 'http://localhost/TFG/api';

  constructor(private http: HttpClient) {}

  /**
   * getProyectosParaUsuario
   * --------------------------------------------------------
   * Devuelve todos los proyectos asociados al usuario (ADMIN, PM o EMP).
   */
  getProyectosParaUsuario(id_usuario: number): Observable<any[]> {
    return this.http.post<any[]>(`${this.api}/proyectos.php`, { id_usuario });
  }

  /**
   * getProyectosDeEmpleado
   * --------------------------------------------------------
   * Devuelve proyectos en los que el empleado tiene tareas asignadas.
   */
  getProyectosDeEmpleado(id_usuario: number): Observable<any[]> {
    return this.http.post<any[]>(`${this.api}/proyectos.php`, {
      id_usuario,
      soloAsignados: true
    });
  }

  /**
   * getPMs
   * --------------------------------------------------------
   * Devuelve lista de PMs de una empresa.
   */
  getPMs(idEmpresa: number): Observable<PM[]> {
    return this.http.post<PM[]>(`${this.api}/pm-lista.php`, { id_empresa: idEmpresa });
  }

  /**
   * getDepartamentosByEmpresa
   * --------------------------------------------------------
   * Devuelve los departamentos disponibles para una empresa.
   */
  getDepartamentosByEmpresa(idEmpresa: number): Observable<Departamento[]> {
    return this.http.post<Departamento[]>(`${this.api}/departamentos-lista.php`, { id_empresa: idEmpresa });
  }

  /**
   * crearProyecto
   * --------------------------------------------------------
   * Envía los datos del nuevo proyecto al backend para ser guardado.
   */
  crearProyecto(payload: any): Observable<any> {
    return this.http.post<any>(`${this.api}/proyectos.php`, payload);
  }

  /**
   * eliminarProyecto
   * --------------------------------------------------------
   * Elimina un proyecto dado su ID.
   */
  eliminarProyecto(id: number) {
    return this.http.post<{ deleted: number }>(`${this.api}/proyectos.php`, { id_proyecto: id });
  }

  /**
   * getProyectoCompleto
   * --------------------------------------------------------
   * Obtiene el detalle completo de un proyecto por su ID.
   */
  getProyectoCompleto(id: number) {
    const payload = {
      id_proyecto: id,
      detalle: true
    };
    console.log('Enviando payload:', payload);
    return this.http.post(`${this.api}/proyectos.php`, payload);
  }

  /**
   * getTareasPorProyecto
   * --------------------------------------------------------
   * Devuelve todas las tareas asociadas a un proyecto.
   */
  getTareasPorProyecto(id_proyecto: number): Observable<any[]> {
    return this.http.post<any[]>(`${this.api}/tareas.php`, { id_proyecto });
  }

  /**
   * crearTarea
   * --------------------------------------------------------
   * Envía al backend la información para crear una nueva tarea.
   */
  crearTarea(payload: any): Observable<any> {
    return this.http.post(`${this.api}/tareas.php`, payload);
  }

  /**
   * actualizarTarea
   * --------------------------------------------------------
   * Actualiza una tarea existente con nuevos datos.
   */
  actualizarTarea(id: number, payload: any) {
    return this.http.post(`${this.api}/tareas.php`, { id_tarea: id, ...payload });
  }

  /**
   * eliminarTarea
   * --------------------------------------------------------
   * Elimina una tarea del proyecto.
   */
  eliminarTarea(id_tarea: number): Observable<any> {
    return this.http.post(`${this.api}/tareas.php`,
      { id_tarea, delete: true }        //  
    );
  }

  /**
   * getUsuariosPorEmpresa
   * --------------------------------------------------------
   * Devuelve la lista de usuarios pertenecientes a una empresa.
   */
  getUsuariosPorEmpresa(id_empresa: number): Observable<{ id_usuario: number; nombre: string }[]> {
    return this.http.post<{ id_usuario: number; nombre: string }[]>(`${this.api}/usuarios-lista.php`, {
      id_empresa
    });
  }

  /**
   * getListaPerfiles
   * --------------------------------------------------------
   * Devuelve la lista de perfiles profesionales disponibles.
   */
  getListaPerfiles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/perfiles.php`);
  }

  /**
   * actualizarHorasIncurridas
   * --------------------------------------------------------
   * Actualiza las horas consumidas e incluso el estado de una tarea.
   */
  actualizarHorasIncurridas(id: number, payload: { horas_incurridas: number, estado: string }) {
    return this.http.put(`${this.api}/tareas.php?incurrido=${id}`, payload);
  }
}
