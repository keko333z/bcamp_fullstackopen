require('./mongo.js')
require ("dotenv").config()
const app = require('./app.js')
const http = require('http')












const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on porto: ${PORT}`)
})



module.exports=app

