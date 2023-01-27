const  mongoose = require("mongoose")

const noteSchema= new mongoose.Schema({
    title: {
      type: String,
      required: true,
      minlenght: 8
    },
    body:{
      type: String,
      required: true,
      minlenght: 10
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    date: Date,
    views: Number,
    likes:  Number
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