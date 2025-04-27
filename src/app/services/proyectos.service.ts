import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProyectoService {

  private apiURL = 'http://localhost/TFG/api/proyectos.php';

  constructor(private http: HttpClient) {}

  /** obtiene los proyectos filtrados para un usuario */
  proyectosParaUsuario(id_usuario: number): Observable<any[]> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any[]>(this.apiURL, { id_usuario }, { headers });
  }
}
