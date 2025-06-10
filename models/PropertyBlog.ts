import mongoose from 'mongoose'

// Function to generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

const propertyBlogSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { 
    type: String, 
    unique: true
  },
  hero_image: { type: String, required: true }, // URL for hero image
  sub_images: [{ type: String }], // Array of image URLs
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

// Pre-save middleware to generate slug from name
propertyBlogSchema.pre('save', async function(next) {
  if (!this.slug || this.isModified('name')) {
    let baseSlug = generateSlug(this.name)
    let slug = baseSlug
    let counter = 1
    
    // Check if slug already exists and increment counter if needed
    const PropertyBlogModel = this.constructor as any
    while (await PropertyBlogModel.findOne({ slug, _id: { $ne: this._id } })) {
      slug = `${baseSlug}-${counter}`
      counter++
    }
    
    this.slug = slug
  }
  
  // Update the updatedAt field on save
  this.updatedAt = new Date()
  next()
})

const PropertyBlog = mongoose.models.PropertyBlog || mongoose.model('PropertyBlog', propertyBlogSchema)

export default PropertyBlog 