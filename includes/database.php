<?php

// Obtiene las variables de entorno definidas en Railway
$host = getenv('MYSQLHOST');
$user = getenv('MYSQLUSER');
$password = getenv('MYSQLPASSWORD');
$database = getenv('MYSQLDATABASE');
$port = getenv('MYSQLPORT');

if(getenv('RAILWAY_ENVIRONMENT') || getenv('MYSQLHOST')) {
    // Entorno Railway
    $db = new mysqli($host, $user, $password, $database, (int)$port);
} else {
    // Entorno local
    $db = new mysqli(
        $_ENV['DB_HOST'], 
        $_ENV['DB_USER'], 
        $_ENV['DB_PASS'], 
        $_ENV['DB_NAME'],
        (int) $_ENV['DB_PORT']
    );
}
$db->set_charset("utf8");

if (!$db) {
    echo "Error: No se pudo conectar a MySQL.";
    echo "error de depuración: " . mysqli_connect_errno();
    echo "error de depuración: " . mysqli_connect_error();
    exit;
}
