import mongoose, { Schema, Document } from 'mongoose'

export interface IPost extends Document {
  title: string;
  content: string;
  coverImage: string;
  sections: string[];
  createdAt: Date;
  updatedAt: Date;
  slug: string;
}

const PostSchema: Schema = new Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Content is required']
  },
  coverImage: {
    type: String,
    required: [true, 'Cover image is required']
  },
  sections: [{
    type: String,
    required: [true, 'At least one section is required']
  }],
  slug: {
    type: String,
    required: true,
    unique: true
  }
}, {
  timestamps: true
})

// Create slug from title before saving
PostSchema.pre('save', function(this: IPost, next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]/g, '-')
      .replace(/-+/g, '-')
  }
  next()
})

const Post = mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema)

export default Post 