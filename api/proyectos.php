<?php
require_once 'db.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: http://localhost:8100');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: POST, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; }

$data = json_decode(file_get_contents('php://input'), true);
file_put_contents('php://stderr', "Data recibida: " . json_encode($data) . PHP_EOL);
if (!is_array($data))           { http_response_code(400); exit(json_encode(['error'=>'JSON vacío'])); }


/* --------------------------------------------------------------------------
 *  RAMA 1 · LISTAR PROYECTOS VISIBLES PARA UN USUARIO
 * ------------------------------------------------------------------------*/
if (isset($data['id_usuario'])) {

  $idUsuario = intval($data['id_usuario']);
  if (!$idUsuario) {
    http_response_code(400);
    exit(json_encode(['error' => 'Falta id_usuario']));
  }

  /* 1 ▸ rol, empresa y dpto del usuario ----------------------------------- */
  $u = db()->prepare(
    "SELECT rol, id_empresa, id_departamento
       FROM usuarios
      WHERE id_usuario = ?"
  );
  $u->bind_param('i', $idUsuario);
  $u->execute();
  $usr = $u->get_result()->fetch_assoc();

  if (!$usr) {
    http_response_code(404);
    exit(json_encode(['error' => 'Usuario no existe']));
  }

  /* 2 ▸ consulta dinámica según rol --------------------------------------- */
  $sql = "
    SELECT  p.id_proyecto,
            p.nombre,
            p.descripcion,
            p.fecha_inicio,
            p.fecha_fin,
            p.estado,
            d.nombre  AS departamento,
            u.nombre  AS jefe
      FROM  proyectos      p
      JOIN  departamentos  d ON d.id_departamento = p.id_departamento
      JOIN  usuarios       u ON u.id_usuario      = p.id_jefe_pm
     WHERE  d.id_empresa   = ?";                // todos filtran por empresa

  $params = [$usr['id_empresa']];
  $types  = 'i';

  /* PM → añadir filtro por su departamento -------------------------------- */
  if ($usr['rol'] === 'PM') {
    $sql      .= " AND p.id_departamento = ?";
    $params[]  = $usr['id_departamento'];
    $types    .= 'i';
  }

  /* EMP → sólo proyectos donde tiene TAREAS asignadas --------------------- */
  if ($usr['rol'] === 'EMP') {
    $sql .= " AND EXISTS (
                SELECT 1
                  FROM tareas t
                 WHERE t.id_proyecto = p.id_proyecto
                   AND t.id_usuario  = ?
              )";
    $params[]  = $idUsuario;
    $types    .= 'i';
  }

  /* 3 ▸ ejecutar ---------------------------------------------------------- */
  $st = db()->prepare($sql);
  $st->bind_param($types, ...$params);
  $st->execute();
  $rows = $st->get_result()->fetch_all(MYSQLI_ASSOC);

  echo json_encode($rows);
  exit;
}

/* --------------------------------------------------------------------------
 *  RAMA · DETALLE DE UN PROYECTO
 * ------------------------------------------------------------------------*/
if (isset($data['id_proyecto']) && isset($data['detalle'])) {
  $id = $data['id_proyecto'];  // ✅ Esto sí extrae correctamente del JSON

  if (!$id) {
    http_response_code(400);
    echo json_encode(['error' => 'id_proyecto requerido']);
    exit;
  }

  $st = db()->prepare(
    "SELECT  p.*,
             d.nombre AS departamento,
             u.nombre AS jefe
       FROM  proyectos      p
       JOIN  departamentos  d ON d.id_departamento = p.id_departamento
       JOIN  usuarios       u ON u.id_usuario      = p.id_jefe_pm
      WHERE  p.id_proyecto  = ?"
  );
  $st->bind_param('i', $id);
  $st->execute();
  $fila = $st->get_result()->fetch_assoc();

  echo json_encode($fila ?: []);
  exit;
}

/* --------------------------------------------------------------------------
 *  RAMA 2 · CREAR NUEVO PROYECTO
 * ------------------------------------------------------------------------*/

if (isset($data['id_proyecto']) && count($data) === 1) {
  $id = intval($data['id_proyecto']);
  if (!$id) { http_response_code(400); exit(json_encode(['error'=>'Falta id_proyecto'])); }

  $del = db()->prepare("DELETE FROM proyectos WHERE id_proyecto = ?");
  $del->bind_param('i', $id);
  $del->execute();

  echo json_encode(['deleted'=> $id]);
  exit;
}
/* --------------------------------------------------------------------------
 *  RAMA 3 · CREAR NUEVO PROYECTO
 * ------------------------------------------------------------------------*/
$required = ['nombre','id_jefe_pm','id_departamento','fecha_inicio','fecha_fin','estado'];
foreach ($required as $f) {
  if (empty($data[$f]) && $data[$f] !== '0') {
      http_response_code(400);
      exit(json_encode(['error'=>"Falta $f"]));
  }
}

$descripcion = $data['descripcion'] ?? null;

$ins = db()->prepare(
  "INSERT INTO proyectos
     (id_departamento,id_jefe_pm,nombre,descripcion,fecha_inicio,fecha_fin,estado)
   VALUES (?,?,?,?,?,?,?)"
);
$ins->bind_param(
  'iisssss',
  $data['id_departamento'],
  $data['id_jefe_pm'],
  $data['nombre'],
  $descripcion,
  $data['fecha_inicio'],
  $data['fecha_fin'],
  $data['estado']
);
$ins->execute();

echo json_encode([
  'id_proyecto'     => $ins->insert_id,
  'nombre'          => $data['nombre'],
  'descripcion'     => $descripcion,
  'id_jefe_pm'      => $data['id_jefe_pm'],
  'id_departamento' => $data['id_departamento'],
  'fecha_inicio'    => $data['fecha_inicio'],
  'fecha_fin'       => $data['fecha_fin'],
  'estado'          => $data['estado']
]);



/* --------------------------------------------------------------------------
 *  RAMA 4 · LISTAR TAREAS POR PROYECTO
 * ------------------------------------------------------------------------*/
if (isset($data['id_proyecto']) && !isset($data['detalle'])) {
  $idProyecto = intval($data['id_proyecto']);
  if (!$idProyecto) {
    http_response_code(400);
    exit(json_encode(['error' => 'Falta id_proyecto']));
  }

  $st = db()->prepare(
    "SELECT  t.id,
             t.nombre,
             t.descripcion,
             t.fecha_inicio,
             t.fecha_fin,
             t.horas,
             t.estado,
             t.id_usuario,
             u.nombre AS nombre_usuario
       FROM  tareas t
  LEFT JOIN  usuarios u ON u.id_usuario = t.id_usuario
      WHERE  t.id_proyecto = ?
      ORDER BY t.fecha_inicio ASC"
  );
  $st->bind_param('i', $idProyecto);
  $st->execute();
  $tareas = $st->get_result()->fetch_all(MYSQLI_ASSOC);

  echo json_encode($tareas);
  exit;
}
