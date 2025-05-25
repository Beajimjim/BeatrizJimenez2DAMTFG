<?php
require_once 'db.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: http://localhost:8100');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: GET, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  exit;
}

$mysqli = db();

// Preparamos usando JOIN con usuarios para traer el nombre
$stmt = $mysqli->prepare("
  SELECT
    per.id_personal,
    per.id_perfil,
    u.nombre          AS nombre,
    per.horas_max_semana,
    per.horas_max_dia,
    per.disponibilidad,
    per.vacaciones
  FROM personal per
  LEFT JOIN usuarios u ON u.id_usuario = per.id_usuario
");
if (!$stmt) {
  http_response_code(500);
  echo json_encode(['error'=>'Error al preparar consulta']);
  exit;
}

$stmt->execute();
$res = $stmt->get_result();
$rows = $res->fetch_all(MYSQLI_ASSOC);

echo json_encode($rows);
exit;
