import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  avatar: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
})

// Add index for email
userSchema.index({ email: 1 }, { unique: true })

const User = mongoose.models.User || mongoose.model('User', userSchema)

export default User 