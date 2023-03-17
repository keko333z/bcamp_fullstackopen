

require ("../mongo.js")
const express = require('express')
const  mongoose = require("mongoose")
const notesRouter = express()
require('dotenv').config()
const jwt= require('jsonwebtoken')
const Note = require ("../models/Note.js")
const User = require("../models/User.js")
const Comment = require("../models/Comment.js")


notesRouter.get ('/viewed', async (request, response) => {
  try{
  const allNotes= await Note.find({}).sort({views:-1}).limit(10) //tendria que eliminar el body al cargar todas porq se hace muy pesado
  response.json(allNotes)
  } catch(error){
    console.log("Something went wrong: "+error) 
    response.status(400).end()
  }})

notesRouter.get('/', async (request, response) => {
  try{
  const allNotes= await Note.find({}).populate('user', {username:1, name:1}) //tendria que eliminar el body al cargar todas porq se hace muy pesado
  response.json(allNotes)
  } catch(error){
    console.log("Something went wrong: "+error) 
    response.status(400).end()
  }

})


notesRouter.get('/:id', async (request, response) => {
const id= request.params.id;
try{
const note = await Note.findById(id)
const addView= note.views+=1
const newNote = new Note({_id:id, user: note.user, title: note.title, body: note.body, views: addView, likes: note.likes, date: note.date})
const resp= await Note.findByIdAndUpdate(id, newNote)
response.json(resp)
}catch(e){console.log("Something went wrong: "+e);response.status(500).end() }

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
  else 
    {
    if(!note.title ||  !note.body){
    response.status(400).json({error: "No se encontro la nota"})
    }else{
    try {
      const user= await User.findById(decodedToken.id)
      const newNote= new Note({ user:  user.id, title: note.title, body: note.body, views: 0, likes: 0, date: new Date()})
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
  /*
  const token=getTokenFrom(request)
  const decodedToken= jwt.verify(token, process.env.SECRET)
  if(!decodedToken || !token){
    response.send('Inexistent or invalid token ')
  }*/
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
  const newNote={
    title: note.title,
    body: note.body,
    views: note.views,
    likes: note.likes
  }
  Note.findByIdAndUpdate(id, newNote)
  .catch((error)=>console.log("error when update;"+error))
}})


notesRouter.delete('/:id', async (request, response) => {
  const param_id= request.params.id;
  try {
  const note= await Note.findById(param_id)
  const user= await User.findById(note.user.toString())
  const newUserNotesArray= user.notes.filter(note=> note.toString()!==param_id)
  user.notes=newUserNotesArray
  user.save()
  await Note.deleteOne({_id: param_id})
  const deletedCount= await Comment.deleteMany({note: param_id})
  console.log(deletedCount.deletedCount+" comments deleted")
  console.log("record deleted")
  }
  catch(error){
    console.log("something went wrong, error: "+error)
  }
  /* const id= Number(request.params.id); 
  const note=notes.filter(note => note.id!==id)
  notes=[...note]
  response.status(204).end()*/ 

})
module.exports=notesRouter
