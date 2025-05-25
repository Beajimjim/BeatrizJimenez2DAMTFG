<?php
require_once 'db.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: http://localhost:8100');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: POST, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; }

$data = json_decode(file_get_contents('php://input'), true);

// Validar que se envió el ID de empresa
if (!isset($data['id_empresa'])) {
  http_response_code(400);
  echo json_encode(['error' => 'Falta id_empresa']);
  exit;
}

$idEmpresa = intval($data['id_empresa']);
if ($idEmpresa <= 0) {
  http_response_code(400);
  echo json_encode(['error' => 'id_empresa inválido']);
  exit;
}

// Obtener usuarios de la empresa
$stmt = db()->prepare(
  "SELECT id_usuario, nombre
     FROM usuarios
    WHERE id_empresa = ?
 ORDER BY nombre"
);

$stmt->bind_param('i', $idEmpresa);
$stmt->execute();
$resultado = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

// Devolver resultado
echo json_encode($resultado);
exit;
