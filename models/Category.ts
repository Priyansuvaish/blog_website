import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true
  },
  post_ids: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Post' 
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

// Pre-save middleware to update updatedAt
categorySchema.pre('save', function(next) {
  this.updatedAt = new Date()
  next()
})

const Category = mongoose.models.Category || mongoose.model('Category', categorySchema)

export default Category 