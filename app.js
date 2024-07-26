require('./mongo.js')
require ("dotenv").config()
const express = require('express')
const app = express()
const cors = require('cors')
const notesRouter=require('./controllers/notes.js')
const usersRouter=require('./controllers/users.js')
const loginRouter=require('./controllers/login.js')
const bodyParser = require('body-parser');
const commentsRouter = require('./controllers/comments.js')
const Note = require ('./models/Note.js')
const User = require ('./models/User.js')
const Comment = require ('./models/Comment.js')
const path = require('path')
const { GraphQLScalarType } = require ('graphql')
const { ApolloServer, gql, UserInputError } = require('apollo-server-express');







  const typeDefs= gql`

    type User { 
      username: String!
      name: String!
      passwordHash: String,
      notes: [Note],
      followers: [String], 
      following: [String],
      liked: [String]   
    }
    type Comment { 
      id: String
      user: String
      body: String
      date: String
      note: String
       noteId: String 
    }
    type Note {
      id: ID
      title: String
      body: String
      user: String
      date: String
      views: Int
      likes: Int
    }
    type Query {
        mostViewed: [Note]
        mostLiked: [Note]
        allComments (userid: String!): [Comment]
        allPosts: [Note]

    }

    type Mutation {

      deleteComment (id: String!): Comment 
    }
    ` 

const resolvers= {

    Query: {
      
      allPosts: async ()=>{  const resp = await Note.find({}).populate('user', {username:1});
      
      const respcdate= resp.map((obj) => 
       { 
        const date =obj.date.toString().substring(0, 15); 
       
        return newObj = {id: obj.id, user: obj.user.username, date: date, body: obj.body, title: obj.title, views: obj.views, likes: obj.likes}
      })
      return respcdate
        
      },

      mostViewed: async ()=>{  const resp = await Note.find({}).sort({views:-1}).limit(5).populate('user', {username:1});
      
      const respcdate= resp.map((obj) => 
       { 
        const date =obj.date.toString().substring(0, 15); 
       
        return newObj = {id: obj.id, user: obj.user.username, date: date, body: obj.body, title: obj.title, views: obj.views, likes: obj.likes}
      })
      return respcdate
        
      },


      mostLiked: async ()=>{  const resp = await Note.find({}).sort({likes:-1}).limit(5).populate('user', {username:1});
      
      const respcdate= resp.map((obj) => 
       { 
        
        const date =obj.date.toString().substring(0, 15); 
        return newObj = {id: obj.id, user: obj.user.username, date: date, body: obj.body, title: obj.title, views: obj.views, likes: obj.likes}
      })
      return respcdate
    },

    allComments: async (root, args)=>{  const resp = await Comment.find({user: args.userid}).populate('note', {title:1, id:1});
      
    const respcdate= resp.map((obj) => 
       { 
        const date =obj.date.toString().substring(0, 15); 
        return newObj = {id: obj.id, user: obj.user, date: date, body: obj.body, note: obj?.note?.title, noteId: obj?.note?.id}
      })   
      
      return respcdate
    },

    
  
    },
    
   Mutation: {
    deleteComment: async (root,args)=>{ 
        try 
                    { 
                      const resp = await Comment.findByIdAndDelete(args.id); 
                      const date =resp.date.toString().substring(0, 15);
                      return newObj = {id: resp.id, user: resp.user, date: date, body: resp.body, note: resp.note}
                    } catch (error) 
                    { 
                     
                     throw new UserInputError(error, {invalidArgs: args})
                    
                    }
     
    },
   }
  }
   







// Express 4.0
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));



app.use(express.json()) //middleware que transforma la req.body a un json
app.use(cors())
app.use(express.static('build'))

/*app.use('/*', express.static(path.join(__dirname, 'build')))*/

app.use('/api/notes',notesRouter)
app.use('/api/users',usersRouter)
app.use('/api/login',loginRouter)
app.use('/api/comments',commentsRouter)

async function startServer() {
  apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({ app });
}

startServer();

module.exports = app