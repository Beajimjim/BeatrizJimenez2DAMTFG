<?php
/* ========================================================== 
   ENDPOINT: Listar Departamentos ― Smart3Z
   Archivo  : departamentos-lista.php
   Ruta     : /api/departamentos-lista.php
   Descripción:
   - Devuelve la lista de departamentos de una empresa.
   - Requiere `id_empresa` en el cuerpo del POST.
   - Utiliza conexión a la base de datos vía `db.php`.
   ========================================================== */

require_once 'db.php'; // conexión a la base de datos

// Configuración de cabeceras HTTP
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: http://localhost:8100');
header('Access-Control-Allow-Headers: Content-Type');

// CORS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

/**
 * 1. Leer y validar entrada JSON
 * --------------------------------------------------------
 * Se espera un objeto con el campo `id_empresa`.
 * Si falta, se responde con error 400.
 */
$data = json_decode(file_get_contents('php://input'), true);
$idEmpresa = intval($data['id_empresa'] ?? 0);

if (!$idEmpresa) {
  http_response_code(400);
  exit(json_encode(['error' => 'Falta id_empresa']));
}

/**
 * 2. Consulta SQL
 * --------------------------------------------------------
 * Se obtienen los departamentos correspondientes a la empresa
 * usando una consulta preparada.
 */
$stmt = db()->prepare("
  SELECT id_departamento, nombre 
  FROM departamentos 
  WHERE id_empresa = ?
");
$stmt->bind_param('i', $idEmpresa);
$stmt->execute();
$res = $stmt->get_result();

/**
 * 3. Respuesta
 * --------------------------------------------------------
 * Se devuelve un array JSON con los departamentos.
 */
echo json_encode($res->fetch_all(MYSQLI_ASSOC));
