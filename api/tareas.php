<?php
/******************************************************************************
 *  END-POINT  «tareas.php»
 *  --------------------------------------------------------------------------
 *  CRUD de tareas + asignación de usuario con validaciones de solapamiento y
 *  vacaciones.  Reordenado para impedir borrados accidentales cuando el front
 *  envía un JSON incompleto.
 ******************************************************************************/

require_once 'db.php';

/* ─────────────────────── CORS + JSON ─────────────────────── */
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: http://localhost:8100');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; }

/* ───────────── leer cuerpo (puede venir vacío) ───────────── */
$raw  = file_get_contents('php://input');
$data = $raw ? json_decode($raw, true) : [];

file_put_contents(
    'php://stderr',
    "[tareas.php][" . date('H:i:s') . "] " . json_encode($data) . PHP_EOL
);

/* ===========================================================
   1)  PUT  /tareas.php?incurrido=ID  → acumular horas
   =========================================================== */
if ($_SERVER['REQUEST_METHOD'] === 'PUT' && isset($_GET['incurrido'])) {

    $id   = intval($_GET['incurrido']);
    $body = $data;

    if (!isset($body['horas_incurridas']) || !isset($body['estado'])) {
        http_response_code(400);
        exit(json_encode(['error' => 'Faltan campos requeridos']));
    }

    $horas  = intval($body['horas_incurridas']);
    $estado = $body['estado'];

    /* horas actuales */
    $sel = db()->prepare("SELECT horas_incurridas FROM tareas WHERE id=?");
    $sel->bind_param('i', $id);
    $sel->execute();
    $horasActuales = intval(($sel->get_result()->fetch_assoc())['horas_incurridas'] ?? 0);

    $total = $horasActuales + $horas;

    $upd = db()->prepare("UPDATE tareas SET horas_incurridas=?, estado=? WHERE id=?");
    $upd->bind_param('isi', $total, $estado, $id);
    $ok = $upd->execute();

    exit(json_encode(['ok' => $ok]));
}

/* ===========================================================
   2)  POST  {id_tarea, id_usuario}  → asignar usuario
   -----------------------------------------------------------
   * Sólo se ejecuta cuando llegan **exactamente** esas dos
     claves y `id_usuario` NO es null.
   =========================================================== */
