/* ========================================================== 
   SERVICIO «AUTH SERVICE» ― Smart3Z
   Ruta     : src/app/services/auth.service.ts
   Archivo  : auth.service.ts
   Descripción:
   - Gestiona la sesión del usuario autenticado usando localStorage.
   - Proporciona métodos para guardar, obtener o eliminar la sesión.
   - Define la interfaz `Sesion` con los datos clave del usuario.
   ========================================================== */

import { Injectable } from '@angular/core';

/** Clave bajo la cual se guarda la sesión en localStorage */
const KEY = 'smart3z-user';

/** Interfaz que define los datos de sesión */
export interface Sesion {
  id: number;                        // ID del usuario
  nombre: string;                    // Nombre visible
  rol: 'ADMIN' | 'PM' | 'EMP';       // Rol de la sesión
  email: string;                     // Correo electrónico
  id_empresa: number;               // Empresa a la que pertenece
  id_departamento?: number;         // (Opcional) departamento del usuario
}

/** Constante pública por si otros módulos necesitan acceder al nombre de la clave */
export const SESSION_KEY = 'sesion';

@Injectable({ providedIn: 'root' }) // Servicio global
export class AuthService {

  /**
   * setUserSession
   * --------------------------------------------------------
   * - Guarda los datos del usuario en localStorage como JSON.
   * @param user Objeto que cumple con la interfaz `Sesion`
   */
  setUserSession(user: Sesion): void {
    localStorage.setItem(KEY, JSON.stringify(user));
  }

  /**
   * getUserSession
   * --------------------------------------------------------
   * - Recupera la sesión desde localStorage.
   * - Si no existe, devuelve null.
   * @returns Objeto de sesión o null
   */
  getUserSession(): Sesion | null {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) as Sesion : null;
  }

  /**
   * clearSession
   * --------------------------------------------------------
   * - Elimina la sesión actual del almacenamiento local.
   * - Se usa comúnmente al cerrar sesión (logout).
   */
  clearSession(): void {
    localStorage.removeItem(KEY);
  }

  /**
   * isLogged
   * --------------------------------------------------------
   * - Devuelve true si hay una sesión activa.
   * - Útil para proteger rutas o condicionar vistas.
   * @returns boolean indicando si el usuario está logueado
   */
  isLogged(): boolean {
    return this.getUserSession() !== null;
  }
}
