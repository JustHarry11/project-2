import express from 'express'
import morgan from 'morgan'
import mongoose from 'mongoose'
import 'dotenv/config'

import thoughtsRouter from './controllers/thoughts.js'

// ! Variables
const app = express()
const port = process.env.PORT || 3000

// ! Middleware
app.use(express.urlencoded())
app.use(morgan('dev'))
app.use(express.static('public'))

// ! Routes
// ? Defined in server.js
// Home page
app.get('/', (req, res) => {
    return res.render('index.ejs')
})



// ? Defined in dedicated controller files
// Thoughts (create, index, show, update, delete)
app.use('/', thoughtsRouter)
// Users (register/login/profile)

// ! Listen
async function startServer(){
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log(`🐻 Database connection established`)
        app.listen(port, () => console.log(`🐢 Server up and running on port ${port}`))
    } catch (error) {
        console.log(error)
    }
}

startServer()
