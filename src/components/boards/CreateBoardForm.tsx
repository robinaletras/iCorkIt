'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/contexts/AuthContext'
import { X, MapPin, Users, Lock, Unlock, Search } from 'lucide-react'

interface CreateBoardFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

const boardTypes = [
  { value: 'CITY', label: 'Location Board', icon: MapPin, description: 'Create a board for your city or town' },
  { value: 'SOCIAL', label: 'Social Board', icon: Users, description: 'Create a private community board' }
]

export function CreateBoardForm({ isOpen, onClose, onSuccess }: CreateBoardFormProps) {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'CITY',
    level: 'CITY',
    country: 'United States',
    state: '',
    city: '',
    zipCode: '',
    isPublic: true
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [locationSearch, setLocationSearch] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [showLocationSearch, setShowLocationSearch] = useState(false)

  if (!isOpen) return null

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleTypeChange = (type: string) => {
    setFormData(prev => ({ 
      ...prev, 
      type,
      level: type === 'SOCIAL' ? 'NEIGHBORHOOD' : 'CITY'
    }))
    
    // Reset location fields when switching to social board
    if (type === 'SOCIAL') {
      setFormData(prev => ({
        ...prev,
        state: '',
        city: '',
        zipCode: ''
      }))
    }
  }

  const searchLocation = async () => {
    if (!locationSearch.trim()) return
    
    setIsSearching(true)
    setError('')
    
    try {
      // This would call a real location search API (like Google Places, MapBox, etc.)
      // For now, we'll simulate with mock data
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock search results - in real app, this would come from location API
      const mockResults = [
        { city: 'New York', state: 'NY', zipCode: '10001' },
        { city: 'Los Angeles', state: 'CA', zipCode: '90210' },
        { city: 'Chicago', state: 'IL', zipCode: '60601' }
      ].filter(result => 
        result.city.toLowerCase().includes(locationSearch.toLowerCase()) ||
        result.state.toLowerCase().includes(locationSearch.toLowerCase()) ||
        result.zipCode.includes(locationSearch)
      )
      
      setSearchResults(mockResults)
      setShowLocationSearch(true)
    } catch (error) {
      setError('Failed to search location')
    } finally {
      setIsSearching(false)
    }
  }

  const selectLocation = (result: any) => {
    setFormData(prev => ({
      ...prev,
      city: result.city,
      state: result.state,
      zipCode: result.zipCode
    }))
    setLocationSearch('')
    setSearchResults([])
    setShowLocationSearch(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const token = localStorage.getItem('authToken')
      if (!token) {
        setError('You must be logged in to create a board')
        return
      }

      // Validate location for CITY boards
      if (formData.type === 'CITY' && (!formData.zipCode || !formData.city || !formData.state)) {
        setError('Please search and select a location for your city board')
        setIsLoading(false)
        return
      }

      const response = await fetch('/api/boards/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        onSuccess()
        onClose()
        // Reset form
        setFormData({
          name: '',
          description: '',
          type: 'CITY',
          level: 'CITY',
          country: 'United States',
          state: '',
          city: '',
          zipCode: '',
          isPublic: true
        })
        setLocationSearch('')
        setSearchResults([])
        setShowLocationSearch(false)
      } else {
        setError(data.error || 'Failed to create board')
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
      <div className="relative bg-white rounded-2xl p-8 w-full max-w-2xl mx-4 my-8 max-h-[90vh] overflow-y-auto z-[10000]">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Create Your Board</h2>
          <p className="text-gray-600 mt-2">
            {formData.type === 'CITY' 
              ? 'Create a board for your city or town' 
              : 'Create a private community board'
            }
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Board Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Board Type
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {boardTypes.map((type) => {
                const Icon = type.icon
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => handleTypeChange(type.value)}
                    className={`p-4 border-2 rounded-lg text-left transition-all ${
                      formData.type === type.value
                        ? 'border-amber-500 bg-amber-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-6 h-6 text-amber-600 mb-2" />
                    <h3 className="font-medium text-gray-900">{type.label}</h3>
                    <p className="text-sm text-gray-600">{type.description}</p>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Board Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Board Name *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-black placeholder-gray-500 bg-white"
              placeholder={formData.type === 'CITY' ? 'e.g., Downtown Community Board' : 'e.g., Photography Enthusiasts'}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-black placeholder-gray-500 bg-white"
              placeholder={formData.type === 'CITY' 
                ? 'Describe what this location board is for...' 
                : 'Describe what this social board is for...'
              }
            />
          </div>

          {/* Location Search for CITY boards */}
          {formData.type === 'CITY' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location Search *
              </label>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={locationSearch}
                    onChange={(e) => setLocationSearch(e.target.value)}
                    placeholder="Search by city, state, or ZIP code..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-black placeholder-gray-500 bg-white"
                  />
                </div>
                <Button
                  type="button"
                  onClick={searchLocation}
                  disabled={isSearching || !locationSearch.trim()}
                  className="px-6"
                >
                  {isSearching ? 'Searching...' : 'Search'}
                </Button>
              </div>
              
              {/* Search Results */}
              {showLocationSearch && searchResults.length > 0 && (
                <div className="mt-3 border border-gray-200 rounded-lg max-h-40 overflow-y-auto">
                  {searchResults.map((result, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => selectLocation(result)}
                      className="w-full p-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="font-medium text-gray-900">{result.city}, {result.state}</div>
                      <div className="text-sm text-gray-500">ZIP: {result.zipCode}</div>
                    </button>
                  ))}
                </div>
              )}
              
              {/* Selected Location Display */}
              {formData.city && formData.state && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">
                      Selected: {formData.city}, {formData.state} {formData.zipCode}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Privacy Setting */}
          <div>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="isPublic"
                checked={formData.isPublic}
                onChange={handleChange}
                className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
              />
              <div className="flex items-center space-x-2">
                {formData.isPublic ? <Unlock className="w-4 h-4 text-green-600" /> : <Lock className="w-4 h-4 text-red-600" />}
                <span className="text-sm font-medium text-gray-700">
                  Make this board public
                </span>
              </div>
            </label>
            <p className="text-sm text-gray-500 mt-1">
              {formData.isPublic 
                ? 'Anyone can view and post to this board'
                : 'Only invited members can view and post to this board'
              }
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Submit button */}
          <Button
            type="submit"
            className="w-full py-3"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Board...' : 'Create Board'}
          </Button>
        </form>
      </div>
    </div>
  )
}
