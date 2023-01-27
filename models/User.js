const uniqueValidator = require ('mongoose-unique-validator')
const mongoose = require('mongoose')
const mongooseUniqueValidator = require('mongoose-unique-validator')

const userSchema= new mongoose.Schema ({
    
    username: {
      type: String,
      unique: true
    },
    name: String,
    passwordHash: String,
    notes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Note'
          }
    ],
    followers: [{
            _id: false,
            followerUserId: String,
            username: String
    }], 
    following: [{
            _id: false,
            followingUserId: String,
            username: String
    }],
    liked: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Note',
            unique: true
    }
    ]
})

 
userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
      // the passwordHash should not be revealed
      delete returnedObject.passwordHash
    } 
  })
   userSchema.plugin(uniqueValidator)
  const User= new mongoose.model('User', userSchema)

  module.exports = User