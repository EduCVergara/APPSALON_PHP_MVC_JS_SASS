<h1 class="nombre-pagina">Login</h1>
<p class="descripcion-pagina">Inicia Sesión con tus datos</p>

<?php 
    include_once __DIR__ . "/../templates/alertas.php";
?>

<form class="formulario" action="/" method="post">
    <div class="campo">
        <label for="email">E-mail</label>
        <input 
            type="email"
            id="email"
            placeholder="Tu E-Mail"
            name="email"
            value="<?php echo s($auth->email)?>"
        />
    </div>

    <div class="campo">
        <label for="password">Clave</label>
        <input 
            type="password"
            id="password"
            placeholder="Tu clave"
            name="password"
        />
    </div>

    <input type="submit" class="boton-80percent" value="Iniciar Sesión">
</form>

<div class="acciones">
    <a href="/crear-cuenta">¿Aún no tienes cuenta? Regístrate</a>
    <a href="/olvido">¿Olvidaste tu clave? ¡Recupérala Aquí!</a>
</div>