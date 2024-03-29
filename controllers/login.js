require ("../mongo.js")
const bcrypt = require('bcrypt')
require ("dotenv").config()
const { response } = require("express")
const loginRouter = require('express').Router()
const User = require ("../models/User.js")
const jwt= require('jsonwebtoken')




loginRouter.post('/', async (request, response)=>{

    const userdata= request.body
    const user= await User.findOne({username: userdata.username})
    
   const passwOk= user === null ? 
   false : 
   await bcrypt.compare(userdata.password, user.passwordHash)

   if(!(passwOk && user)){
     return response.status(401).json({error :'User or password incorrect'})
   } 
const userForToken= {
    username: user.username,
    id: user.id
} 
const token = jwt.sign(userForToken, process.env.SECRET)
response.send({token: token, name: user.name, username:  user.username, id: user.id, followers: user.followers, following: user.following, password: user.passwordHash, liked: user.liked})

})



module.exports= loginRouter
