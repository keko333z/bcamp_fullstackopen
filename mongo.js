
require ("dotenv").config()
const  mongoose = require("mongoose")

const url=process.env.DB_URI
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