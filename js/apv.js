import { datosCita, nuevaCita } from "./functions.js";
import { mascotaInput, propietarioInput, telefonoInput, fechaInput, horaInput, sintomasInput, formulario} from './selectors.js';
import { Ui } from "./classes/Ui.js";
export let DB;
//Instanciamos un obj de la UI para mostrar las citas
const ui = new Ui();
//Registrar eventos
window.onload = () => {
    eventListeners();
    crearDB();
}
function eventListeners() {
    mascotaInput.addEventListener('change', datosCita);
    propietarioInput.addEventListener('change', datosCita);
    telefonoInput.addEventListener('change', datosCita);
    fechaInput.addEventListener('change', datosCita);
    horaInput.addEventListener('change', datosCita);
    sintomasInput.addEventListener('change', datosCita);

    formulario.addEventListener('submit', nuevaCita);
}

function crearDB() {
    //Crear la base de datos
    const crearDB = window.indexedDB.open('citas',1);
    //Si hay error
    crearDB.onerror = function() {
        console.log('Hubo un error');
    }
    crearDB.onsuccess = function() {
        console.log('Base de datos creada');
        DB = crearDB.result;
        ui.imprimirCitas();
    }
    //Definir el schema
    crearDB.onupgradeneeded = function(e) {
        const db = e.target.result;
        const objectStore = db.createObjectStore('citas', {
            keyPath: 'id',
            autoIncrement: true
        })
        
        //Definir las columnas
        objectStore.createIndex('mascota','mascota',{unique:false});
        objectStore.createIndex('propietario','propietario',{unique:false});
        objectStore.createIndex('telefono','telefono',{unique:false});
        objectStore.createIndex('fecha','fecha',{unique:false});
        objectStore.createIndex('hora','hora',{unique:false});
        objectStore.createIndex('sintomas','sintomas',{unique:false});
        objectStore.createIndex('id','id',{unique:true});
        
    }

}