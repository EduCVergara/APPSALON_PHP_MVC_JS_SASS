function initPasswordToggles() {
    const toggleButtons = document.querySelectorAll('[data-toggle="password"]');
  
    toggleButtons.forEach(button => {
      const inputId = button.getAttribute('data-target');
      const passwordInput = document.getElementById(inputId);
  
      if (!passwordInput) return;
  
      button.addEventListener('click', () => {
        const isPassword = passwordInput.type === 'password';
        passwordInput.type = isPassword ? 'text' : 'password';
        button.textContent = isPassword ? '🙈' : '👁️';
      });
    });
  }
  
document.addEventListener('DOMContentLoaded', () => {
    initPasswordToggles();
    iniciarApp();
});

let paso = 1;
const pasoInicial = 1;
const pasoFinal = 3;

const cita = {
  // por default, los objetos en javascript funcionan como un let, lo que significa que podemos reescribir en ellos sin problemas
  id: '',
  nombre: '',
  fecha: '',
  hora: '',
  servicios: []
}

function iniciarApp() {
  mostrarSeccion(); // Muestra y oculta las secciones
  tabs(); // Cambia la sección cuando se presionan los tabs
  botonesPaginador(); // Agrega o quita los botones del paginador
  paginaSiguiente();
  paginaAnterior();

  consultarAPI(); // Consulta la API en el Backend de PHP

  idCliente(); // añade el id del cliente al objeto de cita
  nombreCliente(); // añade el nombre del cliente al objeto de cita
  seleccionarFecha(); // añade la fecha de la cita al objeto
  seleccionarHora(); // añade la hora de la cita al objeto

  mostrarResumen(); // Muestra el resumen de la cita
}

function mostrarSeccion() {
  
  //Ocultar la sección que tenga la clase de mostrar
  const seccionAnterior = document.querySelector('.mostrar');
  const tabAnterior = document.querySelector('.actual');
  if (seccionAnterior) {
    seccionAnterior.classList.remove('mostrar');
    tabAnterior.classList.remove('actual');
  }

  //Seleccionar la sección con el paso
  const pasoSelector = `#paso-${paso}`;
  const seccion = document.querySelector(pasoSelector);
  seccion.classList.add('mostrar');

  // Resalta el tab actual
  const tab = document.querySelector(`[data-paso="${paso}"]`);
  tab.classList.add('actual');
}

function tabs() {
  const botones = document.querySelectorAll('.tabs button');

  botones.forEach(boton => {
    boton.addEventListener('click', function(e) {
      paso = parseInt(e.target.dataset.paso);
      mostrarSeccion();
      botonesPaginador();
    })
  })
}

function botonesPaginador() {

  const paginaAnterior = document.querySelector('#anterior');
  const paginaSiguiente = document.querySelector('#siguiente');

  if (paso === 1) {
    paginaAnterior.classList.add('ocultar');
    paginaSiguiente.classList.remove('ocultar');
  } else if (paso === 3) {
    paginaAnterior.classList.remove('ocultar');
    paginaSiguiente.classList.add('ocultar');
    mostrarResumen();
  } else {
    paginaAnterior.classList.remove('ocultar');
    paginaSiguiente.classList.remove('ocultar');
  }

  mostrarSeccion();
}

function paginaAnterior() {
  const paginaAnterior = document.querySelector('#anterior');
  paginaAnterior.addEventListener('click', function() {
    if (paso <= pasoInicial) return;
    paso--;
    botonesPaginador();
  })
}

function paginaSiguiente() {
  const paginaSiguiente = document.querySelector('#siguiente');
  paginaSiguiente.addEventListener('click', function() {
    if (paso >= pasoFinal) return;
    paso++;
    botonesPaginador();
  })
}

async function consultarAPI() { // Ejecutar dos funciones simultáneamente (Async)
  try {
    const baseURL = window.location.hostname.includes('localhost')
      ? 'http://localhost:3000'
      : ''; // En producción, usa la misma raíz

    const url = `${baseURL}/api/servicios`;
    const resultado = await fetch(url); // Await espera a que termine el fetch para seguir avanzando
    const servicios = await resultado.json();
    mostrarServicios(servicios);
  } catch (error) {
    console.log(error);
  }
}

