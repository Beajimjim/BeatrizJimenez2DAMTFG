import { Injectable } from '@angular/core';

const KEY = 'smart3z-user';   // donde guardaremos la sesión

export interface Sesion {
  id:    number;
  nombre:string;
  rol:   'ADMIN' | 'PM' | 'EMP';
  email: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  /* guardar sesión */
  setUserSession(user: Sesion) {
    localStorage.setItem(KEY, JSON.stringify(user));
  }

  /* obtener sesión (o null) */
  getUserSession(): Sesion | null {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) as Sesion : null;
  }

  /* eliminar sesión (logout) */
  clearSession() {
    localStorage.removeItem(KEY);
  }

  /* helper */
  isLogged(): boolean {
    return this.getUserSession() !== null;
  }
}
