<?php
require_once 'db.php';
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: http://localhost:8100');
header('Access-Control-Allow-Headers: Content-Type');
if ($_SERVER['REQUEST_METHOD']==='OPTIONS') exit;

// leo body
$data = json_decode(file_get_contents('php://input'), true);
$idEmpresa = intval($data['id_empresa'] ?? 0);
if (!$idEmpresa) {
  http_response_code(400);
  exit(json_encode(['error'=>'Falta id_empresa']));
}

// selecciono
$stmt = db()->prepare("
  SELECT id_departamento, nombre 
  FROM departamentos 
  WHERE id_empresa = ?
");
$stmt->bind_param('i', $idEmpresa);
$stmt->execute();
$res = $stmt->get_result();

echo json_encode($res->fetch_all(MYSQLI_ASSOC));
