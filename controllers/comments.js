import express from 'express'
import mongoose from 'mongoose'
import Thought from '../models/Thought.js'
import isSignedIn from '../middleware/isSignedIn.js'

const router = express.Router()

router.post('/thoughts/:thoughtId/comments', isSignedIn, async(req, res, next) => {
    try {
        if(!mongoose.isValidObjectId(req.params.thoughtId)){
            return next()
        }
        req.body.author = req.session.user._id

        const thought = await Thought.findById(req.params.thoughtId)
        if(!thought){
            return next()
        }

        thought.comments.push(req.body)

        await thought.save()
        return res.redirect(`/thoughts/${thought._id}`)
    } catch (error) {
        console.log(error)
        return res.status(400).render('thoughts/show.ejs', {
            errorMessage: error.message
        })
    }
})

router.delete('/thoughts/:thoughtId/comments/:commentId', isSignedIn, async(req,res, next) => {
    try {
        if(!mongoose.isValidObjectId(req.params.thoughtId)){
            return next()
        }

        const thought = await Thought.findById(req.params.thoughtId)
        if(!thought){
            return next()
        }

        if(!mongoose.isValidObjectId(req.params.commentId)){
            return next()
        }
        const comment = thought.comments.id(req.params.commentId)

        if(!comment.author.equals(req.session.user._id)){
            return res.status(403).send('You are not allowed to access')
        }

        comment.deleteOne()

        await thought.save()
        return res.redirect(`/thoughts/${thought._id}`)
    } catch (error) {
        
    }
})

export default router