require ("../mongo")
const express = require('express')
const  mongoose = require("mongoose")
const notesRouter = express()
require('dotenv').config()
const jwt= require('jsonwebtoken')
const Note = require ("../models/Note")
const User = require("../models/User")



notesRouter.get('/', async (request, response) => {
  try{
  const allNotes= await Note.find({}).populate('user', {username:1, name:1})
  response.json(allNotes)
  } catch(error){
    console.log("Something went wrong: "+error) 
    response.status(400).end()
  }
  /*
  .then(notes =>response.json(notes))
  .catch((error)=>{
    console.log("Something went wrong: "+error) 
    response.status(400).end()})*/
})



notesRouter.get('/:id', (request, response) => {
const id= request.params.id;
Note.findById(id)
.then(note=>response.json(note))
.catch((error)=>{console.log("Something went wrong: "+error)
response.status(500).end()})

 /*const note=notes.find(note => note.id===id)
 if(!note){
  response.status(404).send( "No se encontro la nota").end()
 }
 else {
 response.json(note)
 }*/
})


notesRouter.post('/', async (request, response) => {
  const note=request.body
  const aut=request.get('Authorization')
  let token=null
  
  if(aut && aut.toLowerCase().startsWith('bearer')){
    token=aut.substring(7) 
    
  }
    const decodedToken= jwt.verify(token, process.env.SECRET)

  if(!decodedToken || !token){
    response.send('Inexistent or invalid token ')
  }
  else {
    if(!note.title ||  !note.body){
    response.status(400).json({error: "No se encontro la nota"})
    }else{
    try {const user= await User.findById(decodedToken.id)
    const newNote= new Note({ user: user.id, title: note.title, body: note.body})
    const resp= await newNote.save()
    user.notes=user.notes.concat(resp.id)
    const userconid=user.save()
    response.json(resp)
    } catch(e){console.log(`error saving the note ${e}`)}
  
    /*.then(note =>{response.json(note);console.log(response); response.end()})
    .catch(error=>console.log(error))*/
  
}}})

notesRouter.put('/:id', (request, response)=>{
  const id=request.params.id
  const note=request.body
  const token=getTokenFrom(request)
  const decodedToken= jwt.verify(token, process.env.SECRET)
  if(!decodedToken || !token){
    response.send('Inexistent or invalid token ')
  }
  else {
  const newNote={
    title: note.title,
    body: note.body
  }
  Note.findByIdAndUpdate(id, newNote)
  .then(response => console.log(response))
  .catch((error)=>console.log(error))
}})

notesRouter.delete('/:id', (request, response) => {
  const param_id= request.params.id;
  Note.deleteOne({_id: param_id})
  .then(console.log("record deleted"))
  .catch((error)=>console.log("something went wrong, error: "+error))
  /* const id= Number(request.params.id); 
  const note=notes.filter(note => note.id!==id)
  notes=[...note]
  response.status(204).end()*/ 

})
module.exports=notesRouter