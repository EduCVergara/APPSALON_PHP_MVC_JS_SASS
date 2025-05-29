<div class="campo">
    <label for="nombre">Nombre</label>
    <input 
        type="text" 
        name="nombre"
        placeholder="Nombre del servicio" 
        value="<?php echo $servicio->nombre; ?>"
        id="nombre">
</div>

<div class="campo">
    <label for="precio">Precio</label>
    <input 
        type="number" 
        name="precio"
        placeholder="Precio del servicio" 
        value="<?php echo $servicio->precio; ?>"
        id="precio">
</div>