import mongoose from 'mongoose'

const commentSchema = new mongoose.Schema({
  content: { type: String, required: true },
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  // Auto-generated username (stored in localStorage)
  username: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
})

// Add indexes for better query performance
commentSchema.index({ post: 1 })
commentSchema.index({ username: 1 })
commentSchema.index({ createdAt: -1 })

const Comment = mongoose.models.Comment || mongoose.model('Comment', commentSchema)

export default Comment 