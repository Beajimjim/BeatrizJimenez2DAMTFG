<?php
/* ========================================================== 
   FUNCIÓN DE CONEXIÓN A BASE DE DATOS ― Smart3Z
   Archivo  : db.php
   Ruta     : /api/db.php
   Descripción:
   - Proporciona una conexión única y reutilizable a MySQL.
   - Utiliza el patrón Singleton mediante `static $conn`.
   - Lanza un error 500 y devuelve un JSON si falla la conexión.
   ========================================================== */

/**
 * db()
 * --------------------------------------------------------
 * Establece y reutiliza una única conexión a la base de datos
 * utilizando el objeto `mysqli`.
 * 
 * 1. Usa una variable estática `$conn` para evitar múltiples conexiones.
 * 2. Conecta a la base de datos local 'smart3z_db' con usuario 'root'.
 * 3. En caso de error, devuelve un código HTTP 500 y un mensaje JSON.
 * 
 * @return mysqli Instancia activa de conexión MySQLi
 */
function db() : mysqli {
  static $conn;

  if ($conn === null) {
    $conn = new mysqli('localhost', 'root', '', 'smart3z_db');

    if ($conn->connect_error) {
      http_response_code(500);
      exit(json_encode(['error' => $conn->connect_error]));
    }
  }

  return $conn;
}
