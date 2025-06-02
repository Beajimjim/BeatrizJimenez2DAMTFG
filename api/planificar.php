<?php
/* ────────────────────────────────────────────────────────────────
 *  api/planificar.php
 *  Genera turnos semanales enlazados a cada tarea
 *  ✅  Descuenta vacaciones y disponibilidad diaria
 * ────────────────────────────────────────────────────────────────*/
require_once 'db.php';

header('Access-Control-Allow-Origin: http://localhost:8100');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Content-Type: application/json; charset=utf-8');

$data = json_decode(file_get_contents('php://input'), true);
$idProyecto = intval($data['id_proyecto'] ?? 0);
if (!$idProyecto) {
  http_response_code(400);
  exit(json_encode(['error' => 'Falta id_proyecto']));
}

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
$mysqli = db();
$mysqli->begin_transaction();

try {

  /* ──────────────────────────────────────────────────────────────
   * 1. TAREAS pendientes del proyecto
   * ──────────────────────────────────────────────────────────────*/
  $tareas = $mysqli->query(
    "SELECT t.id_tarea, t.nombre, t.horas,
            t.fecha_inicio, t.fecha_fin,
            p.id   AS id_perfil,
            p.nombre AS perfil
       FROM tareas t
       JOIN perfiles p ON p.id = t.id_perfil
      WHERE t.id_proyecto = $idProyecto
        AND t.estado = 'pendiente'"
  )->fetch_all(MYSQLI_ASSOC);

  if (!$tareas) {
    $mysqli->commit();
    exit(json_encode(['msg' => 'No hay tareas pendientes']));
  }

  /* ──────────────────────────────────────────────────────────────
   * 2. PERSONAL de los perfiles implicados
   * ──────────────────────────────────────────────────────────────*/
  $personalRows = $mysqli->query(
    "SELECT per.id_personal, per.id_perfil,
            per.horas_max_semana, per.horas_max_dia,
            COALESCE(per.disponibilidad, JSON_OBJECT()) AS disponibilidad,
            COALESCE(per.vacaciones,     JSON_ARRAY())  AS vacaciones
       FROM personal per
      WHERE per.id_perfil IN (
             SELECT DISTINCT id_perfil
               FROM tareas
              WHERE id_proyecto = $idProyecto
            )"
  )->fetch_all(MYSQLI_ASSOC);

  /*  Mapeamos id_personal → objeto --------------------------------*/
  $personal = [];
  foreach ($personalRows as $p) {
    $personal[$p['id_personal']] = $p + [
      'cap_sem' => []   // capacidad calculada por semana ISO
    ];
  }

  /* ──────────────────────────────────────────────────────────────
   * 3. Funciones auxiliares
   * ──────────────────────────────────────────────────────────────*/
  function isoWeeksBetween(string $ini, string $fin): array {
    $d = new DateTime($ini);
    $last = new DateTime($fin);
    $weeks = [];
    while ($d <= $last) {
      $weeks[] = $d->format('o-W');
      $d->modify('+1 week');
    }
    return array_unique($weeks);
  }
  function rangeDates(string $isoWeek): array {
    [$y,$w] = explode('-', $isoWeek);
    $d = new DateTime();
    $d->setISODate((int)$y,(int)$w);
    return array_map(fn($i)=> (clone $d)->modify("+$i day")->format('Y-m-d'), range(0,6));
  }
  function isOnVacation(array $vacaciones, string $fecha): bool {
    foreach ($vacaciones as $r) {
      if ($fecha >= $r['inicio'] && $fecha <= $r['fin']) return true;
    }
    return false;
  }

  /* ──────────────────────────────────────────────────────────────
   * 4. CALCULA capacidad semanal real de cada persona
   * ──────────────────────────────────────────────────────────────*/
  $weeksProject = [];
  foreach ($tareas as $t) {
    $weeksProject = array_unique(array_merge(
      $weeksProject,
      isoWeeksBetween($t['fecha_inicio'],$t['fecha_fin'])
    ));
  }
  foreach ($personal as &$p) {
    $disp = json_decode($p['disponibilidad'], true);  // {"L":8,"M":8,...}
    $vac  = json_decode($p['vacaciones']    , true);  // [{inicio,fin},...]
    foreach ($weeksProject as $sem) {
      $cap = 0;
      foreach (rangeDates($sem) as $fecha) {
        if (isOnVacation($vac,$fecha)) continue;
        $dow = ['D','L','M','X','J','V','S'][date('w',strtotime($fecha))];
        $cap += $disp[$dow] ?? $p['horas_max_dia'];
      }
      $p['cap_sem'][$sem] = min($cap, $p['horas_max_semana']);
    }
  } unset($p);

  /* ──────────────────────────────────────────────────────────────
   * 5. ASIGNACIÓN Greedy por Tarea-Semana
   * ──────────────────────────────────────────────────────────────*/
  $turnos = [];  // a insertar
  foreach ($tareas as $t) {

    $horasRest = $t['horas'];
    $semanas   = isoWeeksBetween($t['fecha_inicio'],$t['fecha_fin']);
    $horasSem  = ceil($horasRest / count($semanas)); // reparto uniforme

    foreach ($semanas as $sem) {
      $horasPendSem = min($horasSem, $horasRest);
      $horasRest   -= $horasPendSem;

      // candidatos = personal de ese perfil con cap_sem >0
      $cand = array_filter($personal,
        fn($p)=> $p['id_perfil']==$t['id_perfil'] && ($p['cap_sem'][$sem]??0) >0);

      // ordena por más capacidad libre
      usort($cand, fn($a,$b)=> ($b['cap_sem'][$sem]??0) <=> ($a['cap_sem'][$sem]??0));

      foreach ($cand as &$per) {
        if ($horasPendSem<=0) break;
        $disp = $per['cap_sem'][$sem];
        if ($disp<=0) continue;

        $asignar = min($disp, $horasPendSem);
        $horasPendSem -= $asignar;
        $per['cap_sem'][$sem] -= $asignar;

        // fechas semana ISO
        [$year,$week] = explode('-', $sem);
        $d = new DateTime();
        $d->setISODate((int)$year,(int)$week);
        $lunes   = $d->format('Y-m-d');
        $domingo = (clone $d)->modify('+6 days')->format('Y-m-d');

        $turnos[] = [
          'id_personal'  => $per['id_personal'],
          'id_tarea'     => $t['id_tarea'],          // ←_]()_