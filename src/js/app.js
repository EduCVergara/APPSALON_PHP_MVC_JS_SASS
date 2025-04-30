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

  console.log(cita);
}

function nombreCliente() {
  const nombre = document.querySelector('#nombre').value;
  cita.nombre = nombre;
  console.log(nombre);
}

function seleccionarFecha() {
  const inputFecha = document.querySelector('#fecha');
  inputFecha.addEventListener('input', function(e) {

    const dia = new Date(e.target.value).getUTCDay();
    if ([6, 0].includes(dia)) {
      e.target.value = '';
      mostrarAlerta('Fecha fuera de días de trabajo', 'error');
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

    if (hora < 10 || hora > 18) { // Establecer horario de trabajo del local
      e.target.value = '';
      mostrarAlerta('Hora seleccionada fuera de horario laboral', 'error');
    } else {
      cita.hora = e.target.value;
    }
  })

}

function mostrarAlerta(mensaje, tipo) {

  // previene que se genere más de una alerta
  const alertaPrevia = document.querySelector('.alerta');
  if (alertaPrevia) return;

  const alerta = document.createElement('DIV');
  alerta.textContent = mensaje;
  alerta.classList.add('alerta');
  alerta.classList.add(tipo);

  const formulario = document.querySelector('.formulario');
  formulario.appendChild(alerta);

  // Elimina la alerta luego de 2seg
  setTimeout(() => {
    alerta.remove();
  }, 2000)
}

function mostrarResumen() {
  const resumen = document.querySelector('.contenido-resumen');

  if (Object.values(cita).includes('') ) {
    mostrarAlerta('Debe rellenar todos los campos anteriores antes de seguir', 'error');
  } else {

  }
}