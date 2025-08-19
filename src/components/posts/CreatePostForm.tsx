'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/contexts/AuthContext'
import { X, Type, MapPin, Tag, Image, Paperclip, Calendar, AlertCircle, Phone, Mail } from 'lucide-react'

interface CreatePostFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  boardId?: string
  socialBoardId?: string
  boardName?: string
}

const postTypes = [
  { value: 'ADVERTISEMENT', label: 'Advertisement', description: 'Promote your business or service' },
  { value: 'SOCIAL', label: 'Social', description: 'Share community news and updates' },
  { value: 'SERVICE', label: 'Service', description: 'Offer or request services' },
  { value: 'ANNOUNCEMENT', label: 'Announcement', description: 'Important community announcements' },
  { value: 'EVENT', label: 'Event', description: 'Upcoming events and gatherings' },
  { value: 'LOST_FOUND', label: 'Lost & Found', description: 'Lost pets, items, or found objects' },
  { value: 'OTHER', label: 'Other', description: 'Miscellaneous community content' }
]

const categories = [
  'Business', 'Community', 'Education', 'Entertainment', 'Food & Dining',
  'Health & Fitness', 'Home & Garden', 'Pets', 'Real Estate', 'Shopping',
  'Sports & Recreation', 'Technology', 'Transportation', 'Other'
]

export function CreatePostForm({ isOpen, onClose, onSuccess, boardId, socialBoardId, boardName }: CreatePostFormProps) {
  const { user } = useAuth()
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'SOCIAL',
    category: '',
    location: '',
    tags: [] as string[]
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    if (name === 'tags') {
      // Convert comma-separated string to array
      const tagsArray = value.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag.length > 0)
      setFormData(prev => ({ ...prev, [name]: tagsArray }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const token = localStorage.getItem('authToken')
      if (!token) {
        setError('You must be logged in to create a post')
        return
      }

      // Tags are already an array, no need to split
      const tags = formData.tags

      // ALWAYS include boardId - posts go to the board you're currently on
      const postData: any = {
        title: formData.title,
        content: formData.content,
        type: formData.type,
        category: formData.category,
        location: formData.location,
        tags,
        boardId: boardId // Always include the current board ID
      }

      console.log('Submitting post data:', postData)

      const response = await fetch('/api/posts/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(postData)
      })

      const data = await response.json()

      if (response.ok) {
        console.log('Post created successfully, calling onSuccess')
        onSuccess()
        onClose()
        // Reset form
        setFormData({
          title: '',
          content: '',
          type: 'SOCIAL',
          category: '',
          location: '',
          tags: []
        })
      } else {
        console.log('Post creation failed:', data.error)
        setError(data.error || 'Failed to create post')
      }
    } catch (error) {
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center overflow-y-auto">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl p-8 w-full max-w-3xl mx-4 my-8 max-h-[90vh] overflow-y-auto z-[10000]">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Create a New Post</h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Post Type */}
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
              Post Type *
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-black bg-white"
              required
            >
              {postTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label} - {type.description}
                </option>
              ))}
            </select>
            <p className="text-sm text-gray-500 mt-1">
              Post type is just a category - your post will appear on the current board
            </p>
          </div>

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-black placeholder-gray-500 bg-white"
              placeholder="Enter a descriptive title for your post"
              required
            />
          </div>

          {/* Content */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              Content *
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-black placeholder-gray-500 bg-white"
              placeholder="Share your message, announcement, or offer..."
              required
            />
          </div>

          {/* Category and Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-black bg-white"
              >
                <option value="" className="text-black">Select a category (optional)</option>
                {categories.map((category) => (
                  <option key={category} value={category} className="text-black">
                    {category}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  id="location"
                  name="location"
                  type="text"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-black placeholder-gray-500 bg-white"
                  placeholder="City, neighborhood, or area (optional)"
                />
              </div>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                id="tags"
                name="tags"
                type="text"
                value={formData.tags.join(', ')}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-black placeholder-gray-500 bg-white"
                placeholder="Enter tags separated by commas (optional)"
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Tags help others find your post. Separate multiple tags with commas. This field is optional.
            </p>
          </div>

          {/* Media Section */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Image className="w-5 h-5 mr-2 text-amber-600" />
              Media & Attachments (Coming Soon)
            </h3>
            
            {/* Image Upload Placeholder */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Images
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Image className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Image upload functionality coming soon!</p>
              </div>
            </div>

            {/* File Attachments Placeholder */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                File Attachments
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Paperclip className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">File attachment functionality coming soon!</p>
              </div>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-4 h-4 mr-2" />
              {error}
            </div>
          )}

          {/* Submit button */}
          <Button
            type="submit"
            className="w-full py-3"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Post...' : 'Create Post'}
          </Button>
        </form>
      </div>
    </div>
  )
}
