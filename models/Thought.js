import mongoose, {Schema} from 'mongoose'

const commentSchema = new mongoose.Schema({
    content: {type: String, required: true },
    author: {type: Schema.Types.ObjectId, ref: 'User', required: true }
}, {
    timestamps: true
})

const thoughtSchema = new mongoose.Schema({
    content: { type: String, required: true},
    categories: [String],
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true},
    comments: [commentSchema],
    likes: [{ type: Schema.Types.ObjectId, ref: 'User', required: true}]
}, {
    timestamps: true
})

const Thought = mongoose.model('Thought', thoughtSchema)
export default Thought