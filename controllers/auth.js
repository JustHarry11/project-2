import express from 'express'
import bcrypt from 'bcryptjs'
import User from '../models/User.js'

const router = express.Router()
// ! ROUTES
// SIGN UP
router.get('/auth/sign-up', (req, res) => {
    try {
        return res.render('auth/sign-up.ejs', {
            errorMessage: ''
        })
    } catch (error) {
        console.log(error)
    }
})

// SIGN IN
router.get('/auth/sign-in', (req, res) => {
    try {
        return res.render('auth/sign-in.ejs', {
            errorMessage: ''
        })
    } catch (error) {
        console.log(error)
    }
})


// ? CREATE A USER
router.post('/auth/sign-up', async (req, res) => {
    try {
        if(req.body.password !== req.body.passwordConfirm) {
            return res.render('auth/sign-up.ejs', {
                errorMessage: 'Your passwords do not match'
            })
        }

        req.body.password = bcrypt.hashSync(req.body.password, 12)

        const newUser = await User.create(req.body)
        return res.redirect('/auth/sign-in')

    } catch (error) {
        console.log(error)
        if(error.code === 11000) {
            const fieldName = Object.keys(error.keyValue)[0]
            return res.render('auth/sign-up.ejs', {
                errorMessage: `That ${fieldName} already exists`
            })
        }

        return res.render('auth/sign-up.ejs', {
            errorMessage: error.message
        })
    }
})

router.post('/auth/sign-in', async (req, res) => {
    console.log(req.body)
    try {
        const foundUser = await User.findOne({ email: req.body.email })
        
        if (!foundUser) {
            return res.status(401).render('auth/sign-in.ejs' , {
                errorMessage: 'Unauthorized'
            })
        }
        if(!bcrypt.compareSync(req.body.password, foundUser.password)) {
            return res.status(401).render('auth/sign-in.ejs' , {
                errorMessage: 'Unauthorized'
            })
        }

        req.session.user = {
            username: foundUser.username,
            email: foundUser.email,
            _id: foundUser._id
        }

        res.redirect('/thoughts')
    } catch (error) {
        
    }
})

router.get('/auth/sign-out', (req, res) => {
    req.session.destroy(() => {
      res.redirect('/auth/sign-in')
    })
  })
export default router