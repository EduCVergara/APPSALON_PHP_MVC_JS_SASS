<h1 class="nombre-pagina">Servicios</h1>
<p class="descripcion-pagina">Administración de Servicios</p>

<script src='https://cdn.jsdelivr.net/npm/sweetalert2@11'></script>

<?php if (isset($_SESSION['servicio_creado'])) : ?>
    <script>
        Swal.fire({
            icon: 'success',
            title: 'Servicio Creado',
            html: 'El servicio <strong><?= s($_SESSION['servicio_creado']) ?></strong>, se creó correctamente'
        });
    </script>
    <?php unset($_SESSION['servicio_creado']); ?>
<?php endif; ?>

<?php if (isset($_SESSION['servicio_actualizado'])) : ?>
    <script>
        Swal.fire({
            icon: 'success',
            title: 'Servicio Actualizado',
            html: 'El servicio <strong><?= s($_SESSION['servicio_actualizado']) ?></strong>, ¡ha sido actualizado correctamente!'
        });
    </script>
    <?php unset($_SESSION['servicio_actualizado']); ?>
<?php endif; ?>

<?php if (isset($_SESSION['servicio_eliminado'])) : ?>
    <script>
        Swal.fire({
            icon: 'success',
            title: 'Servicio Eliminado',
            html: 'El servicio <strong><?= s($_SESSION['servicio_eliminado']) ?></strong>, ¡se ha eliminado correctamente!'
        });
    </script>
    <?php unset($_SESSION['servicio_eliminado']); ?>
<?php endif; ?>

<?php include_once __DIR__ . '/../templates/barra.php'; ?>

<div class="contenedor-servicios">
    <h2 class="titulo-servicios">Servicios Disponibles</h2>
    <ul class="items-servicios">
        <?php foreach ($servicios as $servicio) : ?>
            <li class="item-servicio">
                <p class="nombre-servicio">🛠️ <strong><?php echo $servicio->nombre; ?></strong></p>
                <p class="precio-servicio">💲<?php echo number_format($servicio->precio, 0, ',', '.'); ?></p>

                <div class="acciones">
                    <a class="boton" href="/servicios/actualizar?id=<?php echo $servicio->id; ?>">Actualizar</a>

                    <form action="/servicios/eliminar" method="POST">
                        <input type="hidden" name="id" value="<?php echo $servicio->id; ?>">
                        <input type="submit" value="Borrar" class="boton-eliminar">
                    </form>
                </div>
            </li>
        <?php endforeach; ?>
    </ul>
</div>