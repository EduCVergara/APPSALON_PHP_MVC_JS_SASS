document.addEventListener('DOMContentLoaded', function () {
    iniciarAppEliminar();
});

function iniciarAppEliminar() {
    eliminarCita();
}

function eliminarCita() {
    const botonesEliminar = document.querySelectorAll('.boton-eliminar');

    botonesEliminar.forEach(boton => {
        boton.addEventListener('click', function(e) {
            e.preventDefault();

            const form = this.closest('form');
            
            try {
                Swal.fire({
                title: "¿Estás seguro que desea eliminar la cita?",
                text: "¡Esto no se puede deshacer!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#0da6f3",
                cancelButtonColor: "#cb0000",
                confirmButtonText: "Si, eliminar",
                cancelButtonText: "No, cancelar"
                }).then((result) => {
                if (result.isConfirmed) {
                    form.submit();
                    Swal.fire({
                    title: "¡Cita eliminada!",
                    text: "La cita ha sido eliminada correctamente.",
                    icon: "success"
                    }).then( () => {
                        window.location.reload(); //recarga la página
                    });
                }
                });
            } catch (error) {
                Swal.fire({
                icon: "error",
                title: "Error",
                text: "Hubo un error al eliminar la cita"
                });
            }
        })
    })
}