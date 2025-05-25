<?php
// pm-list.php  ─ Devuelve los PM (rol = 'PM') de una empresa -----------------

require_once 'db.php';

/* ---------- CORS ---------- */
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: http://localhost:8100');      // ✱ dominio Ionic
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: POST, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;         // pre-flight OK

/* ---------- Entrada ---------- */
$data       = json_decode(file_get_contents('php://input'), true);
$idEmpresa  = intval($data['id_empresa'] ?? 0);
if (!$idEmpresa) {
  http_response_code(400);
  exit(json_encode(['error'=>'Falta id_empresa']));
}

/* ---------- Query ---------- */
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

echo json_encode($stmt->get_result()->fetch_all(MYSQLI_ASSOC));