if (
    isset($data['id_tarea']) &&
    isset($data['id_usuario']) &&
    $data['id_usuario'] !== null &&
    count($data) === 2               // evita confundir con update completo
) {
    $idT = intval($data['id_tarea']);
    $idU = intval($data['id_usuario']);

    if ($idU === 0) {
        http_response_code(400);
        exit(json_encode(['error' => 'Falta id_usuario válido']));
    }

    /* 2A. Fechas de la tarea */
    $st1 = db()->prepare("SELECT fecha_inicio, fecha_fin FROM tareas WHERE id=?");
    $st1->bind_param('i', $idT);
    $st1->execute();
    $tarea = $st1->get_result()->fetch_assoc();
    if (!$tarea) {
        http_response_code(404);
        exit(json_encode(['error' => 'Tarea no encontrada']));
    }
    $fi = $tarea['fecha_inicio'];
    $ff = $tarea['fecha_fin'];

    /* 2B. Solape con otras tareas */
    $st2 = db()->prepare("
        SELECT COUNT(*) AS cnt
          FROM tareas
         WHERE id_usuario = ?
           AND id         <> ?
           AND estado    IN ('pendiente','en curso')
           AND NOT (fecha_fin < ? OR fecha_inicio > ?)
    ");
    $st2->bind_param('iiss', $idU, $idT, $fi, $ff);
    $st2->execute();
    if ($st2->get_result()->fetch_assoc()['cnt'] > 0) {
        http_response_code(400);
        exit(json_encode(['error' => 'El usuario ya tiene otra tarea solapada']));
    }

    /* 2C. Solape con vacaciones */
    $st3 = db()->prepare("SELECT vacaciones FROM personal WHERE id_usuario=?");
    $st3->bind_param('i', $idU);
    $st3->execute();
    $vacJson = $st3->get_result()->fetch_assoc()['vacaciones'] ?? '[]';
    foreach (json_decode($vacJson, true) as $r) {
        if (!($ff < $r['inicio'] || $fi > $r['fin'])) {
            http_response_code(400);
            exit(json_encode([
                'error' => "El usuario está de vacaciones {$r['inicio']} → {$r['fin']}"
            ]));
        }
    }

    /* 2D. Asignar */
    $st4 = db()->prepare("UPDATE tareas SET id_usuario=? WHERE id=?");
    $st4->bind_param('ii', $idU, $idT);
    if ($st4->execute()) {
        exit(json_encode(['ok' => true, 'id_tarea' => $idT, 'id_usuario' => $idU]));
    }

    http_response_code(500);
    exit(json_encode(['error' => 'No se pudo asignar la tarea']));
}

/* ===========================================================
   3)  POST  {id_tarea, delete:true}  → eliminar
   =========================================================== */
if (isset($data['id_tarea'], $data['delete']) && $data['delete'] === true) {

    $id = intval($data['id_tarea']);
    if ($id === 0) {
        http_response_code(400);
        exit(json_encode(['error' => 'id_tarea inválido']));
    }

    $del = db()->prepare("DELETE FROM tareas WHERE id=?");
    $del->bind_param('i', $id);
    if ($del->execute()) {
        exit(json_encode(['deleted' => $id]));
    }

    http_response_code(500);
    exit(json_encode(['error' => 'No se pudo eliminar la tarea']));
}

/* ===========================================================
   4)  POST  (update completo)
   =========================================================== */
if (isset($data['id_tarea'], $data['id_proyecto'], $data['nombre'])) {

    /* valida obligatorios */
    foreach (['id_tarea','id_proyecto','nombre','fecha_inicio','fecha_fin','horas','estado'] as $c) {
        if (!isset($data[$c]) || $data[$c] === '') {
            http_response_code(400);
            exit(json_encode(['error' => "Falta campo obligatorio: $c"]));
        }
    }

    $id_tarea     = intval($data['id_tarea']);
    $id_proyecto  = intval($data['id_proyecto']);
    $id_usuario   = isset($data['id_usuario']) ? intval($data['id_usuario']) : null;
    $nombre       = $data['nombre'];
    $descripcion  = $data['descripcion']     ?? null;
    $fecha_inicio = $data['fecha_inicio'];
    $fecha_fin    = $data['fecha_fin'];
    $horas        = intval($data['horas']);
    $estado       = $data['estado'];
    $id_perfil    = isset($data['id_perfil']) ? intval($data['id_perfil']) : null;
    $dependencias = $data['dependencia_ids']  ?? null;

    $upd = db()->prepare("
        UPDATE tareas
           SET id_proyecto    = ?,
               id_usuario     = ?,
               nombre         = ?,
               descripcion    = ?,
               fecha_inicio   = ?,
               fecha_fin      = ?,
               horas          = ?,
               estado         = ?,
               id_perfil      = ?,
               dependencia_ids= ?
         WHERE id = ?
    ");
    $upd->bind_param(
        'iissssissii',
        $id_proyecto,
        $id_usuario,
        $nombre,
        $descripcion,
        $fecha_inicio,
        $fecha_fin,
        $horas,
        $estado,
        $id_perfil,
        $dependencias,
        $id_tarea
    );

    if ($upd->execute()) {
        exit(json_encode(['ok' => true, 'updated' => $id_tarea]));
    }

    http_response_code(500);
    exit(json_encode(['error' => 'No se pudo actualizar la tarea']));
}

/* ===========================================================
   5)  POST  (insert)  crear tarea
   =========================================================== */
if (isset($data['id_proyecto'], $data['nombre'])) {

    foreach (['id_proyecto','nombre','fecha_inicio','fecha_fin','horas','estado'] as $c) {
        if (!isset($data[$c]) && $data[$c] !== '0') {
            http_response_code(400);
            exit(json_encode(['error' => "Falta campo obligatorio: $c"]));
        }
    }

    $id_proyecto   = intval($data['id_proyecto']);
    $id_usuario    = isset($data['id_usuario']) ? intval($data['id_usuario']) : null;
    $nombre        = $data['nombre'];
    $descripcion   = $data['descripcion']    ?? null;
    $fecha_inicio  = $data['fecha_inicio'];
    $fecha_fin     = $data['fecha_fin'];
    $horas         = intval($data['horas']);
    $estado        = $data['estado'];
    $id_perfil     = isset($data['id_perfil']) ? intval($data['id_perfil']) : null;
    $dependencias  = $data['dependencia_ids'] ?? null;

    $ins = db()->prepare("
        INSERT INTO tareas
              (id_proyecto,id_usuario,nombre,descripcion,fecha_inicio,fecha_fin,
               horas,estado,id_perfil,dependencia_ids)
        VALUES (?,?,?,?,?,?,?,?,?,?)
    ");
    $ins->bind_param(
        'iissssisis',
        $id_proyecto,
        $id_usuario,
        $nombre,
        $descripcion,
        $fecha_inicio,
        $fecha_fin,
        $horas,
        $estado,
        $id_perfil,
        $dependencias
    );

    if ($ins->execute()) {
        exit(json_encode(['ok' => true, 'id_tarea' => $ins->insert_id]));
    }

    http_response_code(500);
    exit(json_encode(['error' => 'No se pudo insertar la tarea']));
}

/* ===========================================================
   6)  POST  {id_proyecto}  → listar tareas
   =========================================================== */
if (isset($data['id_proyecto'])) {

    $idP = intval($data['id_proyecto']);
    if ($idP <= 0) {
        http_response_code(400);
        exit(json_encode(['error' => 'id_proyecto inválido']));
    }

    $sel = db()->prepare("
        SELECT t.id, t.nombre, t.descripcion, t.fecha_inicio, t.fecha_fin,
               t.horas, t.horas_incurridas, t.estado, t.id_usuario,
               t.id_proyecto, t.id_perfil, t.dependencia_ids,
               u.nombre AS nombre_usuario,
               p.nombre AS nombre_perfil
          FROM tareas t
     LEFT JOIN usuarios u ON t.id_usuario = u.id_usuario
     LEFT JOIN perfiles p ON t.id_perfil  = p.id
         WHERE t.id_proyecto = ?
    ");
    $sel->bind_param('i', $idP);
    $sel->execute();

    exit(json_encode($sel->get_result()->fetch_all(MYSQLI_ASSOC)));
}

/* ─── fallback ─────────────────────────────────────────────── */
http_response_code(400);
echo json_encode(['error' => 'Solicitud no válida']);
