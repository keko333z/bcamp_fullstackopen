const express = require('express')
const app = express()
const cors = require('cors')


app.use(express.json())
app.use(cors())
app.use(express.static('build'))
let notes = [
    {
    userId: 1,
    id: 1,
    title: "sunt aut facere repellat provident  optio reprehenderit",
    body: "quia et suscipitsuscipit recusandae consequuntur expedita et "
    },
    {
    userId: 1,
    id: 2,
    title: "qui est esse",
    body: "est rerum tempore vitae debitis possimus qui neque nisi nulla"
    },
    {
    userId: 1,
    id: 3,
    title: "ea molestias quasi exercitationem repellat qui ipsa sit aut",
    body: "et iusto sed quo iure porro eius odio et labore et velit aut"
    },
    {
    userId: 1,
    id: 4,
    title: "eum et est occaecati algo",
    body: "ullam et saepe reiciendis quis sunt voluptatem rerum illo velit"
    }
]

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
  response.json(notes)
})
app.get('/info', (request, response) => {
  let resp='<p>There are '+notes.length+' notes</p><p>'+Date()+'</p>';
  response.send(resp)
})

app.get('/api/notes/:id', (request, response) => {
  const id= Number(request.params.id);
  
 const note=notes.find(note => note.id===id)
 if(!note){
  response.status(404).send( "No se encontro la nota").end()
 }
 else {
 response.json(note)
 }
})

app.post('/api/notes', (request, response) => {
  const note=request.body
  const all_id=notes.map((n) => n.id)
  const new_id=Math.max(...all_id)+1
  if(!note.title ||  !note.body){
    response.status(400).json({error: "No se encontro la nota"})
  }else{
  const newNote= { userId: note.userId, id: new_id, title: note.title, body: note.body}
  notes=[...notes, newNote]
  response.json(notes)
}})

app.delete('/api/notes/:id', (request, response) => {
  const id= Number(request.params.id); 
  const note=notes.filter(note => note.id!==id)
  notes=[...note]
  response.status(204).end()

})

const PORT = process.env.PORT || 3002
app.listen(PORT, () => {
  console.log(`Server running on porto: ${PORT}`)
})
