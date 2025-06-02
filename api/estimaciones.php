<?php
/* ========================================================================
 *  estimaciones.php – CRUD mínimo de estimaciones de recursos
 * ===================================================================== */
require_once 'db.php';

/* ---- CORS / encabezados ------------------------------------------------ */
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: http://localhost:8100');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: POST, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; }

/* ---- Cuerpo JSON ------------------------------------------------------- */
$body = file_get_contents('php://input');
$data = json_decode($body, true);

file_put_contents('php://stderr', "estimaciones.php – payload: $body\n");

if (!is_array($data)) {
  http_response_code(400);
  exit(json_encode(['error' => 'JSON vacío o malformado']));
}

/* ========================================================================
 *  RAMA 1 · LISTAR histórico por proyecto
 *    { id_proyecto : 99 }
 * ===================================================================== */
if (isset($data['id_proyecto']) && count($data) === 1) {
    $idProyecto = intval($data['id_proyecto']);
    if (!$idProyecto) {
      http_response_code(400);
      exit(json_encode(['error' => 'Falta id_proyecto']));
    }
  
    $st = db()->prepare(
      "SELECT id_estimacion,
              fecha_generada,
              total_horas,
              coste_total,
              resumen_json,        -- ①  añade estas dos columnas
              calendario_json      -- ②
         FROM estimaciones
        WHERE id_proyecto = ?
        ORDER BY fecha_generada DESC"
    );
    $st->bind_param('i', $idProyecto);
    $st->execute();
  
    $rows = $st->get_result()->fetch_all(MYSQLI_ASSOC);
    echo json_encode($rows);
    exit;
  }

/* ========================================================================
 *  RAMA 2 · ELIMINAR una estimación
 *    { id_estimacion : 123 }
 * ===================================================================== */
if (isset($data['id_estimacion']) && count($data) === 1) {
  $id = intval($data['id_estimacion']);
  if (!$id) {
    http_response_code(400);
    exit(json_encode(['error' => 'Falta id_estimacion']));
  }

  $del = db()->prepare("DELETE FROM estimaciones WHERE id_estimacion = ?");
  $del->bind_param('i', $id);
  $del->execute();

  echo json_encode(['deleted' => $id]);
  exit;
}

/* ========================================================================
 *  RAMA 3 · CREAR nueva estimación
 * ===================================================================== */
$required = ['id_proyecto','total_horas','coste_total','resumen_json','calendario_json'];
foreach ($required as $f) {
  if (!array_key_exists($f, $data)) {
    http_response_code(400);
    exit(json_encode(['error' => "Falta $f"]));
  }
}

$idProyecto   = intval($data['id_proyecto']);
$totalHoras   = intval($data['total_horas']);
$costeTotal   = (float)$data['coste_total'];
$resumenJson  = json_encode($data['resumen_json'],  JSON_UNESCAPED_UNICODE);
$calendario   = json_encode($data['calendario_json'],JSON_UNESCAPED_UNICODE);

$ins = db()->prepare(
  "INSERT INTO estimaciones
     (id_proyecto,total_horas,coste_total,resumen_json,calendario_json)
   VALUES (?,?,?,?,?)"
);
$ins->bind_param('iiiss', $idProyecto, $totalHoras, $costeTotal, $resumenJson, $calendario);
$ins->execute();

echo json_encode([
  'inserted'       => 1,
  'id_estimacion'  => $ins->insert_id,
  'fecha_generada' => date('Y-m-d H:i:s')
]);
