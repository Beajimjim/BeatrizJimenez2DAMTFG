<?php
/* ========================================================== 
   ENDPOINT: Listado de Perfiles Profesionales ― Smart3Z
   Archivo  : perfiles.php
   Ruta     : /api/perfiles.php
   Descripción:
   - Devuelve la lista de perfiles disponibles en la base de datos.
   - Cada perfil incluye información como tarifas y disponibilidad.
   - Utiliza método GET (o preflight OPTIONS).
   ========================================================== */

require_once 'db.php'; // Conexión a base de datos

// Configuración de cabeceras HTTP
header('Access-Control-Allow-Origin: http://localhost:8100');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Content-Type: application/json; charset=utf-8');

// Manejo de solicitud preflight (CORS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(204);
  exit;
}

/**
 * 1. Consulta a la base de datos
 * --------------------------------------------------------
 * Se seleccionan todos los perfiles disponibles con sus propiedades:
 * - tarifa estándar
 * - tarifa de horas extra
 * - si permiten horas extra
 * - disponibilidad en horas semanales
 */
$stmt = db()->prepare("
  SELECT id, nombre, tarifa, tarifa_extra, horas_extra, disponibilidad
  FROM perfiles
");
$stmt->execute();
$resultado = $stmt->get_result();

/**
 * 2. Construcción de la respuesta
 * --------------------------------------------------------
 * Se transforma cada fila en un array tipado y se devuelve como JSON.
 */
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

// 3. Envío de la respuesta JSON
echo json_encode($perfiles);
