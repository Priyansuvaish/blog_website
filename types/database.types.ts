import { Types } from 'mongoose'

export type Post = {
  _id: Types.ObjectId
  title: string
  slug: string
  content: string
  excerpt: string
  category: string
  readTime: string
  coverImage?: string
  author: Types.ObjectId | User
  createdAt: Date
  updatedAt: Date
}

export interface User {
  _id: Types.ObjectId
  name: string
  email: string
  avatar?: string
}

export interface Comment {
  _id: Types.ObjectId
  content: string
  post: Types.ObjectId
  username: string
  createdAt: Date
  updatedAt: Date
} 