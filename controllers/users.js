import express from 'express'
import Thought from '../models/Thought.js'
import User from '../models/User.js'
import isSignedIn from '../middleware/isSignedIn.js'

const router = express.Router()

router.get('/profile', isSignedIn, async (req,res) => {
    try {
        const authoredThoughts = await Thought.find({author: req.session.user._id})
        const likedThoughts = await Thought.find({likes: req.session.user._id})
        console.log(authoredThoughts)
        return res.render('users/profile.ejs', {
            authoredThoughts,
            likedThoughts
        })
    } catch (error) {
        console.log(error)
    }
})

export default router