function mostrarServicios(servicios) {
  servicios.forEach(servicio => {
    const {id, nombre, precio} = servicio;

    // Scripting (más tedioso pero más seguro y mejor performance)
    const nombreServicio = document.createElement('P');
    nombreServicio.classList.add('nombre-servicio');
    nombreServicio.textContent = nombre;
    
    const precioServicio = document.createElement('P');
    precioServicio.classList.add('precio-servicio');
    precioServicio.textContent = `$ ${precio}`;

    const servicioDiv = document.createElement('DIV');
    servicioDiv.classList.add('servicio');
    servicioDiv.dataset.idServicio = id; // crear atributo personalizado
    servicioDiv.onclick = function() {
      seleccionarServicio(servicio);
    };

    servicioDiv.appendChild(nombreServicio);
    servicioDiv.appendChild(precioServicio);

    document.querySelector('#servicios').appendChild(servicioDiv); // Buscamos el div con el id servicios y le insertamos el div con los servicios
    
  })
}

function seleccionarServicio(servicio) {
  const { id } = servicio;
  const { servicios } = cita;
  // identifica el elemento al que se le da click
  const divServicio = document.querySelector(`[data-id-servicio="${id}"]`);

  // Comprobar si el servicio ya fué agregado
  if (servicios.some(agregado => agregado.id === id)) { //Itera sobre el arreglo y verifica si un elemento existe en ese arreglo
    //Eliminarlo si está agregado
    cita.servicios = servicios.filter(agregado => agregado.id !== id); // permite sacar un elemento según un filtro
    divServicio.classList.remove('seleccionado');
  } else {
    //Agregarlo si no está
    cita.servicios = [...servicios, servicio];
    divServicio.classList.add('seleccionado');
  }

}

function nombreCliente() {
  cita.nombre = document.querySelector('#nombre').value;
}

function idCliente() {
  cita.id = document.querySelector('#id').value;
}

function seleccionarFecha() {
  const inputFecha = document.querySelector('#fecha');
  inputFecha.addEventListener('input', function(e) {

    const dia = new Date(e.target.value).getUTCDay();
    if ([6, 0].includes(dia)) {
      e.target.value = '';
      mostrarAlerta('Fecha fuera de días de trabajo', 'error', '.formulario');
    } else {
      cita.fecha = e.target.value;
    }
  })
}

function seleccionarHora() {

  const inputHora = document.querySelector('#hora');
  inputHora.addEventListener('input', function(e) {
    
    const horaCita = e.target.value;
    const hora = horaCita.split(":")[0];

    if (hora < 10 || hora > 17) { // Establecer horario de trabajo del local de 10 a 18 hrs
      e.target.value = '';
      mostrarAlerta('Trabajamos de 10:00 AM a 18:00 PM', 'error', '.formulario');
    } else {
      cita.hora = e.target.value;
    }
  })

}

function mostrarAlerta(mensaje, tipo, elemento, desaparece = true) {

  // previene que se genere más de una alerta
  const alertaPrevia = document.querySelector('.alerta');
  if (alertaPrevia) {
    alertaPrevia.remove();
  };

  const alerta = document.createElement('DIV');
  alerta.textContent = mensaje;
  alerta.classList.add('alerta');
  alerta.classList.add(tipo);

  const referencia = document.querySelector(elemento);
  referencia.appendChild(alerta);

  if (desaparece) {
      // Elimina la alerta luego de 2seg
    setTimeout(() => {
      alerta.remove();
    }, 2000)
  }
}

