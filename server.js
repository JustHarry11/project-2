import express from 'express'
import morgan from 'morgan'
import mongoose from 'mongoose'
import methodOverride from 'method-override'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import 'dotenv/config'

import passUserToView from './middleware/passUserToView.js'
import thoughtsRouter from './controllers/thoughts.js'
import authRouter from './controllers/auth.js'

// ! Variables
const app = express()
const port = process.env.PORT || 3000

// ! Middleware
app.use(express.urlencoded())
app.use(morgan('dev'))
app.use(express.static('public'))
app.use(methodOverride('_method'))
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    })
}))

app.use(passUserToView)

// ! Routes
app.get('/', (req, res) => {
    return res.render('index.ejs')
})


app.use('/', thoughtsRouter)
app.use('/', authRouter)



// ! 404 Route
app.get('/{*any}', (req, res) => {
    return res.status(404).render('404.ejs')
})

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
