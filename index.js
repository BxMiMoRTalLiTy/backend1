const express = require("express")
const app = express()
app.use(express.json())
const cors = require('cors');
app.use(cors());
app.use(express.static('dist'));

const requestLogger = (request, response, next) => {
    console.log('Method: ',request.method);
    console.log('Path: ',request.path);
    console.log('Body: ',request.body);
    console.log('------------------------------');
    next();
}

app.use(requestLogger)

let notes = [
    {
      id: 1,
      content: "HTML es muy facil",
      important: true
    },
    {
      id: 2,
      content: "Los browsers solo pueden ejecutar codigo JavaScript",
      important: true
    },
    {
      id: 3,
      content: "GET y POST son los metodos mas importantes del protocolo HTTP",
      important: false
    },
    {
      id: 4,
      content: "REACT funciona del lado del cliente",
      important: false
    }
]

// app.get('/', (request, response) => {
//     response.send('<h1>API Rest from Notes</h1>')
// })   //Esto no va debido a que ya tenemos el servicio Web

app.get('/api/notes', (request, response) => {
    response.json(notes);
})

app.get('/api/notes/:id', (request, response) => {
    const id = parseInt(request.params.id) //== Number(request.params.id)
    const note = notes.find( x => x.id === id);
    if(note){
        response.json(note);
    }
    else{
        response.status(404).end();
    }
})

app.post('/api/notes/', (request,response) => {
    if(request.body.content){
        const note = request.body
    
        note.id = notes.length+1;
        notes = notes.concat(note);
        response.json(note)
    } else {
        response.status(400).json({error: 'content is missing'})
    }
    
})

app.delete('/api/notes/:id', (request, response) =>{
    const id = parseInt(request.params.id)
    notes = notes.filter(x => x.id !== id) //Simulando el borrado
    response.status(204).end();
})

const badPath = (request, response, next) => {
    response.status(404).send({error: 'Ruta desconocida'})
}

app.use(badPath)

//Para el proovedor le damos la opcion de escoger el puerto
const PORT = process.env.PORT || 3001;

app.listen(PORT, () =>{
    console.log(`Server Running on port ${PORT}`);
})

