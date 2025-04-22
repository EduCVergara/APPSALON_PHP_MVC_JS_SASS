<h1 class="nombre-pagina">Recuperar Contraseña</h1>

<?php include_once __DIR__ . "/../templates/alertas.php"; ?>

<?php if ($error) return; ?>

<p class="descripcion-pagina">Introduce tu nueva contraseña a continuación:</p>

<form class="formulario" method="POST">
    <div class="campo contrasena">
        <label for="password">Contraseña</label>
        <input 
            type="password"
            id="password"
            name="password"
            placeholder="Escribe aquí tu nueva contraseña"
        />
        <button type="button" id="togglePassword" class="toggle-btn" data-toggle="password" data-target="password">👁️</button>
    </div>
    <input type="submit" class="boton" value="Confirmar Nueva Contraseña">
</form>

<div class="acciones">
    <a href="/">¿Ya tienes una cuenta? Inicia Sesión</a>
    <a href="/crear-cuenta">¿Aún no tienes una cuenta? Registrarte</a>
</div>

<?php $script = "<script src='build/js/app.js'></script>"; ?>