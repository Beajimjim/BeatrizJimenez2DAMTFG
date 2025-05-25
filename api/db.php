<?php

//(conexión única)


function db() : mysqli {
  static $conn;
  if ($conn === null) {
    $conn = new mysqli('localhost', 'root', '', 'smart3z_db');
    if ($conn->connect_error) {
      http_response_code(500);
      exit(json_encode(['error' => $conn->connect_error]));
    }
  }
  return $conn;
}
