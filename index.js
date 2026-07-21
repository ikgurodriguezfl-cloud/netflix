const express = require('express');
const app = express();
const morgan = require('morgan');
app.use(morgan('dev'));
app.use(express.json());
const PORT = 3000;
const mongoose = require('mongoose');
const cors = require('cors');
app.use(cors());

// Usamos los tres nodos directamente porque la red actual rechaza consultas DNS SRV.
// Es equivalente a la URI mongodb+srv original, pero no depende de _mongodb._tcp.
mongoose.connect("mongodb://grupo:grupo@ac-g89jfcg-shard-00-00.ygegryf.mongodb.net:27017,ac-g89jfcg-shard-00-01.ygegryf.mongodb.net:27017,ac-g89jfcg-shard-00-02.ygegryf.mongodb.net:27017/netflix?ssl=true&replicaSet=atlas-q8azcb-shard-0&authSource=admin&retryWrites=true&w=majority")
.then(()=>{
    console.log("Conectado correctamente a MongoDB");
})
.catch((error)=>{
    console.log("Error al conectar con MongoDB: ", error);
});

const peliculaSchema = new mongoose.Schema(
    {
        titulo: {type: String, required: true},
        genero: {type: String, required: true},
        año: {type: Number, required: true},
        duracion: {type: Number, required: true},
        idioma: {type: String, required: true},
        calificacion: {type: Number, required: true}
    },
    {
        timestamps: true
    }
);

const serieSchema = new mongoose.Schema(
    {
        titulo: {type: String, required: true},
        genero: {type: String, required: true},
        año: {type: Number, required: true},
        temporadas: {type: Number, required: true},
        episodios: {type: Number, required: true},
        idioma: {type: String, required: true},
        calificacion: {type: Number, required: true}
    },
    {
        timestamps: true
    }
);

const Pelicula = mongoose.model("Pelicula", peliculaSchema, "peliculas");

app.get("/peliculas", async (req,res) =>{
    try{
        const peliculas = await Pelicula.find();
        res.json(peliculas);
    }
    catch(error){
        res.status(500).json({
            mensaje: "Error al obtener los datos",
            error: error
        });
    }
});


app.get("/peliculas/:id", async (req,res) =>{
    try{
        const id = req.params.id;
        const pelicula = await Pelicula.findById(id);
        if(!pelicula){
            return res.status(404).json({mensaje: "Pelicula no encontrado"});
        }
        res.json(pelicula);

    }catch(error){
        res.status(500).json({
            mensaje: "Error al obtener los datos",
            error: error
        });
    }
    
});

app.post("/peliculas", async (req,res) =>{
    try{
    const {titulo, genero, año, duracion, idioma, calificacion} = req.body;
    if(!titulo || !genero || !año || !duracion || !idioma || !calificacion){
        return res.status(400).json({mensaje: "Faltan datos del pelicula"});
    }
    const nuevoPelicula = new Pelicula({
        titulo, genero, año, duracion, idioma, calificacion
    });
    const peliculaGuardado = await nuevoPelicula.save();
    res.json({mensaje: "Pelicula registrado correctamente", pelicula: peliculaGuardado});
    
    }catch(error){
        res.status(500).json({
            mensaje: "Error al registrar el pelicula",
            error: error
        });
    }

});

app.put("/peliculas/:id", async (req,res) =>{
    try{
        const id = req.params.id;
        const {titulo, genero, año, duracion, idioma, calificacion} = req.body;

        if(!titulo || !genero || !año || !duracion || !idioma || !calificacion){
            return res.status(400).json({mensaje: "Faltan datos del pelicula"});
        }
        
        const peliculaActualizado = await Pelicula.findByIdAndUpdate(id, 
            {titulo, genero, año, duracion, idioma, calificacion},
            {new: true, runValidators: true}
        )
        if(!peliculaActualizado){
            return res.status(404).json({mensaje: "Pelicula no encontrado"});
        }
        res.json({
            mensaje: "Pelicula actualizado correctamente",
            pelicula: peliculaActualizado
        });

    }catch(error){
        res.status(500).json({
            mensaje: "Error al actualizar el pelicula",
            error: error
        });
    }
    

});

app.delete("/peliculas/:id", async(req,res)=>{
    try{
    const id = req.params.id;
    const peliculaEliminado = await Pelicula.findByIdAndDelete(id);
    if (!peliculaEliminado){
        return res.status(404).json({
            mensaje: "Pelicula no encontrado"
        });
    }
    res.json({
        mensaje: "Pelicula eliminado correctamente",
        pelicula: peliculaEliminado
    });
    }catch(error){
        res.status(500).json({
            mensaje: "Error al eliminar el pelicula",
        });
    }
    
});   


const Serie = mongoose.model("Serie", serieSchema, "series");

app.get("/series", async (req,res) =>{
    try{
        const series = await Serie.find();
        res.json(series);
    }
    catch(error){
        res.status(500).json({
            mensaje: "Error al obtener los datos",
            error: error
        });
    }
});


app.get("/series/:id", async (req,res) =>{
    try{
        const id = req.params.id;
        const serie = await Serie.findById(id);
        if(!serie){
            return res.status(404).json({mensaje: "Serie no encontrado"});
        }
        res.json(serie);

    }catch(error){
        res.status(500).json({
            mensaje: "Error al obtener los datos",
            error: error
        });
    }
    
});

app.post("/series", async (req,res) =>{
    try{
    const {titulo, genero, año, temporadas, episodios, idioma, calificacion} = req.body;
    if(!titulo || !genero || !año || !temporadas || !episodios || !idioma || !calificacion){
        return res.status(400).json({mensaje: "Faltan datos del serie"});
    }
    const nuevaSerie = new Serie({
        titulo, genero, año, temporadas, episodios, idioma, calificacion
    });
    const serieGuardado = await nuevaSerie.save();
    res.json({mensaje: "Serie registrado correctamente", serie: serieGuardado});
    
    }catch(error){
        res.status(500).json({
            mensaje: "Error al registrar el serie",
            error: error
        });
    }

});

app.put("/series/:id", async (req,res) =>{
    try{
        const id = req.params.id;
        const {titulo, genero, año, temporadas, episodios, idioma, calificacion} = req.body;

        if(!titulo || !genero || !año || !temporadas || !episodios || !idioma || !calificacion){
            return res.status(400).json({mensaje: "Faltan datos del serie"});
        }
        
        const serieActualizado = await Serie.findByIdAndUpdate(id, 
            {titulo, genero, año, temporadas, episodios, idioma, calificacion},
            {new: true, runValidators: true}
        )
        if(!serieActualizado){
            return res.status(404).json({mensaje: "Serie no encontrado"});
        }
        res.json({
            mensaje: "Serie actualizado correctamente",
            serie: serieActualizado
        });

    }catch(error){
        res.status(500).json({
            mensaje: "Error al actualizar el serie",
            error: error
        });
    }
    

});

app.delete("/series/:id", async(req,res)=>{
    try{
    const id = req.params.id;
    const serieEliminado = await Serie.findByIdAndDelete(id);
    if (!serieEliminado){
        return res.status(404).json({
            mensaje: "Serie no encontrado"
        });
    }
    res.json({
        mensaje: "Serie eliminado correctamente",
        serie: serieEliminado
    });
    }catch(error){
        res.status(500).json({
            mensaje: "Error al eliminar el serie",
        });
    }
    
});   

app.get("/", (req,res) =>{
    res.send("Bienvenido a la API de Netflix");
});


app.listen(PORT, () => {
  console.log("Servidor iniciado en: http://localhost:"+PORT);
});
