<?php

// Obtiene las variables de entorno definidas en Railway
$host = getenv('MYSQLHOST');
$user = getenv('MYSQLUSER');
$password = getenv('MYSQLPASSWORD');
$database = getenv('MYSQLDATABASE');
$port = getenv('MYSQLPORT');

$db = new mysqli($host, $user, $password, $database, (int)$port);
// $db = mysqli_connect('localhost', 'root', 'root', 'appsalon_mvc');
$db->set_charset("utf8");



if (!$db) {
    echo "Error: No se pudo conectar a MySQL.";
    echo "errno de depuración: " . mysqli_connect_errno();
    echo "error de depuración: " . mysqli_connect_error();
    exit;
}
