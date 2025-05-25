<?php
require_once 'db.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: http://localhost:8100');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; }

$data = json_decode(file_get_contents('php://input'), true);
file_put_contents('php://stderr', "Data recibida: " . json_encode($data) . PHP_EOL);

/* --------------------------------------------------------------------------
 * ELIMINAR TAREA POR ID
 * ------------------------------------------------------------------------*/
if (isset($data['id_tarea']) && count($data) === 1) {
  $id = intval($data['id_tarea']);
  if (!$id) {
    http_response_code(400);
    echo json_encode(['error' => 'Falta id_tarea']);
    exit;
  }

  $del = db()->prepare("DELETE FROM tareas WHERE id = ?");
  $del->bind_param('i', $id);
  if ($del->execute()) {
    echo json_encode(['deleted' => $id]);
  } else {
    http_response_code(500);
    echo json_encode(['error' => 'No se pudo eliminar la tarea']);
  }
  exit;
}

/* --------------------------------------------------------------------------
 * ACTUALIZAR TAREA EXISTENTE
 * ------------------------------------------------------------------------*/
if (isset($data['id_tarea']) && isset($data['id_proyecto']) && isset($data['nombre'])) {
    $camposObligatorios = ['id_tarea', 'id_proyecto', 'nombre', 'fecha_inicio', 'fecha_fin', 'horas', 'estado'];
    foreach ($camposObligatorios as $campo) {
      if (!isset($data[$campo]) || ($data[$campo] === '')) {
        http_response_code(400);
        echo json_encode(['error' => "Falta campo obligatorio: $campo"]);
        exit;
      }
    }
  
    $id_tarea         = intval($data['id_tarea']);
    $id_proyecto      = intval($data['id_proyecto']);
    $id_usuario       = isset($data['id_usuario']) ? intval($data['id_usuario']) : null;
    $nombre           = $data['nombre'];
    $descripcion      = $data['descripcion'] ?? null;
    $fecha_inicio     = $data['fecha_inicio'];
    $fecha_fin        = $data['fecha_fin'];
    $horas            = intval($data['horas']);
    $estado           = $data['estado'];
    $id_perfil        = isset($data['id_perfil']) ? intval($data['id_perfil']) : null;
    $dependencia_ids  = $data['dependencia_ids'] ?? null;
  
    $st = db()->prepare(
      "UPDATE tareas
       SET id_proyecto = ?, id_usuario = ?, nombre = ?, descripcion = ?,
           fecha_inicio = ?, fecha_fin = ?, horas = ?, estado = ?, id_perfil = ?, dependencia_ids = ?
       WHERE id = ?"
    );
  
    $st->bind_param(
      'iissssisisi',
      $id_proyecto,
      $id_usuario,
      $nombre,
      $descripcion,
      $fecha_inicio,
      $fecha_fin,
      $horas,
      $estado,
      $id_perfil,
      $dependencia_ids,
      $id_tarea
    );
  
    if ($st->execute()) {
      echo json_encode(['ok' => true, 'updated' => $id_tarea]);
    } else {
      http_response_code(500);
      echo json_encode(['error' => 'No se pudo actualizar la tarea']);
    }
  
    exit;
  }

   /* =========================================================================
 * ACTUALIZAR horas incurridas y estado
 * ========================================================================= */
