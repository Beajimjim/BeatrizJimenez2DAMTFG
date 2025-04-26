import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Proyecto {
  id_proyecto?:    number;
  id_departamento: number;
  id_jefe_pm:      number;
  nombre:          string;
  descripcion:     string;
  fecha_inicio:    string;
  fecha_fin:       string;
  estado:          'EN_CURSO'|'PAUSADO'|'FINALIZADO';
}

@Injectable({ providedIn: 'root' })
export class ProyectosService {
  private url = 'http://localhost/TFG/api/proyectos';

  constructor(private http: HttpClient) {}

  lista(): Observable<Proyecto[]>{
    return this.http.get<Proyecto[]>(this.url); 
  }
  uno(id: number): Observable<Proyecto>{ 
    return this.http.get<Proyecto>(`${this.url}?id=${id}`); 
  }
  crear(p: Proyecto){ 
    return this.http.post(this.url, p); 
  }
  actualizar(id:number, p: Proyecto){ 
    return this.http.put(`${this.url}?id=${id}`, p); 
  }
  borrar(id: number){ 
    return this.http.delete(`${this.url}?id=${id}`); 
  }
}
