import express from 'express'

const router = express.Router()


// Get all articles
router.get('/thoughts', async (req, res) => {
    return res.render('thoughts/index.ejs')
})

// Create a thought
router.get('/thoughts/new', (req, res) => {
    return res.render('thoughts/new.ejs')
})

router.get('/thoughts/show', (req, res) => {
    return res.render('thoughts/show.ejs')
})

export default router