const API_URL = "https://netflix-bay-six.vercel.app"; // Cambia esto a la URL de tu API

// Obtener películas
async function obtenerPeliculas() {

    const respuesta = await fetch(`${API_URL}/peliculas`);

    if (!respuesta.ok) {
        throw new Error("Error al consultar las películas");
    }

    return await respuesta.json();

}

// Agregar película
async function agregarPelicula(pelicula) {

    const respuesta = await fetch(`${API_URL}/peliculas`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(pelicula)
    });

    if (!respuesta.ok) {
        throw new Error("Error al guardar la película");
    }

    return await respuesta.json();

}

// Eliminar película
async function eliminarPelicula(id) {

    const respuesta = await fetch(`${API_URL}/peliculas/${id}`, {
        method: "DELETE"
    });

    if (!respuesta.ok) {
        throw new Error("Error al eliminar la película");
    }

    return await respuesta.json();

}

// Actualizar película
async function actualizarPelicula(id, pelicula) {

    const respuesta = await fetch(`${API_URL}/peliculas/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(pelicula)
    });

    if (!respuesta.ok) {
        throw new Error("Error al actualizar la película");
    }

    return await respuesta.json();

}
