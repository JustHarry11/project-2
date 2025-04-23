import mongoose from 'mongoose'
import 'dotenv/config'

import User from '../models/User.js'
import Thought from '../models/Thought.js'

import thoughtData from './data/thought.js'
import userData from './data/user.js'

async function seedData() {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log(`🐢 DB connection established`)

        const deletedUsers = await User.deleteMany()
        console.log(`❌ ${deletedUsers.deletedCount} users deleted from the db`)

        const deletedThoughts = await Thought.deleteMany()
        console.log(`❌ ${deletedThoughts.deletedCount} thoughts deleted from the db`)

        const users = await User.create(userData)
        console.log(`🙋‍♂️ ${users.length} users added to the db`)
        
        const thoughtsWithAuthors = thoughtData.map((thought) => {
            thought.author = users[Math.floor(Math.random() * users.length)]._id
            thought.comments = thought.comments.map((comment) => {
                comment.author = users[Math.floor(Math.random() * users.length)]._id
                return comment
            })
            return thought
        })

        const thoughts = await Thought.create(thoughtsWithAuthors)
        console.log(`📕 ${thoughts.length} thoughts added to the DB`)

        await mongoose.connection.close()


    } catch (error) {
        console.log(error)
        await mongoose.connection.close()
    }
}

seedData()