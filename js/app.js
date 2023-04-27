if('serviceWorker' in navigator) {
    serviceWorker()
} else {
    console.log("Service worker no soportado")
}

async function serviceWorker() {
    try {
        const registrado = await navigator.serviceWorker.register("./sw.js")
        console.log("Se instaló correctamente ", registrado)
    } catch (error) {
        console.log("Fallo la autenticación..", error)
    }
}