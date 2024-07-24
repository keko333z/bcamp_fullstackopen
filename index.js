require('./mongo.js')
require ("dotenv").config()
const app = require('./app.js')













const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`Server running on porto: ${PORT}`)
})



module.exports=app

