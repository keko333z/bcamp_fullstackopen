
const  mongoose = require("mongoose")

const commentSchema= new mongoose.Schema({
    
    body:{
      type: String,
      required: true,
      minlenght: 10
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    note: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Note'
      }, 
    date: Date 
})
commentSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id
      delete returnedObject._id
      delete returnedObject.__v
    }
  })
  
const Comment= new mongoose.model('Comment', commentSchema)



module.exports = Comment;