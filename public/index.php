<?php 

require_once __DIR__ . '/../includes/app.php';
require_once __DIR__ . '/../includes/funciones.php';
cargarEnv();

use Controllers\LoginController;
use Controllers\CitaController;
use Controllers\APIController;
use Controllers\AdminController;
use Controllers\ServicioController;
use MVC\Router;

$router = new Router();

// Iniciar Sesión y Cerrar Sesión
$router->get('/', [LoginController::class, 'login']);
$router->post('/', [LoginController::class, 'login']);
$router->get('/logout', [LoginController::class, 'logout']);

// Recuperación de Password
$router->get('/olvido', [LoginController::class, 'olvido']);
$router->post('/olvido', [LoginController::class, 'olvido']);
$router->get('/recuperar', [LoginController::class, 'recuperar']);  
$router->post('/recuperar', [LoginController::class, 'recuperar']);

// Crear Cuenta
$router->get('/crear-cuenta', [LoginController::class, 'crear']);
$router->post('/crear-cuenta', [LoginController::class, 'crear']);

// Confirmación de cuenta
$router->get('/confirmar-cuenta', [LoginController::class, 'confirmar']);
$router->get('/mensaje', [LoginController::class, 'mensaje']);

// Área privada
$router->get('/cita', [CitaController::class, 'index']);
$router->get('/admin', [AdminController::class, 'index']);

// API de Citas
$router->get('/api/servicios', [APIController::class, 'index']);
$router->post('/api/citas', [APIController::class, 'guardar']);
$router->post('/api/eliminar', [APIController::class, 'eliminar']);

// CRUD Servicios
$router->get('/servicios', [ServicioController::class, 'index']);
$router->get('/servicios/crear', [ServicioController::class, 'crear']);
$router->post('/servicios/crear', [ServicioController::class, 'crear']);
$router->get('/servicios/actualizar', [ServicioController::class, 'actualizar']);
$router->post('/servicios/actualizar', [ServicioController::class, 'actualizar']);
$router->post('/servicios/eliminar', [ServicioController::class, 'eliminar']);

// Comprueba y valida las rutas, que existan y les asigna las funciones del Controlador
$router->comprobarRutas();