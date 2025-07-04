<?php 

namespace Classes;

use PHPMailer\PHPMailer\PHPMailer;

class Email {

    public $email;
    public $nombre;
    public $token;

    public function __construct($email, $nombre, $token)
    {
        $this->email = $email;
        $this->nombre = $nombre;
        $this->token = $token;
    }

    public function enviarConfirmacion() {
        // Creacion del objeto del Email
        $mail = new PHPMailer();
        $mail->isSMTP();
        $mail->Host = $_ENV['EMAIL_HOST'];
        $mail->SMTPAuth = true;
        $mail->Port = $_ENV['EMAIL_PORT'];
        $mail->Username = $_ENV['EMAIL_USER'];
        $mail->Password = $_ENV['EMAIL_PASS'];

        $mail->setFrom('cuentas@salonapp.com');
        $mail->addAddress('cuentas@salonapp.com', 'AppSalon.com');
        $mail->Subject = 'Confirma tu cuenta';

        // Configuracion host
        $ip = $_ENV['DB_HOST'] ?: 'localhost';
        $puerto = $_ENV['DB_PORT'] ?: '3000';
        $url = "http://{$ip}:{$puerto}/confirmar-cuenta?token=" . $this->token;

        // Setear HTML para el mensaje:
        $mail->isHTML(TRUE);
        $mail->CharSet = 'UTF-8';

        $contenido = "<html>";
        $contenido .= "<p><strong>Hola " . $this->nombre .  "</strong>, has creado tu cuenta en AppSalon, sólo debes confirmarla presionando el siguiente enlace: </p>";
        $contenido .= "<p>Presiona Aquí: <strong><a href='{$url}'>Confirmar Cuenta</a></strong></p>";
        $contenido .= "<p>Si tú no fuiste quien solicitó esta cuenta, puedes ignorar este mensaje.</p>";
        $contenido .= "</html>";

        $mail->Body = $contenido;

        //Enviar el Email
        $mail->send();
    }

    public function enviarInstrucciones() {
        // Creacion del objeto del Email
        $mail = new PHPMailer();
        $mail->isSMTP();
        $mail->Host = $_ENV['EMAIL_HOST'];
        $mail->SMTPAuth = true;
        $mail->Port = $_ENV['EMAIL_PORT'];
        $mail->Username = $_ENV['EMAIL_USER'];
        $mail->Password = $_ENV['EMAIL_PASS'];

        $mail->setFrom('cuentas@salonapp.com');
        $mail->addAddress('cuentas@salonapp.com', 'AppSalon.com');
        $mail->Subject = 'Restablece tu contraseña';

        // Setear HTML para el mensaje:
        $ip = $_ENV['DB_HOST'] ?: 'localhost';
        $puerto = $_ENV['DB_PORT'] ?: '3000';
        $url = "http://{$ip}:{$puerto}/recuperar?token=" . $this->token;
        $mail->isHTML(TRUE);
        $mail->CharSet = 'UTF-8';

        $contenido = "<html>";
        $contenido .= "<p><strong>Hola " . $this->nombre .  "</strong>, solicitaste un restablecimiento de contraseña, para establecer una nueva clave haz click en el siguiente enlace: </p>";
        $contenido .= "<p>Presiona Aquí: <strong><a href='{$url}'>Restablecer Contraseña</a></strong></p>";
        $contenido .= "<p>Si tú no fuiste quien solicitó este restablecimiento de contraseña, puedes <strong>ignorar este mensaje.</strong></p>";
        $contenido .= "</html>";

        $mail->Body = $contenido;

        //Enviar el Email
        $mail->send();
    }
}

?>