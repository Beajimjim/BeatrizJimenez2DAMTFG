<?php
/* ========================================================== 
   ENDPOINT: Listar PMs de una Empresa ― Smart3Z
   Archivo  : pm-lista.php
   Ruta     : /api/pm-lista.php
   Descripción:
   - Devuelve una lista de usuarios con rol 'PM' pertenecientes 
     a una empresa específica.
   - Se utiliza en la creación o edición de proyectos para 
     asignar un responsable.
   ========================================================== */

require_once 'db.php';  // Conexión a base de datos

/* ----------------------------------------------------------
   CORS y configuración de cabeceras
   ---------------------------------------------------------- */
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: http://localhost:8100');  // Frontend Ionic
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: POST, OPTIONS');

// Manejo de solicitud preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

/* ----------------------------------------------------------
   Lectura y validación de entrada
   ---------------------------------------------------------- */
$data      = json_decode(file_get_contents('php://input'), true);
$idEmpresa = intval($data['id_empresa'] ?? 0);

if (!$idEmpresa) {
  http_response_code(400);
  exit(json_encode(['error' => 'Falta id_empresa']));
}

/* ----------------------------------------------------------
   Consulta SQL: Selección de PMs
   ----------------------------------------------------------
   - Se filtra por `rol = 'PM'` y `id_empresa`.
   - Se devuelven campos clave: id_usuario, nombre y email.
   ---------------------------------------------------------- */
$stmt = db()->prepare("
  SELECT id_usuario,
         nombre,
         email
  FROM   usuarios
  WHERE  rol = 'PM' AND id_empresa = ?
  ORDER BY nombre
");
$stmt->bind_param('i', $idEmpresa);
$stmt->execute();

/* ----------------------------------------------------------
   Salida de resultados en formato JSON
   ---------------------------------------------------------- */
echo json_encode($stmt->get_result()->fetch_all(MYSQLI_ASSOC));