function mostrarResumen() {
  const resumen = document.querySelector('.contenido-resumen');

  // Limpiar contenido de resumen
  while (resumen.firstChild) {
    resumen.removeChild(resumen.firstChild);
  }

  if (Object.values(cita).includes('') || cita.servicios.length === 0 ) {
    mostrarAlerta('Hacen falta datos por rellenar o servicios por seleccionar', 'error', '.contenido-resumen', false);

    return;
  }
  
  // Formatear el div de Resumen
  const { nombre, fecha, hora, servicios } = cita; //Destructuring, extraemos los datos de cita

  // Heading para Datos de la Cita en resumen
  const headingCita = document.createElement('H3');
  headingCita.textContent = 'Resumen de Datos de la Cita';
  resumen.appendChild(headingCita);

  const nombreCliente = document.createElement('P');
  nombreCliente.innerHTML = `<span>Nombre: </span>${nombre}`;

  // ---------------------------Formateo de Fecha -------------------------- //
  const fechaObj = new Date(fecha);
  const mes = fechaObj.getMonth();
  const dia = fechaObj.getDate() + 2;
  const year = fechaObj.getFullYear();

  const fechaUTC = new Date(Date.UTC(year, mes, dia));

  const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  const fechaFormateada = fechaUTC.toLocaleDateString('es-AR', opciones);

  const fechaCita = document.createElement('P');
  fechaCita.innerHTML = `<span>Fecha: </span>${fechaFormateada}`;
  // ---------------------------Formateo de Fecha -------------------------- //

  const horaCita = document.createElement('P');
  horaCita.innerHTML = `<span>Hora: </span>${hora} hrs.`;

  // Botón para crear una cita
  const botonReservar = document.createElement('BUTTON');
  botonReservar.classList.add('boton');
  botonReservar.textContent = 'Reservar Hora';
  botonReservar.onclick = reservarCita;


  resumen.appendChild(nombreCliente);
  resumen.appendChild(fechaCita);
  resumen.appendChild(horaCita);

  // Heading para servicios en resumen
  const headingServicios = document.createElement('H3');
  headingServicios.textContent = 'Resumen de Servicios Solicitados';
  resumen.appendChild(headingServicios);

  let total = 0;

  // Iterar y mostrar servicios
  servicios.forEach(servicio => {
    const { id, precio, nombre } = servicio; //Destructuring a servicio para saber los datos del servicio en cuestión
    const contenedorServicio = document.createElement('DIV');
    contenedorServicio.classList.add('contenedor-servicio');

    const nombreServicio = document.createElement('P');
    nombreServicio.textContent = nombre;

    const precioServicio = document.createElement('P');
    precioServicio.innerHTML = `<span>Costo: </span>$${precio}`;

    contenedorServicio.appendChild(nombreServicio);
    contenedorServicio.appendChild(precioServicio);

    resumen.appendChild(contenedorServicio);

    total += parseFloat(precio);
  })

  const headingTotal = document.createElement('H3');
  headingTotal.innerHTML = `<span>Valor Total: <span><strong><h3>$${total}</h3></strong>`;

  resumen.appendChild(headingTotal);
  resumen.appendChild(botonReservar);
}

async function reservarCita() {
  const datos = new FormData();
  const { nombre, fecha, hora, servicios, id } = cita;

  const idServicios = servicios.map( servicio => servicio.id );

  datos.append('fecha', fecha);
  datos.append('hora', hora);
  datos.append('usuarioId', id);
  datos.append('servicios', idServicios);

  console.log([...datos]); // console log para saber qué datos me está entregando el FormData.

  // Determina la URL base según dónde estés corriendo la app
  const API_BASE_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:3000'
  : 'https://barberapp.up.railway.app';

  try {
      // Petición hacia la API
    const respuesta = await fetch(`${API_BASE_URL}/api/citas`, {
      method: 'POST',
      body: datos // body: Cuerpo de la petición que se va a enviar
    });

    const resultado = await respuesta.json();
    console.log(resultado.resultado);

    if (resultado.resultado) {
      Swal.fire({
        icon: 'success',
        title: 'Cita Creada',
        text: 'Tu hora se ha reservado correctamente!',
        button: 'OK'
      }).then( () => {
        window.location.reload(); //recarga la página
      })
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Hubo un error al guardar la cita"
    });
  }
}