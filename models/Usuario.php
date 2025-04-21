<?php

namespace Model;

class Usuario extends ActiveRecord {
    // Base de datos
    protected static $tabla = 'usuarios';
    protected static $columnasDB = ['id', 'nombre', 'apellido', 'email', 'password', 'telefono', 'admin', 'confirmado', 'token'];

    public $id;
    public $nombre;
    public $apellido;
    public $email;
    public $password;
    public $telefono;
    public $admin;
    public $confirmado;
    public $token;

    public function __construct($args = [])  {
        
        $this->id = $args['id'] ?? null;
        $this->nombre = $args['nombre'] ?? '';
        $this->apellido = $args['apellido'] ?? '';
        $this->email = $args['email'] ?? '';
        $this->password = $args['password'] ?? '';
        $this->telefono = $args['telefono'] ?? '';
        $this->admin = $args['admin'] ?? '0';
        $this->confirmado = $args['confirmado'] ?? '0';
        $this->token = $args['token'] ?? '';
    }

    // Mensajes de validación para creación de la cuenta (pública debido a que se llamandesde el controlador)
    public function validarNuevaCuenta() {
        if (!$this->nombre) {
            self::$alertas['error'] [] = 'El <strong>nombre</strong> del cliente es obligatorio';
        }
        if (!$this->apellido) {
            self::$alertas['error'] [] = 'El <strong>apellido</strong> del cliente es obligatorio';
        }
        if (!$this->telefono) {
            self::$alertas['error'] [] = 'El <strong>telefono</strong> del cliente es obligatorio';
        }
        if (!$this->email) {
            self::$alertas['error'] [] = 'El <strong>email</strong> del cliente es obligatorio';
        }
        if (!$this->password) {
            self::$alertas['error'] [] = 'El <strong>password</strong> del cliente es obligatorio';
        }
        if (strlen($this->password) < 8) {
            self::$alertas['error'] [] = 'La <strong>contraseña</strong> debe tener al menos <strong>8 caracteres</strong>';
        }


        return self::$alertas;
    }

    public function validarLogin() {
        if (!$this->email) {
            self::$alertas['error'] [] = "El <strong>E-Mail</strong> es obligatorio";
        }
        if (!$this->password) {
            self::$alertas['error'] [] = "La <strong>Contraseña</strong> es obligatoria";
        }

        return self::$alertas;
    }

    public function validarEmail() {
        if (!$this->email) {
            self::$alertas['error'] [] = "El <strong>E-Mail</strong> es obligatorio";
        }

        return self::$alertas;
    }

    public function existeUsuario() {
        $query = "SELECT * FROM " . self::$tabla . " WHERE email = '" . $this->email . "' LIMIT 1";

        $resultado = self::$db->query($query);

        if ($resultado->num_rows) {
            self::$alertas['error'] [] = "Un usuario con el correo: <u><strong>" . $this->email . "</strong></u> ya está registrado.";
        }

        return $resultado;
    }

    public function hashPassword() {
        $this->password = password_hash($this->password, PASSWORD_BCRYPT);
    }

    public function crearToken() {
        $this->token = uniqid();
    }

    public function comprobarPasswordAndVerificado($password) {
        $resultado = password_verify($password, $this->password);
        
        if (!$this->confirmado) {
            self::setAlerta('error', "El usuario <strong>{$this->email}</strong>, aún no ha sido confirmado. Debe verificar su correo.");
        } elseif(!$resultado) {
            self::setAlerta('error', "La contraseña es incorrecta");
        } else {
            return true;
        }
    }
}