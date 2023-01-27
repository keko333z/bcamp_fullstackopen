require('./mongo.js')
require ("dotenv").config()
const express = require('express')
const app = express()
const cors = require('cors')
const notesRouter=require('./controllers/notes.js')
const usersRouter=require('./controllers/users.js')
const loginRouter=require('./controllers/login.js')
const bodyParser = require('body-parser');



// Express 4.0
app.use(bodyParser.json({ limit: '2mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '2mb' }));



app.use(express.json())
app.use(cors())
app.use(express.static('build'))

app.get('/', (request, response) => {
    response.send('<h1>Hello there!</h1>')
  })

app.get('/info', (request, response) => {
    let resp='<p>There are '+notes.length+' notes</p><p>'+Date()+'</p>';
    response.send(resp)
})


app.use('/api/notes',notesRouter)
app.use('/api/users',usersRouter)
app.use('/api/login',loginRouter)
module.exports = app