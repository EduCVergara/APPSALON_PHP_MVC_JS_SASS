<?php

namespace Controllers;

use Classes\Email;
use MVC\Router;
use Model\Usuario;

class LoginController {
    public static function login(Router $router) {
        $alertas = [];
        $auth = new Usuario();

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $auth = new Usuario($_POST);

            $alertas = $auth->validarLogin();

            if (empty($alertas)) {
                // Comprobar que exista el usuario
                $usuario = Usuario::where('email', $auth->email);
                if (!$usuario) {
                    Usuario::setAlerta('error', "El usuario con el correo: <strong>{$auth->email}</strong>, no existe.");
                } else {
                   if($usuario->comprobarPasswordAndVerificado($auth->password)) {
                        // Autenticar al usuario
                        if (!isset($_SESSION)) {
                            session_start();
                        } 

                        $_SESSION['id'] = $usuario->id;
                        $_SESSION['nombre'] = $usuario->nombre . " " . $usuario->apellido;
                        $_SESSION['email'] = $usuario->email;
                        $_SESISON['login'] = true;

                        // Redireccionamiento si es admin o no

                        if ($usuario->admin === "1") {
                            $_SESSION['admin'] = $usuario->admin ?? null;

                            header('Location: /admin');
                        } else {
                            header('Location: /cita');
                        }

                        debuguear($_SESSION);
                   }
                }
            }
        }

        $alertas = Usuario::getAlertas();
        
        $router->render('auth/login', [
            'alertas' => $alertas,
            'auth' => $auth
        ]);

    }

    public static function logout() {
        echo "desde logout";
    }

    public static function olvido(Router $router) {
        $alertas = [];

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $auth = new Usuario($_POST);
            $alertas = $auth->validarEmail();
            
            if (empty($alertas)) {
                $usuario = Usuario::where('email', $auth->email);
                
                if (!$usuario) {
                    Usuario::setAlerta('error', "El usuario con el correo: <strong>{$auth->email}</strong>, no está registrado.");
                } elseif($usuario && $usuario->confirmado === "0") {
                    Usuario::setAlerta('error', "El usuario existe, pero no ha confirmado su cuenta.");
                } elseif($usuario && $usuario->confirmado === "1") {
                    // Generación de Token
                    $usuario->crearToken();
                    // Actualizamos en BD el valor del token del usuario
                    $usuario->guardar();

                    // Enviar EMail
                    $email = new Email($usuario->nombre, $usuario->email, $usuario->token);
                    $email->enviarInstrucciones();

                    Usuario::setAlerta('exito', "Se han enviado las instrucciones al correo: <strong>{$auth->email}</strong> para restablecer tu contraseña.");
                } else {
                    Usuario::setAlerta('error', "Lo sentimos, ha ocurrido un error, contáctate con el administrador.");
                }
            }
        }

        $alertas = Usuario::getAlertas();
        $router->render('auth/olvido-password', [
            'alertas' => $alertas
        ]);

    }

    public static function recuperar(Router $router) {
        $alertas = [];
        $error = false;

        // obtenemos el token desde la url
        $token = s($_GET['token']);
        // buscar usuario por token
        $usuario = Usuario::where('token', $token);
        
        if (empty($usuario)) {
            Usuario::setAlerta('error', "Token no válido.");
            $error = true;
        }

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            // Leer la nueva clave y guardarla
            $password = new Usuario($_POST);
            $alertas = $password->validarPassword();
            
            if (empty($alertas)) {
                $usuario->password = $password->password;
                $usuario->hashPassword();    
                $usuario->token = null;

                $resultado = $usuario->guardar();
                if ($resultado) {
                    header('Location: /');
                }
            }
        }

        $alertas = Usuario::getAlertas();
        $router->render('auth/recuperar-password', [
            'alertas' => $alertas,
            'error' => $error
        ]);
    }

    // Creación de Usuarios
    public static function crear(Router $router) {
        
        $usuario = new Usuario();
        //arreglo para alertas
        $alertas = [];
        
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {

            $usuario->sincronizar($_POST);
            $alertas = $usuario->validarNuevaCuenta();

            //Revisamos que no hayan alertas
            if (empty($alertas)) {
                //Verificar que el usuario no esté registrado
                $resultado = $usuario->existeUsuario();

                if ($resultado->num_rows) {
                    $alertas = Usuario::getAlertas();
                } else {
                    //No está registrado, registrar al usuario
                    //Hashear password
                    $usuario->hashPassword();

                    // Generación de Token
                    $usuario->crearToken();

                    // Enviar el E-Mail
                    $email = new Email($usuario->email, $usuario->nombre, $usuario->token);
                    $email->enviarConfirmacion();

                    $resultado = $usuario->guardar();
                    if ($resultado) {
                        header('Location: /mensaje');
                    }
                }
            }

        }

        $router->render('auth/crear-cuenta', [
            'usuario' => $usuario,
            'alertas' => $alertas
        ]);

    }

    public static function mensaje(Router $router) {
        $router->render('auth/mensaje');
    }

    public static function confirmar(Router $router) {
        $alertas = [];
        $token = s($_GET['token']);
        $usuario = Usuario::where('token', $token);

        if (empty($usuario)) {
            // Mostramos mensaje de error
            Usuario::setAlerta('error', 'Token <strong>no válido</strong>');
        } else {
            // Actualizar usuario confirmado
            $usuario->confirmado = "1";
            $usuario->token = null;
            $usuario->guardar();
            Usuario::setAlerta('exito', '<strong>Usuario Confirmado</strong>, si deseas iniciar sesión, <u><strong><a href="/">Haz click Aquí</a></strong></u>');
        }

        $alertas = Usuario::getAlertas();
        $router->render('auth/confirmar-cuenta', [
            'alertas' => $alertas
        ]);
    }
}