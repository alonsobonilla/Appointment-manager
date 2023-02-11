//Imports
import { Ui } from './classes/Ui.js';
import { mascotaInput, propietarioInput, telefonoInput, fechaInput, horaInput, sintomasInput, formulario, contenedorCitas} from './selectors.js';
import { DB } from './app.js';
const ui = new Ui();

let editando;
//Objeto con la información de la cita
const citaObj = {
    mascota: '',
    propietario: '',
    telefono: '',
    fecha: '',
    hora:'',
    sintomas: ''
}

export function datosCita(e) {
    citaObj[e.target.name] = e.target.value;
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

//valida y agregar una nueva cita a la clase de citas
export function nuevaCita(e) {
    e.preventDefault();
    //Extraer la información del obj
    const {mascota, propietario, telefono, fecha, hora, sintomas} = citaObj;
    //Validar 
    if(mascota === '' || propietario === '' || telefono === '' || fecha === '' || hora === '' || sintomas === '') {
        ui.imprimirAlerta('Todos los campos son obligatorios', 'error');
        return;
    }

    if(editando) {
        //Actualizar registro en IndexedDB
        const transaction = DB.transaction(['citas'], 'readwrite');
        const objectStore = transaction.objectStore('citas');
        objectStore.put(citaObj);
        transaction.oncomplete = function() {
            //Alerta
            ui.imprimirAlerta('Editado correctamente');
        }
        formulario.querySelector('button[type="submit"]').textContent = 'Crear cita';
        //Cerramos el modo edición
        editando = false;
    } else {
        //Generar un id unico
        citaObj.id = Date.now();
        //Insertar registro en indexedDB
        const transaction = DB.transaction(['citas'], 'readwrite');
        const objectStore = transaction.objectStore('citas');
        //Insertar en la BD
        objectStore.add(citaObj);
        transaction.oncomplete = function() {
            //Alerta
            ui.imprimirAlerta('Se agregó correctamente');
        }
        
    }
    
    //Reiniciar el formulario
    formulario.reset();
    //Reiniciamo el obj
    reiniciarObj();
    //Mostrar el html de las citas
    ui.imprimirCitas();
}



export function editarCita(cita) {
    //Editar cita
    const {mascota, propietario, telefono, fecha, hora, sintomas, id} = cita;
    mascotaInput.value = mascota;
    propietarioInput.value = propietario;
    telefonoInput.value = telefono;
    fechaInput.value = fecha;
    horaInput.value = hora;
    sintomasInput.value = sintomas;
    
    //Llenamos el objeto
    citaObj.id = id;
    citaObj.mascota = mascota;
    citaObj.propietario = propietario;
    citaObj.fecha = fecha;
    citaObj.telefono = telefono;
    citaObj.hora = hora;
    citaObj.sintomas = sintomas;

    //Cambiar el texto del boton
    formulario.querySelector('button[type="submit"]').textContent = 'Guardar Cambios';
    //Deshabilitar la opción de eliminar
    const citas = document.querySelectorAll('div.cita');
    citas.forEach( c => {
        c.querySelector('.btn-danger').disabled = true;
    })
    editando = true;
}
export function scripting(etiqueta, clases = [], mensaje,) {
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
export function limpiarHtml() {
    while(contenedorCitas.firstChild) {
        contenedorCitas.removeChild(contenedorCitas.firstChild);
    }
}

export function eliminarCita(id) {
    const objectStore = DB.transaction(['citas'], 'readwrite').objectStore('citas');
    objectStore.delete(id);
    //Muestre el mensaje
    ui.imprimirAlerta('La cita se eliminó correctamente');
    //Reset DOM
    ui.imprimirCitas();
}