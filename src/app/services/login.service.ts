import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private api = 'http://localhost/TFG/api/login.php';  // tu login.php real

  constructor(private http: HttpClient) {}

  login(email: string, contrasena: string): Observable<any> {
    const body = {
      email,
      contrasena
    };

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post(this.api, body, { headers });
  }
}
