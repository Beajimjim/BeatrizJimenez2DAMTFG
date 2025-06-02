<?php
/* ========================================================== 
   ENDPOINT: Listado de Personal (completo) ― Smart3Z
   Archivo  : personal.php
   Ruta     : /api/personal.php
   Descripción:
   - Devuelve el listado completo del personal registrado.
   - Incluye nombre del usuario, perfil, límites horarios, 
     disponibilidad semanal y períodos de vacaciones.
   - Utiliza JOIN para asociar usuarios con personal.
   ========================================================== */

require_once 'db.php'; // Conexión única a la base de datos

// Configuración de cabeceras HTTP
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: http://localhost:8100');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: GET, OPTIONS');

// Manejo de solicitud preflight (CORS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  exit;
}

// 1. Obtención de conexión activa
$mysqli = db();

/**
 * 2. Consulta preparada
 * --------------------------------------------------------
 * Se usa LEFT JOIN para combinar la tabla de `personal` con `usuarios`
 * con el objetivo de mostrar el nombre del usuario asociado, si lo tiene.
 */
$stmt = $mysqli->prepare("
  SELECT
    per.id_personal,
    per.id_usuario,
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
  echo json_encode(['error' => 'Error al preparar consulta']);
  exit;
}

// 3. Ejecución y recolección de resultados
$stmt->execute();
$res = $stmt->get_result();
$rows = $res->fetch_all(MYSQLI_ASSOC);

// 4. Devolución del resultado como JSON
echo json_encode($rows);
exit;
