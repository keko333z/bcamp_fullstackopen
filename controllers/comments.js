
require ("../mongo.js")
const express = require('express')
//const  mongoose = require("mongoose")
const commentsRouter = express()
require('dotenv').config()
const jwt= require('jsonwebtoken')
const Note = require ("../models/Note.js")
const User = require("../models/User.js")
const Comment = require("../models/Comment.js")


commentsRouter.get('/userid/:id', async (request, response) => {
  const id =request.params.id
  try{
  const allComments= await Comment.find({user: id})
  response.json(allComments)
  } catch(error){
    console.log("Something went wrong: "+error) 
    response.status(400).end()
  }
})



commentsRouter.get('/', async (request, response) => {
  try{
  const allComments= await Comment.find({}).populate('user', {username:1}) 
  response.json(allComments)
  } catch(error){
    console.log("Something went wrong: "+error) 
    response.status(400).end()
  }
})


commentsRouter.get('/:id', async (request, response) => {
  const id =request.params.id
  try{
  const allComments= await Comment.find({note: id}).populate('user', {username:1}).sort({date: -1}) 
  response.json(allComments)
  } catch(error){
    console.log("Something went wrong: "+error) 
    response.status(400).end()
  }
})

/*
const id= request.params.id;
try{
const comment = await Comment.findById(id)

response.json(comment)
}catch(e){console.log("Something went wrong: "+e);response.status(500).end() }

})*/


commentsRouter.post('/', async (request, response) => {
  const comment=request.body
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
    if(!comment.body){
    response.status(400).json({error: "The comment can't be empty"})
    }else{
    try {
      
      const newComment= new Comment({ user:  comment.user, body: comment.body, note: comment.note, date: new Date()})
      const resp= await newComment.save()
      response.json(resp)
    } catch(e){console.log(`error saving the comment ${e}`)}
  
}}})

/*
commentsRouter.put('/:id', (request, response)=>{
  const id=request.params.id
  const comment=request.body
  /*
  const token=getTokenFrom(request)
  const decodedToken= jwt.verify(token, process.env.SECRET)
  if(!decodedToken || !token){
    response.send('Inexistent or invalid token ')
  }
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
  const newcomment={
    
    body: comment.body,
    
  }
  Comment.findByIdAndUpdate(id, newcomment)
  .then(response => console.log(response))
  .catch((error)=>console.log("error when update;"+error))
}})
*/

commentsRouter.delete('/:id', async (request, response) => {
  const param_id= request.params.id;
  try {
  await Comment.finByIdAndDelete({_id: param_id})
  console.log("record deleted")
  }
  catch(error){
    console.log("something went wrong, error: "+error)
  }

})

module.exports=commentsRouter