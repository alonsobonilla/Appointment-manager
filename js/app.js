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

let editando;
//Clases
class Citas {
    constructor() {
        this.citas = [];
    }
    agregarCitas(cita) {
        this.citas = [...this.citas, cita];
    }
    eliminarCita(id) {
        this.citas = this.citas.filter( cita => cita.id !== id);
    }
    editarCita(citaActualizada) {
        this.citas = this.citas.map( cita => cita.id === citaActualizada.id ? citaActualizada : cita);
    }
}

class Ui {
    imprimirAlerta(mensaje, tipo) {
        const divMensaje = document.createElement('DIV');
        divMensaje.classList.add('text-center','alert','d-block','col-12','mensaje-alerta');
        if(tipo) {
            divMensaje.classList.add('alert-danger');
        } else {
            divMensaje.classList.add('alert-success');
        }

        //Mensaje de la alerta
        divMensaje.textContent = mensaje;
        //Agregamos al DOM
        if(!document.querySelector('.mensaje-alerta')) {
            document.querySelector('#contenido').insertBefore(divMensaje, document.querySelector('.agregar-cita'));
        } else {
            document.querySelector('.mensaje-alerta').remove();
            document.querySelector('#contenido').insertBefore(divMensaje, document.querySelector('.agregar-cita'));
        }
        //Borramos la alerta despues de un tiempo
        setTimeout(() => {
            divMensaje.remove();
        }, 5000);
    }
    imprimirCitas({citas}) {
        limpiarHtml();
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

            const btnEliminar = scripting('button', ['btn','btn-danger','mr-2'],'Eliminar');
            btnEliminar.onclick = () => eliminarCita(id);

            const btnEditar = scripting('button', ['btn','btn-info'], 'Editar');
            btnEditar.onclick = () => editarCita(cita);
            //Agregar los parragos al div cita
            divCita.appendChild(mascotaParrafo);
            divCita.appendChild(propietarioParrafo);
            divCita.appendChild(telefonoParrafo);
            divCita.appendChild(fechaParrafo);
            divCita.appendChild(horaParrafo);
            divCita.appendChild(sintomasParrafo);
            divCita.appendChild(btnEliminar);
            divCita.appendChild(btnEditar);


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
    //Extraer la información del obj
    const {mascota, propietario, telefono, fecha, hora, sintomas} = citaObj;
    //Validar 
    if(mascota === '' || propietario === '' || telefono === '' || fecha === '' || hora === '' || sintomas === '') {
        ui.imprimirAlerta('Todos los campos son obligatorios', 'error');
        return;
    }

    if(editando) {
        //Pasar el objeto de la cita a edición
        administrarCitas.editarCita({...citaObj});
        ui.imprimirAlerta('Editado correctamente');
        formulario.querySelector('button[type="submit"]').textContent = 'Crear cita';
        //Cerramos el modo edición
        editando = false;
    } else {
        //Generar un id unico
        citaObj.id = Date.now();
        //Crear una nueva cita
        administrarCitas.agregarCitas({...citaObj});
        //Alerta
        ui.imprimirAlerta('Se agregó correctamente');
    }
    
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

function eliminarCita(id) {
    //Eliminar la cita
    administrarCitas.eliminarCita(id);
    //Muestre el mensaje
    ui.imprimirAlerta('La cita se eliminó correctamente');
    //Reset DOM
    ui.imprimirCitas(administrarCitas);
}

function editarCita(cita) {
    //Editar cita
    const {mascota, propietario, telefono, fecha, hora, sintomas} = cita;
    mascotaInput.value = mascota;
    propietarioInput.value = propietario;
    telefonoInput.value = telefono;
    fechaInput.value = fecha;
    horaInput.value = hora;
    sintomasInput.value = sintomas;
    
    //Llenamos el objeto
    citaObj.mascota = mascota;
    citaObj.propietario = propietario;
    citaObj.fecha = fecha;
    citaObj.telefono = telefono;
    citaObj.hora = hora;
    citaObj.sintomas = sintomas;

    //Cambiar el texto del boton
    formulario.querySelector('button[type="submit"]').textContent = 'Guardar Cambios';

    editando = true;
}