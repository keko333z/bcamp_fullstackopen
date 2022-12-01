const  mongoose = require("mongoose")

const noteSchema= new mongoose.Schema({
    title: String,
    body: String,
    userId: Number
})
noteSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id
      delete returnedObject._id
      delete returnedObject.__v
    }
  })
const Note= new mongoose.model('Note', noteSchema)



module.exports = Note;