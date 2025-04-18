import express from 'express'
import Thought from '../models/Thought.js'

const router = express.Router()


router.get('/thoughts', async (req, res) => {
    const allThoughts = await Thought.find()
    console.log(allThoughts)
    return res.render('thoughts/index.ejs', {
        thoughts: allThoughts
    })
})


router.get('/thoughts/new', (req, res) => {
    return res.render('thoughts/new.ejs')
})


router.get('/thoughts/:thoughtId/edit', async (req,res) => {
    const thought = await Thought.findById(req.params.thoughtId)
    return res.render('thoughts/edit.ejs', {
        thought
    })
})


router.get('/thoughts/:thoughtId', async (req, res) => {
    const thought = await Thought.findById(req.params.thoughtId)
    return res.render('thoughts/show.ejs', {
        thought
    })
})


router.post('/thoughts', async (req, res) => {
    try {
        const newThought = await Thought.create(req.body)
        return res.redirect(`/thoughts/${newThought._id}`)
    } catch (error) {
        console.log(error)
    }
})


router.put('/thoughts/:thoughtId', async (req, res) => {
    try {
        const thoughtId = req.params.thoughtId
        await Thought.findByIdAndUpdate(thoughtId, req.body)
        return res.redirect(`/thoughts/${thoughtId}`)
    } catch (error) {
        console.log(error)
    }
})

export default router