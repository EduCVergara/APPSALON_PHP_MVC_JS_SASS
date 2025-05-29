<?php

function debuguear($variable) : string {
    echo "<pre>";
    var_dump($variable);
    echo "</pre>";
    exit;
}

// Escapa / Sanitizar el HTML
function s($html) : string {
    $s = htmlspecialchars($html);
    return $s;
}

function esUltimo(string $actual, string $proximo): bool {
    if ($actual !== $proximo) {
        return true;
    }
    return false;
}

// Revisar si el usuario está autenticado
function isAuth() : void {
    if(!isset($_SESSION['login'])) {
        header('Location: /');  
    }
}

function cargarEnv($ruta = __DIR__ . '/../.env') {
    if (!file_exists($ruta)) return;

    $lineas = file($ruta, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lineas as $linea) {
        if (strpos(trim($linea), '#') === 0) continue;

        list($nombre, $valor) = explode('=', $linea, 2);
        putenv(trim($nombre) . '=' . trim($valor));
    }
}

function isAdmin() : void {
    if(!isset($_SESSION['admin'])) {
        header('Location: /');
    }
}