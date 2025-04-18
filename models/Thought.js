import mongoose from 'mongoose'

const thoughtSchema = new mongoose.Schema({
    content: { type: String, required: true},
    categories: [String]
}, {
    timestamps: true
})

const Thought = mongoose.model('Thought', thoughtSchema)
export default Thought