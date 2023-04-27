//Cuando se instala el service worker
self.addEventListener("install", e => {
    console.log("Instalado el service worker")
    console.log(e)
    //Cuando se instala es un buen lugar para cachear archivos
})

//Activar el service worker
self.addEventListener("activate", e => {
    console.log("Service Worker activado")
    console.log(e)
    //Cuando se activa es un buen lugar para nuevas versiones de la pwa
})

//Evento fetch para descargar archivos estaticos
self.addEventListener("fetch", e => {
    console.log("Fetch...", e)
})