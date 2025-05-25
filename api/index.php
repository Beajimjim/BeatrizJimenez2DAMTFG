<?php

// (router muy simple)


header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
if ($_SERVER['REQUEST_METHOD']==='OPTIONS') { exit; }

$uri   = explode('/', trim($_SERVER['REQUEST_URI'],'/'));
$entry = $uri[1] ?? '';          // ej. /api/usuarios … => "usuarios"

switch ($entry) {
  case 'empresas':      require 'empresas.php';      break;
  case 'departamentos': require 'departamentos.php'; break;
  case 'usuarios':      require 'usuarios.php';      break;
  case 'proyectos':     require 'proyectos.php';     break;
  case 'asignaciones':  require 'asignaciones.php';  break;
  default: http_response_code(404); echo json_encode(['error'=>'No route']);
}


