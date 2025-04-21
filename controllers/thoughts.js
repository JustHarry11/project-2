import express from 'express'
import mongoose from 'mongoose'
import Thought from '../models/Thought.js'

const router = express.Router()

// INDEX
router.get('/thoughts', async (req, res) => {
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
router.get('/thoughts/new', (req, res) => {
    try {
        return res.render('thoughts/new.ejs', {
            errorMessage: ''
        })
    } catch (error) {
        console.log(error)
    }
})

// EDIT
router.get('/thoughts/:thoughtId/edit', async (req,res, next) => {
    try {
        if(!mongoose.isValidObjectId(req.params.thoughtId)){
            return next()
        }
        const thought = await Thought.findById(req.params.thoughtId)

        if(!thought){
            return next()
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

        const thought = await Thought.findById(req.params.thoughtId)

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
router.post('/thoughts', async (req, res) => {
    try {
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
router.put('/thoughts/:thoughtId', async (req, res, next) => {
    try {
        const thoughtId = req.params.thoughtId

        if(!mongoose.isValidObjectId(req.params.thoughtId)){
            return next()
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
router.delete('/thoughts/:thoughtsId', async (req, res, next) => {
    try {
        if(!mongoose.isValidObjectId(req.params.thoughtId)){
            return next()
        }
        await Thought.findByIdAndDelete(req.params.thoughtsId)
        return res.redirect('/thoughts')
    } catch (error) {
        console.log(error)
    }
})

export default router