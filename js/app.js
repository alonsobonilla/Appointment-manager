//Campos del formulario
const mascotaInput = document.querySelector('#mascota');
const propietarioInput = document.querySelector('#propietario');
const telefonoInput = document.querySelector('#telefono');
const fechaInput = document.querySelector('#fecha');
const horaInput = document.querySelector('#hora');
const sintomasInput = document.querySelector('#sintomas');
//UI
const formulario = document.querySelector('#nueva-cita');
const contenedorCitas = document.querySelector('#citas');

//Clases
class Citas {
    constructor() {
        this.citas = [];
    }
    agregarCitas(cita) {
        this.citas = [...this.citas, cita];
        console.log(this.citas);
    }
}

class Ui {
    imprimirAlerta(mensaje, tipo) {
        const divMensaje = document.createElement('DIV');
        divMensaje.classList.add('text-center','alert','d-block','col-12');
        if(tipo) {
            divMensaje.classList.add('alert-danger');
        } else {
            divMensaje.classList.add('alert-success');
        }

        //Mensaje de la alerta
        divMensaje.textContent = mensaje;
        //Agregamos al DOM
        document.querySelector('#contenido').insertBefore(divMensaje, document.querySelector('.agregar-cita'));
        //Borramos la alerta despues de un tiempo
        setTimeout(() => {
            divMensaje.remove();
        }, 5000);
    }
    imprimirCitas({citas}) {
        citas.forEach( cita => {
            const {mascota, propietario, telefono, fecha, hora, sintomas, id} = cita;

            const divCita = scripting('DIV', ['cita','p-3']);
            divCita.dataset.id = id;

            //Scripting de los elementos de la cita
            const mascotaParrafo = scripting('H2', ['card-title','font-weigth-bolder'], mascota);
            const propietarioParrafo = scripting('p');
            propietarioParrafo.innerHTML = `<span clas="font-weight-bolder">Propietario: </span> ${propietario}`;
            const telefonoParrafo = scripting('p');
            telefonoParrafo.innerHTML = `<span clas="font-weight-bolder">Telefono: </span> ${telefono}`;
            const fechaParrafo = scripting('p');
            fechaParrafo.innerHTML = `<span clas="font-weight-bolder">Fecha: </span> ${fecha}`;
            const horaParrafo = scripting('p');
            horaParrafo.innerHTML = `<span clas="font-weight-bolder">Hora: </span> ${hora}`;
            const sintomasParrafo = scripting('p');
            sintomasParrafo.innerHTML = `<span clas="font-weight-bolder">Sintomas: </span> ${sintomas}`;

            //Agregar los parragos al div cita
            divCita.appendChild(mascotaParrafo);
            divCita.appendChild(propietarioParrafo);
            divCita.appendChild(telefonoParrafo);
            divCita.appendChild(fechaParrafo);
            divCita.appendChild(horaParrafo);
            divCita.appendChild(sintomasParrafo);


            //Agregar las cita al DOM
            contenedorCitas.appendChild(divCita);
        })
    }
}

const ui = new Ui();
const administrarCitas = new Citas();
//Registrar eventos
eventListeners();
function eventListeners() {
    mascotaInput.addEventListener('change', datosCita);
    propietarioInput.addEventListener('change', datosCita);
    telefonoInput.addEventListener('change', datosCita);
    fechaInput.addEventListener('change', datosCita);
    horaInput.addEventListener('change', datosCita);
    sintomasInput.addEventListener('change', datosCita);

    formulario.addEventListener('submit', nuevaCita);
}
//Objeto con la información de la cita
const citaObj = {
    mascota: '',
    propietario: '',
    telefono: '',
    fecha: '',
    hora:'',
    sintomas: ''
}
//Funciones

function datosCita(e) {
    citaObj[e.target.name] = e.target.value;
}

//valida y agregar una nueva cita a la clase de citas
function nuevaCita(e) {
    e.preventDefault();
    limpiarHtml();
    //Extraer la información del obj
    const {mascota, propietario, telefono, fecha, hora, sintomas} = citaObj;
    //Validar 
    if(mascota === '' || propietario === '' || telefono === '' || fecha === '' || hora === '' || sintomas === '') {
        ui.imprimirAlerta('Todos los campos son obligatorios', 'error');
        return;
    }
    //Generar un id unico
    citaObj.id = Date.now();
    //Crear una nueva cita
    administrarCitas.agregarCitas({...citaObj});
    //Reiniciar el formulario
    formulario.reset();
    //Reiniciamo el obj
    reiniciarObj();
    //Mostrar el html de las citas
    ui.imprimirCitas(administrarCitas);
}

//Reiniciar obj global
function reiniciarObj() {
    citaObj.mascota = '';
    citaObj.propietario = '';
    citaObj.telefono = '';
    citaObj.fecha = '';
    citaObj.hora = '';
    citaObj.sintomas = '';
}

function scripting(etiqueta, clases = [], mensaje,) {
    const crearEtiqueta = document.createElement(etiqueta);
    if(clases.length != 0) {
        clases.forEach( clase => {
            crearEtiqueta.classList.add(clase);
        });
    }
    if(mensaje)
        crearEtiqueta.textContent = mensaje;
    return crearEtiqueta;
}

//limpiar el html
function limpiarHtml() {
    while(contenedorCitas.firstChild) {
        contenedorCitas.removeChild(contenedorCitas.firstChild);
    }
}