<?php
/* ========================================================== 
   ENDPOINT: Autenticación de Usuario ― Smart3Z
   Archivo  : login.php
   Ruta     : /api/login.php
   Descripción:
   - Recibe `email` y `contrasena` por POST.
   - Verifica las credenciales contra la base de datos.
   - Devuelve los datos del usuario si son correctas.
   ========================================================== */

require_once 'db.php'; // conexión a la base de datos

// Configuración de cabeceras HTTP
header('Access-Control-Allow-Origin: http://localhost:8100');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Content-Type: application/json; charset=utf-8');

// Respuesta a preflight (CORS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(204);
  exit;
}

/**
 * 1. Leer datos de entrada
 * --------------------------------------------------------
 * Se espera un objeto JSON con los campos:
 * - `email`: email del usuario
 * - `contrasena`: contraseña en texto plano
 */
$data = json_decode(file_get_contents('php://input'), true);
$email      = trim($data['email']      ?? '');
$contrasena = trim($data['contrasena'] ?? '');

/**
 * 2. Buscar usuario en la base de datos
 * --------------------------------------------------------
 * Se seleccionan los campos necesarios y se compara la contraseña.
 */
$stmt = db()->prepare(
  "SELECT id_usuario, nombre, rol,
          id_empresa, id_departamento, contrasena
   FROM   usuarios
   WHERE  email = ?"
);
$stmt->bind_param('s', $email);
$stmt->execute();
$u = $stmt->get_result()->fetch_assoc();

/**
 * 3. Verificación de credenciales
 * --------------------------------------------------------
 * - Si el usuario existe y la contraseña coincide: login correcto.
 * - Si no: se responde con código 401 (no autorizado).
 */
if ($u && $u['contrasena'] === $contrasena) {
  echo json_encode([
    'id'              => $u['id_usuario'],
    'nombre'          => $u['nombre'],
    'rol'             => $u['rol'],
    'id_empresa'      => $u['id_empresa'],
    'id_departamento' => $u['id_departamento']
  ]);
} else {
  http_response_code(401);
  echo json_encode(['error' => 'Credenciales incorrectas']);
}
