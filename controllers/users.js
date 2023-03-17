
require ("../mongo.js")
const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require ("../models/User.js")
const jwt= require('jsonwebtoken')




usersRouter.get('/', async(request, response) => {
  try {
  const userinfo= await User.find({}).populate('notes',{title:1, body:1})
  response.json(userinfo)
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

usersRouter.get('/:id', async(request, response) => {
const id= request.params.id;
try {
  const userInfo= await User.findById(id)
    .populate('notes',{title:1, views:1, likes:1, date: 1})
    
  response.json(userInfo)
}
catch(error)
  { 
  console.log("Something went wrong: "+error)
  response.status(500).end()
}
})

 /*const note=notes.find(note => note.id===id)
 if(!note){
  response.status(404).send( "No se encontro la nota").end()
 }
 else {
 response.json(note)
 }*/


usersRouter.post('/', async (request, response) => {
    
    const user=request.body
    const saltRounds=10
    const passwordHash= await (bcrypt.hash(user.passwordHash,saltRounds))
    const newUser= new User({  username: user.username, name: user.name, passwordHash: passwordHash, notes: user.notes, followers:user.followers, following: user.following, liked: []})
    try {const resp= await newUser.save()
    response.json(resp)
    }catch(error){
      response.send("Something went wrong "+error)
    }
    
   
    /*.then(note =>{response.json(note);console.log(response); response.end()})
    .catch(error=>console.log(error))*/ 
})

usersRouter.put('/:id', async (request, response)=>{ 
  const id=request.params.id
  const user=request.body
 /* const saltRounds=10
  const passwordHash= await (bcrypt.hash(user.passwordHash,saltRounds))
  console.log(passwordHash)*/
  const newUser={
    username: user.username,
    name: user.name,
    //passwordHash: passwordHash,
    
    followers: user.followers,
    following: user.following,
    liked: user.liked
  }
  const resp= await User.findByIdAndUpdate(id, newUser,{ new: true })
  const userForToken= {
    username: user.username,
    id: user.id
  } 
  const token = jwt.sign(userForToken, process.env.SECRET)
 
  response.json({token: token, name: resp.name, username:  resp.username, id: resp.id, followers: resp.followers, following: resp.following, password: resp.passwordHash, liked: resp.liked}) 
})

usersRouter.delete('/:id', (request, response) => {
  const param_id= request.params.id;
  User.deleteOne({id: param_id})
  .then(console.log("user deleted"))
  .catch((error)=>console.log("something went wrong, error: "+error))
  /* const id= Number(request.params.id); 
  const note=notes.filter(note => note.id!==id)
  notes=[...note]
  response.status(204).end()*/

})
module.exports=usersRouter