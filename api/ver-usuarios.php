<?php
/* ==========================================================
   API «LISTADO SIMPLE DE USUARIOS» ― Smart3Z
   Ruta     : api/listar_usuarios_simple.php
   Descripción:
   - Devuelve un listado básico de usuarios en texto plano.
   - Muestra: id_usuario, contraseña (hash) y email.
   - Solo para uso interno o debug (no debe estar expuesto en producción).
   ========================================================== */

require_once 'db.php';  // Se incluye el archivo de conexión única a la base de datos

// -------------------- Encabezado de respuesta --------------------
// Se define que la salida será texto plano (no HTML ni JSON)
header('Content-Type: text/plain; charset=utf-8');

// -------------------- Consulta a la base de datos --------------------
// Se seleccionan los campos necesarios de todos los usuarios
$res = db()->query('SELECT id_usuario, contrasena, email FROM usuarios');

// -------------------- Recorrido de resultados --------------------
// Se imprime cada fila con id, contraseña y email en una línea
while ($row = $res->fetch_assoc()) {
    echo "{$row['id_usuario']}  {$row['contrasena']}  {$row['email']}\n";
}
