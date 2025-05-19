<?php

namespace Controllers;

use Model\AdminCita;
use MVC\Router;

class AdminController {
    public static function index(Router $router) {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        isAuth();

        // Consultar la base de datos
        $consulta = "SELECT c.id, c.hora, concat(u.nombre, ' ', u.apellido) cliente, ";
        $consulta .= "u.email, u.telefono, s.nombre servicio, s.precio ";
        $consulta .= "FROM citas c ";
        $consulta .= "LEFT OUTER JOIN usuarios u ";
        $consulta .= "ON c.usuarioId = u.id ";
        $consulta .= "LEFT OUTER JOIN citas_servicios cs ";
        $consulta .= "ON cs.citaId = c.id ";
        $consulta .= "LEFT OUTER JOIN servicios s ";
        $consulta .= "ON s.id = cs.servicioId ";
        // $consulta .= "WHERE fecha = {$fecha};";

        $citas = AdminCita::SQL($consulta);

        $router->render('admin/index', [
            'nombre' => $_SESSION['nombre'],
            'citas' => $citas
        ]);
    }
}