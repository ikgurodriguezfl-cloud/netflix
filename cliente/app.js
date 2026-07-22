const formulario = document.getElementById("formulario");

const titulo = document.getElementById("titulo");
const genero = document.getElementById("genero");
const año = document.getElementById("año");
const duracion = document.getElementById("duracion");
const idioma = document.getElementById("idioma");
const calificacion = document.getElementById("calificacion");

const btnConsultar = document.getElementById("btnConsultar");
const listaPeliculas = document.getElementById("listaPeliculas");

// Guardar película
formulario.addEventListener("submit", async (e) => {

    e.preventDefault();

    const pelicula = {
        titulo: titulo.value,
        genero: genero.value,
        año: Number(año.value),
        duracion: Number(duracion.value),
        idioma: idioma.value,
        calificacion: Number(calificacion.value)
    };

    try {

        const respuesta = await agregarPelicula(pelicula);

        alert(respuesta.mensaje);

        formulario.reset();

    } catch (error) {

        alert(error.message);

    }

});

// Consultar películas
btnConsultar.addEventListener("click", async () => {

    try {

        const peliculas = await obtenerPeliculas();

        listaPeliculas.innerHTML = "";

        peliculas.forEach((pelicula) => {

            const li = document.createElement("li");

            const nombre = document.createElement("span");
            nombre.textContent = pelicula.titulo;

            const btnEditar = document.createElement("button");
            btnEditar.type = "button";
            btnEditar.textContent = "Editar";

            const formularioEditar = document.createElement("form");
            formularioEditar.className = "formulario-editar";

            const campos = [
                ["titulo", "text"], ["genero", "text"], ["a\u00F1o", "number"],
                ["duracion", "number"], ["idioma", "text"], ["calificacion", "number"]
            ];

            campos.forEach(([campo, tipo]) => {
                const input = document.createElement("input");
                input.name = campo;
                input.type = tipo;
                input.value = pelicula[campo];
                input.required = true;
                input.placeholder = campo;
                if (campo === "calificacion") {
                    input.min = "0";
                    input.max = "10";
                    input.step = "0.1";
                }
                formularioEditar.appendChild(input);
            });

            const btnGuardar = document.createElement("button");
            btnGuardar.type = "submit";
            btnGuardar.textContent = "Guardar cambios";
            formularioEditar.appendChild(btnGuardar);

            btnEditar.addEventListener("click", () => {
                formularioEditar.classList.toggle("visible");
            });

            formularioEditar.addEventListener("submit", async (e) => {
                e.preventDefault();
                btnGuardar.disabled = true;

                const datos = new FormData(formularioEditar);
                const peliculaActualizada = {
                    titulo: datos.get("titulo"),
                    genero: datos.get("genero"),
                    ["a\u00F1o"]: Number(datos.get("a\u00F1o")),
                    duracion: Number(datos.get("duracion")),
                    idioma: datos.get("idioma"),
                    calificacion: Number(datos.get("calificacion"))
                };

                try {
                    await actualizarPelicula(pelicula._id, peliculaActualizada);
                    Object.assign(pelicula, peliculaActualizada);
                    nombre.textContent = pelicula.titulo;
                    formularioEditar.classList.remove("visible");
                } catch (error) {
                    alert(error.message);
                } finally {
                    btnGuardar.disabled = false;
                }
            });

            const btnEliminar = document.createElement("button");
            btnEliminar.type = "button";
            btnEliminar.textContent = "Eliminar";
            btnEliminar.setAttribute("aria-label", `Eliminar ${pelicula.titulo}`);

            btnEliminar.addEventListener("click", async () => {
                btnEliminar.disabled = true;

                try {
                    await eliminarPelicula(pelicula._id);
                    li.remove();
                } catch (error) {
                    alert(error.message);
                    btnEliminar.disabled = false;
                }
            });

            li.append(nombre, btnEditar, btnEliminar, formularioEditar);

            listaPeliculas.appendChild(li);

        });

    } catch (error) {

        alert(error.message);

    }

});
