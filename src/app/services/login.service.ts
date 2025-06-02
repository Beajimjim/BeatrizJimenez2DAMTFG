/* ========================================================== 
   SERVICIO «LOGIN SERVICE» ― Smart3Z
   Ruta     : src/app/services/login.service.ts
   Archivo  : login.service.ts
   Descripción:
   - Servicio encargado de gestionar la autenticación de usuarios.
   - Realiza una petición HTTP POST al endpoint login.php del backend.
   - Envía email y contraseña como JSON y devuelve un observable
     con los datos de sesión (o error).
   ========================================================== */

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'  // Servicio disponible globalmente en la aplicación
})
export class LoginService {

  /** URL del endpoint de autenticación en el backend PHP */
  private api = 'http://localhost/TFG/api/login.php';

  /**
   * Constructor
   * --------------------------------------------------------
   * Inyecta HttpClient para hacer peticiones HTTP.
   * @param http Cliente HTTP para enviar las credenciales
   */
  constructor(private http: HttpClient) {}

  /**
   * login
   * --------------------------------------------------------
   * Método que se conecta al backend enviando las credenciales
   * proporcionadas por el usuario (email y contraseña).
   * 
   * 1. Crea un `body` con los campos requeridos.
   * 2. Define los headers para indicar tipo de contenido JSON.
   * 3. Realiza una llamada POST al servidor con los datos.
   * 
   * @param email Correo electrónico del usuario
   * @param contrasena Contraseña del usuario
   * @returns Observable con la respuesta del servidor
   */
  login(email: string, contrasena: string): Observable<any> {
    // ① Cuerpo de la solicitud con las credenciales
    const body = { email, contrasena };

    // ② Encabezados HTTP → indicamos que el cuerpo es JSON
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    // ③ Petición HTTP POST → espera un JSON de respuesta
    return this.http.post(this.api, body, { headers });
  }
}
