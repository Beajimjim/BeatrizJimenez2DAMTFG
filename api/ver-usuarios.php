<?php
require_once 'db.php';
header('Content-Type: text/plain; charset=utf-8');
$res = db()->query('SELECT id_usuario, contrasena, email FROM usuarios');
while ($row = $res->fetch_assoc()) {
    echo "{$row['id_usuario']}  {$row['contrasena']}  {$row['email']}\n";
}
