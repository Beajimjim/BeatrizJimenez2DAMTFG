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
    // Ajusta la URL según tu API
    return this.http.get(`${this.api}/proyectos/${id}`);
  }

}
