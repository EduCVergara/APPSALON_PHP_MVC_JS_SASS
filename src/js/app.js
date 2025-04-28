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

function iniciarApp() {
  mostrarSeccion(); // Muestra y oculta las secciones
  tabs(); // Cambia la sección cuando se presionan los tabs
  botonesPaginador(); // Agrega o quita los botones del paginador
  paginaSiguiente();
  paginaAnterior();

  consultarAPI(); // Consulta la API en el Backend de PHP
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
    const url = 'http://localhost:3000/api/servicios';
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

    servicioDiv.appendChild(nombreServicio);
    servicioDiv.appendChild(precioServicio);

    document.querySelector('#servicios').appendChild(servicioDiv); // Buscamos el div con el id servicios y le insertamos el div con los servicios
    
  })
}