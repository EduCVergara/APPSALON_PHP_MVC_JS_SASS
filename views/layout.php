<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>App Salón</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;700;900&display=swap" rel="stylesheet"> 
    <link rel="stylesheet" href="build/css/app.css">
</head>
<body>
    <div class="contenedor-app">
        <div class="imagen"></div>
        <div class="app">
            <div class="logo">
                <picture>
                    <source srcset="build/img/BARBER-APP-LOGO-2.avif" type="image/avif">
                    <source srcset="build/img/BARBER-APP-LOGO-2.webp" type="image/webp">
                    <img src="build/img/BARBER-APP-LOGO-2.png" alt="Gentlemen's Barber Logo">
                </picture>
            </div>
            <?php echo $contenido;?>
        </div>
    </div>

    <?php echo $script ?? ''; ?>

</body>
</html>