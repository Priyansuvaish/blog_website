import mongoose from 'mongoose'

// Function to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { 
    type: String, 
    unique: true
  },
  content: { type: String, required: true },
  metadata: { type: String, required: true }, // Renamed from excerpt - used for SEO meta description
  category: { type: String, required: true },
  readTime: { type: String, required: true },
  coverImage: { type: String }, // URL for cover image
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

// Pre-save middleware to generate slug from title
postSchema.pre('save', async function(next) {
  if (!this.slug || this.isModified('title')) {
    let baseSlug = generateSlug(this.title)
    let slug = baseSlug
    let counter = 1
    
    // Check if slug already exists and increment counter if needed
    const PostModel = this.constructor as any
    while (await PostModel.findOne({ slug, _id: { $ne: this._id } })) {
      slug = `${baseSlug}-${counter}`
      counter++
    }
    
    this.slug = slug
  }
  next()
})

const Post = mongoose.models.Post || mongoose.model('Post', postSchema)

export default Post 