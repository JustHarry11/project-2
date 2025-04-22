import express from 'express'
import mongoose from 'mongoose'
import Thought from '../models/Thought.js'
import isSignedIn from '../middleware/isSignedIn.js'

const router = express.Router()

// INDEX
router.get('/thoughts',  async (req, res) => {
    try {
        const allThoughts = await Thought.find()
        console.log(allThoughts)
        return res.render('thoughts/index.ejs', {
            thoughts: allThoughts
        })
    } catch (error) {
        console.log(error)
    }
})

// NEW
router.get('/thoughts/new',isSignedIn, (req, res) => {
    try {
        return res.render('thoughts/new.ejs', {
            errorMessage: ''
        })
    } catch (error) {
        console.log(error)
    }
})

// EDIT
router.get('/thoughts/:thoughtId/edit', isSignedIn, async (req,res, next) => {
    try {
        if(!mongoose.isValidObjectId(req.params.thoughtId)){
            return next()
        }
        const thought = await Thought.findById(req.params.thoughtId)

        if(!thought){
            return next()
        }

        if(!thought.author.equals(req.session.user._id)){
            return res.redirect(`/thoughts/${thought._id}`)
        }
        return res.render('thoughts/edit.ejs', {
            thought
        })
    } catch (error) {
        console.log(error)
    }
})

// SHOW
router.get('/thoughts/:thoughtId', async (req, res, next) => {
    try {
        if(!mongoose.isValidObjectId(req.params.thoughtId)){
            return next()
        }

        const thought = await Thought.findById(req.params.thoughtId).populate('author')

        if(!thought){
            return next()
        }
        return res.render('thoughts/show.ejs', {
            thought
        })
    } catch (error) {
        console.log(error)
    }
})

// ! DONT RENDER A WEB PAGE
// CREATE
router.post('/thoughts', isSignedIn, async (req, res) => {
    try {
        req.body.author = req.session.user._id

        const newThought = await Thought.create(req.body)
        return res.redirect(`/thoughts/${newThought._id}`)
    } catch (error) {
        console.log(error.message)
        return res.render('thoughts/new.ejs', {
            errorMessage: error.message
        })
    }
})

// UPDATE
router.put('/thoughts/:thoughtId', isSignedIn, async (req, res, next) => {
    try {
        const thoughtId = req.params.thoughtId

        if(!mongoose.isValidObjectId(req.params.thoughtId)){
            return next()
        }
        const thought = await Thought.findById(thoughtId)
        const loggedInUserId = req.session.user._id
        const thoughtAuthor = thought.author
        if(!thoughtAuthor.equals(loggedInUserId)){
            return res.status(403).render('/404.ejs')
        }
        
        const updatedThought = await Thought.findByIdAndUpdate(thoughtId, req.body)

        if(!updatedThought){
            return next()
        }
        return res.redirect(`/thoughts/${thoughtId}`)
    } catch (error) {
        console.log(error)
    }
})

// DELETE
router.delete('/thoughts/:thoughtId', isSignedIn, async (req, res, next) => {
    try {
        if(!mongoose.isValidObjectId(req.params.thoughtId)){
            return next()
        }
        await Thought.findByIdAndDelete(req.params.thoughtId)
        return res.redirect('/thoughts')
    } catch (error) {
        console.log(error)
    }
})

router.post('/thoughts/:thoughtId/like', isSignedIn, async (req, res, next) => {
    try {
        if(!mongoose.isValidObjectId(req.params.thoughtId)){
            return next()
        }

        const thought = await Thought.findById(req.params.thoughtId)
        const alreadyLiked = thought.likes.find(userId => userId.equals(req.session.user._id))

        if(!alreadyLiked) {
            thought.likes.push(req.session.user._id)
        }

        await thought.save()

        return res.redirect(`/thoughts/${thought._id}`)

    } catch (error) {
        console.log(error)
    }
})

router.delete('/thoughts/:thoughtId/like', isSignedIn, async (req, res, next) => {
    try {
        if(!mongoose.isValidObjectId(req.params.thoughtId)){
            return next()
        }

        const thought = await Thought.findById(req.params.thoughtId)
        const alreadyLiked = thought.likes.find(userId => userId.equals(req.session.user._id))

        if(alreadyLiked) {
            thought.likes.pull(req.session.user._id)
        }

        await thought.save()

        return res.redirect(`/thoughts/${thought._id}`)

    } catch (error) {
        console.log(error)
    }
})


export default router