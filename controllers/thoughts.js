import express from 'express'
import Thought from '../models/Thought.js'

const router = express.Router()


// Get all articles
router.get('/thoughts', async (req, res) => {
    const allThoughts = await Thought.find()
    console.log(allThoughts)
    return res.render('thoughts/index.ejs', {
        thoughts: allThoughts
    })
})

// Show the thought creation site
router.get('/thoughts/new', (req, res) => {
    return res.render('thoughts/new.ejs')
})

// Shows specific thought
router.get('/thoughts/:thoughtId', async (req, res) => {
    const thought = await Thought.findById(req.params.thoughtId)
    return res.render('thoughts/show.ejs', {
        thought
    })
})

// Create a thought
router.post('/thoughts', async (req, res) => {
    try {
        const newThought = await Thought.create(req.body)
        return res.redirect(`/thoughts/${newThought._id}`)
    } catch (error) {
        console.log(error)
    }
})

export default router