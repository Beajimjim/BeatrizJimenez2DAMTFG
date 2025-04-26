import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Proyecto {
  id?:    number;
  nombre: string;
  jefe:   string;
  inicio: string;   // yyyy‑MM‑dd
  fin:    string;   // yyyy‑MM‑dd
  equipo: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProyectosService {

  private api = 'http://localhost/TFG/api/proyectos.php';

  constructor(private http: HttpClient) {}

  /** Lista todos los proyectos */
  listar(): Observable<Proyecto[]> {
    return this.http.get<Proyecto[]>(this.api);
  }

  /** Crea un proyecto */
  crear(p: Proyecto): Observable<any> {
    return this.http.post(this.api, p);
  }

  /** Editar (si implementas PUT en PHP) */
  actualizar(p: Proyecto): Observable<any> {
    return this.http.put(`${this.api}?id=${p.id}`, p);
  }

  /** Eliminar (si implementas DELETE en PHP) */
  borrar(id: number): Observable<any> {
    return this.http.delete(`${this.api}?id=${id}`);
  }
}