if ($_SERVER['REQUEST_METHOD'] === 'PUT' && isset($_GET['incurrido'])) {
  $id = intval($_GET['incurrido']);
  $data = json_decode(file_get_contents('php://input'), true);

  if (!isset($data['horas_incurridas']) || !isset($data['estado'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Faltan campos requeridos']);
    exit;
  }

  $horas = intval($data['horas_incurridas']);
  $estado = $data['estado'];

  // Leer horas actuales
  $sel = db()->prepare("SELECT horas_incurridas FROM tareas WHERE id = ?");
  $sel->bind_param('i', $id);
  $sel->execute();
  $res = $sel->get_result()->fetch_assoc();
  $horasActuales = intval($res['horas_incurridas'] ?? 0);

  // Sumar nuevas
  $horasTotales = $horasActuales + $horas;

  $query = "UPDATE tareas SET horas_incurridas = ?, estado = ? WHERE id = ?";
  $stmt = db()->prepare($query);
  $stmt->bind_param('isi', $horasTotales, $estado, $id);
  $ok = $stmt->execute();

  echo json_encode(['ok' => $ok]);
  exit;
}
  
  /* =========================================================================
 * ASIGNAR tarea → usuario, validando solapamientos y vacaciones
 * ========================================================================= */
if (
  isset($data['id_tarea']) &&
  array_key_exists('id_usuario', $data) &&
  count($data) === 2
) {
  $idT = intval($data['id_tarea']);
  $idU = intval($data['id_usuario']);

  // 1) Leemos fechas de la tarea a asignar
  $st1 = db()->prepare("
    SELECT fecha_inicio, fecha_fin 
      FROM tareas 
     WHERE id = ?
  ");
  $st1->bind_param('i', $idT);
  $st1->execute();
  $tarea = $st1->get_result()->fetch_assoc();
  if (!$tarea) {
    http_response_code(404);
    exit(json_encode(['error'=>'Tarea no encontrada']));
  }
  $fi = $tarea['fecha_inicio'];
  $ff = $tarea['fecha_fin'];

  // 2) Validar solapamiento con otras tareas del usuario
  $st2 = db()->prepare("
    SELECT COUNT(*) AS cnt
      FROM tareas
     WHERE id_usuario = ?
       AND id         <> ?
       AND estado    IN ('pendiente','en curso')
       AND NOT (fecha_fin  < ?     OR fecha_inicio > ?)
  ");
  $st2->bind_param('iiss', $idU, $idT, $fi, $ff);
  $st2->execute();
  $cnt = $st2->get_result()->fetch_assoc()['cnt'];
  if ($cnt > 0) {
    http_response_code(400);
    exit(json_encode([
      'error' => 'El usuario ya tiene otra tarea solapada en estas fechas'
    ]));
  }

  // 3) Validar solapamiento con vacaciones del personal
  $st3 = db()->prepare("
    SELECT vacaciones
      FROM personal
     WHERE id_usuario = ?
  ");
  $st3->bind_param('i', $idU);
  $st3->execute();
  $vacJson = $st3->get_result()->fetch_assoc()['vacaciones'] ?? '[]';
  $vacaciones = json_decode($vacJson, true);
  foreach ($vacaciones as $r) {
    if (!($ff < $r['inicio'] || $fi > $r['fin'])) {
      http_response_code(400);
      exit(json_encode([
        'error' => "El usuario está de vacaciones entre {$r['inicio']} y {$r['fin']}"
      ]));
    }
  }

  // 4) Todo ok → actualizamos la tarea
  $st4 = db()->prepare("
    UPDATE tareas
       SET id_usuario = ?
     WHERE id = ?
  ");
  $st4->bind_param('ii', $idU, $idT);
  if ($st4->execute()) {
    echo json_encode([
      'ok'         => true,
      'id_tarea'   => $idT,
      'id_usuario' => $idU
    ]);
  } else {
    http_response_code(500);
    echo json_encode(['error'=>'No se pudo asignar la tarea']);
  }
  exit;
}

/* --------------------------------------------------------------------------
 * CREAR NUEVA TAREA
 * ------------------------------------------------------------------------*/
if (isset($data['id_proyecto']) && isset($data['nombre'])) {
    $camposObligatorios = ['id_proyecto', 'nombre', 'fecha_inicio', 'fecha_fin', 'horas', 'estado'];
    foreach ($camposObligatorios as $campo) {
      if (empty($data[$campo]) && $data[$campo] !== '0') {
        http_response_code(400);
        echo json_encode(['error' => "Falta campo obligatorio: $campo"]);
        exit;
      }
    }
  
    $id_proyecto      = intval($data['id_proyecto']);
    $id_usuario       = isset($data['id_usuario']) ? intval($data['id_usuario']) : null;
    $nombre           = $data['nombre'];
    $descripcion      = $data['descripcion'] ?? null;
    $fecha_inicio     = $data['fecha_inicio'];
    $fecha_fin        = $data['fecha_fin'];
    $horas            = intval($data['horas']);
    $estado           = $data['estado'];
    $id_perfil        = isset($data['id_perfil']) ? intval($data['id_perfil']) : null;
    $dependencia_ids  = $data['dependencia_ids'] ?? null;
  
    $st = db()->prepare(
      "INSERT INTO tareas
       (id_proyecto, id_usuario, nombre, descripcion, fecha_inicio, fecha_fin, horas, estado, id_perfil, dependencia_ids)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    );
  
    $st->bind_param(
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
      $dependencia_ids
    );
  
    if ($st->execute()) {
      echo json_encode(['ok' => true, 'id_tarea' => $st->insert_id]);
    } else {
      http_response_code(500);
      echo json_encode(['error' => 'No se pudo insertar la tarea']);
    }
  
    exit;
  }
  
/* --------------------------------------------------------------------------
 * LISTAR TAREAS POR PROYECTO
 * ------------------------------------------------------------------------*/
if (isset($data['id_proyecto'])) {
  $idProyecto = intval($data['id_proyecto']);
  if ($idProyecto <= 0) {
    http_response_code(400);
    echo json_encode(['error' => 'id_proyecto inválido']);
    exit;
  }

  $stmt = db()->prepare("
  SELECT 
    t.id, 
    t.nombre, 
    t.descripcion, 
    t.fecha_inicio, 
    t.fecha_fin, 
    t.horas,
    t.horas_incurridas, 
    t.estado, 
    t.id_usuario, 
    t.id_proyecto,
    t.id_perfil,
    t.dependencia_ids,  -- 👈 AÑADE ESTA LÍNEA
    u.nombre AS nombre_usuario,
    p.nombre AS nombre_perfil
  FROM tareas t
  LEFT JOIN usuarios u ON t.id_usuario = u.id_usuario
  LEFT JOIN perfiles p ON t.id_perfil = p.id
  WHERE t.id_proyecto = ?
");

  $stmt->bind_param('i', $idProyecto);
  $stmt->execute();
  $resultado = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

  echo json_encode($resultado);
  exit;
}

// Si ninguna condición se cumple
http_response_code(400);
echo json_encode(['error' => 'Solicitud no válida']);
exit;
