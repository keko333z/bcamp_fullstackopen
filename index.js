require ("./mongo")
require ("dotenv").config()
const express = require('express')
const app = express()
const cors = require('cors')
const Note = require ("./models/Note")

app.use(express.json())
app.use(cors())
app.use(express.static('build'))
let notes = []

app.get('/', (request, response) => {
  response.send('<h1>Hello there!</h1>')
})

app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes =>response.json(notes))
})

app.get('/info', (request, response) => {
  let resp='<p>There are '+notes.length+' notes</p><p>'+Date()+'</p>';
  response.send(resp)
})

app.get('/api/notes/:id', (request, response) => {
const id= request.params.id;
Note.findById(id).then(note=>response.json(note))

 /*const note=notes.find(note => note.id===id)
 if(!note){
  response.status(404).send( "No se encontro la nota").end()
 }
 else {
 response.json(note)
 }*/
})

app.post('/api/notes', (request, response) => {
  const note=request.body
 // const all_id=notes.map((n) => n.id)
 // const new_id=Math.max(...all_id)+1
  if(!note.title ||  !note.body){
    response.status(400).json({error: "No se encontro la nota"})
  }else{
  const newNote= new Note({ userId: note.userId, title: note.title, body: note.body})
  newNote.save().then(note =>response.json(note)) 
  
}})

app.delete('/api/notes/:id', (request, response) => {
  const param_id= request.params.id;
  Note.deleteOne({id: param_id}).then(console.log("record deleted")).catch((error)=>console.log("something went wrong, error: "+error))
  /* const id= Number(request.params.id); 
  const note=notes.filter(note => note.id!==id)
  notes=[...note]
  response.status(204).end()*/

})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on porto: ${PORT}`)
})
