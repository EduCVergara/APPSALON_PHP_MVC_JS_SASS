<?php

namespace Model;

class Servicio extends ActiveRecord {
    //BBDD configuration

    protected static $tabla = 'servicios';
    protected static $columnasDB = ['id', 'nombre', 'precio'];

    public $id;
    public $nombre;
    public $precio;

    public function __construct($args = [])
    {
        $this->id = $args['id'] ?? null;
        $this->nombre = $args['nombre'] ?? '';
        $this->precio = $args['precio'] ?? '';
    }

    public function validar() {
        if(!$this->nombre) {
            self::$alertas['error'][] = 'El <strong>nombre</strong> del servicio es obligatorio';
        }
        if(!$this->precio) {
            self::$alertas['error'][] = 'El <strong>precio</strong> del servicio es obligatorio';
        }
        if(!is_numeric($this->precio)) {
            self::$alertas['error'][] = 'El <strong>precio</strong> del servicio es sólo debe contener números';
        }

        return self::$alertas;
    }
}