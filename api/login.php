<?php
require_once 'db.php';
header('Access-Control-Allow-Origin: http://localhost:8100');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Content-Type: application/json; charset=utf-8');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

$data = json_decode(file_get_contents('php://input'), true);
$email      = trim($data['email']       ?? '');
$contrasena = trim($data['contrasena']  ?? '');

$stmt = db()->prepare(
  "SELECT id_usuario, nombre, rol,
          id_empresa, id_departamento, contrasena
   FROM   usuarios
   WHERE  email = ?"
);
$stmt->bind_param('s',$email);
$stmt->execute();
$u = $stmt->get_result()->fetch_assoc();

if ($u && $u['contrasena'] === $contrasena) {
  echo json_encode([
    'id'             => $u['id_usuario'],
    'nombre'         => $u['nombre'],
    'rol'            => $u['rol'],
    'id_empresa'     => $u['id_empresa'],
    'id_departamento'=> $u['id_departamento']
  ]);
} else {
  http_response_code(401);
  echo json_encode(['error'=>'Credenciales incorrectas']);
}
