
require ("dotenv").config()
const  mongoose = require("mongoose")

const url="mongodb+srv://keko333z:Hayday1980@cluster0.9vr1lib.mongodb.net/note-app?retryWrites=true&w=majority"
mongoose.connect(url).then(() => console.log("connected")).catch((error)=>console.log("Something went wrong"+error))
/*const noteSchema= new mongoose.Schema({
    title: String,
    body: String,
    userId: Number
})

const Note= new mongoose.model('Note', noteSchema)*/
/*
const newNote= new Note({
    title: "dfg",
    body: "quedfdg hacdgdge",
    userId: 5
})
newNote.save().then(
    response => {console.log(response);
    mongoose.connection.close()}
)
*/

/*Note.find({}).then(
    response => {console.log(response)
    mongoose.connection.close()
    })
    */