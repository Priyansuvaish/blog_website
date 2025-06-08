'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import CategoryIcon from '@/components/CategoryIcon'
import { 
  MdCategory, MdArticle, MdScience, MdSportsSoccer, MdMusicNote, 
  MdMovie, MdPalette, MdFastfood, MdDirectionsCar, MdHome,
  MdWork, MdSchool, MdHealthAndSafety, MdPhoneAndroid, MdShoppingCart,
  MdFlight, MdCamera, MdGames, MdPets, MdEco 
} from 'react-icons/md'

interface Post {
  _id: string
  title: string
  slug: string
}

interface Category {
  _id: string
  name: string
  icon: string
  post_ids: Post[]
  createdAt: string
  updatedAt: string
}

// Icon mapping for the dropdown
const iconOptions = [
  { value: 'MdCategory', icon: MdCategory, label: 'Default Category' },
  { value: 'MdArticle', icon: MdArticle, label: 'Articles' },
  { value: 'MdScience', icon: MdScience, label: 'Science' },
  { value: 'MdSportsSoccer', icon: MdSportsSoccer, label: 'Sports' },
  { value: 'MdMusicNote', icon: MdMusicNote, label: 'Music' },
  { value: 'MdMovie', icon: MdMovie, label: 'Movies' },
  { value: 'MdPalette', icon: MdPalette, label: 'Art & Design' },
  { value: 'MdFastfood', icon: MdFastfood, label: 'Food' },
  { value: 'MdDirectionsCar', icon: MdDirectionsCar, label: 'Automotive' },
  { value: 'MdHome', icon: MdHome, label: 'Home & Garden' },
  { value: 'MdWork', icon: MdWork, label: 'Business' },
  { value: 'MdSchool', icon: MdSchool, label: 'Education' },
  { value: 'MdHealthAndSafety', icon: MdHealthAndSafety, label: 'Health' },
  { value: 'MdPhoneAndroid', icon: MdPhoneAndroid, label: 'Technology' },
  { value: 'MdShoppingCart', icon: MdShoppingCart, label: 'Shopping' },
  { value: 'MdFlight', icon: MdFlight, label: 'Travel' },
  { value: 'MdCamera', icon: MdCamera, label: 'Photography' },
  { value: 'MdGames', icon: MdGames, label: 'Gaming' },
  { value: 'MdPets', icon: MdPets, label: 'Pets' },
  { value: 'MdEco', icon: MdEco, label: 'Environment' }
]

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({ name: '', icon: 'MdCategory', post_ids: [] as string[] })
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const router = useRouter()

  // Fetch categories and posts
  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const [categoriesRes, postsRes] = await Promise.all([
        fetch('/api/categories'),
        fetch('/api/posts')
      ])

      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json()
        setCategories(categoriesData)
      }

      if (postsRes.ok) {
        const postsData = await postsRes.json()
        setPosts(postsData)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      setError('Failed to load data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      setError('Category name is required')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const method = editingCategory ? 'PUT' : 'POST'
      const url = editingCategory ? `/api/categories/${editingCategory._id}` : '/api/categories'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        await fetchData()
        resetForm()
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to save category')
      }
    } catch (error) {
      console.error('Error saving category:', error)
      setError('Failed to save category')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (categoryId: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return

    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchData()
      } else {
        setError('Failed to delete category')
      }
    } catch (error) {
      console.error('Error deleting category:', error)
      setError('Failed to delete category')
    }
  }

  const resetForm = () => {
    setFormData({ name: '', icon: 'MdCategory', post_ids: [] })
    setEditingCategory(null)
    setShowCreateForm(false)
    setError(null)
  }

  const startEdit = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      icon: category.icon || 'MdCategory',
      post_ids: category.post_ids.map(post => post._id)
    })
    setShowCreateForm(true)
    setError(null)
  }

  const handlePostToggle = (postId: string) => {
    setFormData(prev => ({
      ...prev,
      post_ids: prev.post_ids.includes(postId)
        ? prev.post_ids.filter(id => id !== postId)
        : [...prev.post_ids, postId]
    }))
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Categories</h1>
        <button
          onClick={() => setShowCreateForm(true)}
          className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800"
        >
          Create Category
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Create/Edit Form */}
      {showCreateForm && (
        <div className="mb-8 p-6 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">
            {editingCategory ? 'Edit Category' : 'Create New Category'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Category Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="icon" className="block text-sm font-medium text-gray-700 mb-2">
                Category Icon
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 p-4 border rounded-lg bg-white max-h-60 overflow-y-auto">
                {iconOptions.map((option) => {
                  const IconComponent = option.icon
                  return (
                    <div
                      key={option.value}
                      onClick={() => setFormData(prev => ({ ...prev, icon: option.value }))}
                      className={`flex flex-col items-center p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                        formData.icon === option.value
                          ? 'bg-blue-100 border-2 border-blue-500 text-blue-700'
                          : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <IconComponent className="text-2xl mb-1" />
                      <span className="text-xs text-center">{option.label}</span>
                    </div>
                  )
                })}
              </div>
              <p className="text-sm text-gray-500 mt-1">Click on an icon to select it for your category</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Posts for this Category
              </label>
              <div className="max-h-60 overflow-y-auto border rounded-md p-4 bg-white">
                {posts.length === 0 ? (
                  <p className="text-gray-500">No posts available</p>
                ) : (
                  posts.map(post => (
                    <div key={post._id} className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        id={`post-${post._id}`}
                        checked={formData.post_ids.includes(post._id)}
                        onChange={() => handlePostToggle(post._id)}
                        className="mr-2"
                      />
                      <label htmlFor={`post-${post._id}`} className="text-sm">
                        {post.title}
                      </label>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : editingCategory ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories List */}
      <div className="space-y-4">
        {categories.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No categories found</p>
        ) : (
          categories.map(category => (
            <div key={category._id} className="bg-white p-6 rounded-lg shadow border">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <CategoryIcon 
                      iconName={category.icon || 'MdCategory'} 
                      className="w-5 h-5 text-white" 
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{category.name}</h3>
                    <p className="text-sm text-gray-500">
                      {category.post_ids.length} post{category.post_ids.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => startEdit(category)}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(category._id)}
                    className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              {category.post_ids.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Posts in this category:</h4>
                  <div className="flex flex-wrap gap-2">
                    {category.post_ids.map(post => (
                      <span
                        key={post._id}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                      >
                        {post.title}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
} 