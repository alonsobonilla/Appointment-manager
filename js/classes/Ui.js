import { limpiarHtml, scripting, eliminarCita, editarCita} from "../functions.js";
import { contenedorCitas } from "../selectors.js";
import { DB } from "../app.js";
export class Ui {
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
    imprimirCitas() {
        limpiarHtml();
        //Leer el contenido de la BD
        const objectStore = DB.transaction('citas').objectStore('citas');
        objectStore.openCursor().onsuccess = function(e) {
            const cursor = e.target.result;
            if(cursor) {
                const {mascota, propietario, telefono, fecha, hora, sintomas, id} = cursor.value;
                //Guardamos el objeto
                const objSave = cursor.value;
                
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
                btnEditar.onclick = () => editarCita(objSave);
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

                //Seguir con el otro cursor
                cursor.continue();
            }
        }
    }
}

