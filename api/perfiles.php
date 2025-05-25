<?php
require_once 'db.php';

header('Access-Control-Allow-Origin: http://localhost:8100');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(204);
  exit;
}

// CONSULTA A BASE DE DATOS
$stmt = db()->prepare("
  SELECT id, nombre, tarifa, tarifa_extra, horas_extra, disponibilidad
  FROM perfiles
");
$stmt->execute();
$resultado = $stmt->get_result();

$perfiles = [];
while ($row = $resultado->fetch_assoc()) {
  $perfiles[] = [
    'id'             => (int)$row['id'],
    'nombre'         => $row['nombre'],
    'tarifa'         => (float)$row['tarifa'],
    'tarifaExtra'    => isset($row['tarifa_extra']) ? (float)$row['tarifa_extra'] : null,
    'horasExtra'     => (bool)$row['horas_extra'],
    'disponibilidad' => (int)$row['disponibilidad']
  ];
}

echo json_encode($perfiles);
