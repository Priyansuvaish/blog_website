import mongoose from 'mongoose'

const commentSchema = new mongoose.Schema({
  content: { type: String, required: true },
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
})

// Add indexes for better query performance
commentSchema.index({ post: 1 })
commentSchema.index({ author: 1 })

const Comment = mongoose.models.Comment || mongoose.model('Comment', commentSchema)

export default Comment 