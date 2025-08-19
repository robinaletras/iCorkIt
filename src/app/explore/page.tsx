'use client'

import { useState, useEffect } from 'react'
import { Search, MapPin, Users, Calendar, Star, Lock, Globe, Building2, Filter, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

interface Board {
  id: string
  name: string
  type: 'NATIONAL' | 'STATE' | 'CITY'
  description: string | null
  isPrivate: boolean
  city: string | null
  state: string | null
  zipCode: string | null
  country: string
  isApproved: boolean
  createdAt: string
  updatedAt: string
  // Additional fields from API transformation
  postCount?: number
  memberCount?: number
  location?: string
  tags?: string[]
  featured?: boolean
  lastActivity?: string
  slug?: string
}

interface City {
  id: string
  name: string
  state: string
  postCount: number
}

export default function ExplorePage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedLocation, setSelectedLocation] = useState('all')
  const [boards, setBoards] = useState<Board[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [loading, setLoading] = useState(true)
  const [searchResults, setSearchResults] = useState<Board[]>([])
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    fetchBoards()
    fetchCities()
  }, [])

  const fetchBoards = async () => {
    try {
      const response = await fetch('/api/boards')
      if (response.ok) {
        const data = await response.json()
        setBoards(data.boards)
      }
    } catch (error) {
      console.error('Error fetching boards:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCities = async () => {
    try {
      const response = await fetch('/api/cities')
      if (response.ok) {
        const data = await response.json()
        setCities(data.cities)
      }
    } catch (error) {
      console.error('Error fetching cities:', error)
    }
  }

  const boardTypes = ['all', 'NATIONAL', 'STATE', 'CITY']
  
  // Build locations array from database cities + hardcoded states
  const locations = [
    'all',
    // States
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
    'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
    'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana',
    'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina',
    'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina',
    'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
    'Wisconsin', 'Wyoming',
    // Cities from database
    ...cities.map(city => `${city.name}, ${city.state}`)
  ]

  // Unified search function
  const handleSearch = () => {
    setIsSearching(true)
    
    // Split search terms (e.g., "Dallas Texas" becomes ["Dallas", "Texas"])
    const searchTerms = searchTerm.toLowerCase().split(/\s+/).filter(term => term.length > 0)
    
    if (searchTerms.length === 0 && selectedType === 'all' && selectedLocation === 'all') {
      // No filters applied, show all boards
      setSearchResults([])
      setIsSearching(false)
      return
    }

    let filteredBoards = boards.filter(board => {
      // Search term matching (OR logic - any term can match any field)
      const matchesSearch = searchTerms.length === 0 || searchTerms.some(term => {
        const boardName = board.name.toLowerCase()
        const boardDescription = (board.description || '').toLowerCase()
        const boardLocation = `${board.city || ''} ${board.state || ''}`.toLowerCase()
        
        return boardName.includes(term) || 
               boardDescription.includes(term) || 
               boardLocation.includes(term)
      })
      
      // Filter by board type
      if (selectedType !== 'all') {
        filteredBoards = filteredBoards.filter(board => board.type === selectedType)
      }
      
      // Filter by location (city or state)
      if (selectedLocation !== 'all') {
        filteredBoards = filteredBoards.filter(board => {
          const cityMatch = board.city && board.city.toLowerCase().includes(selectedLocation.toLowerCase())
          const stateMatch = board.state && board.state.toLowerCase().includes(selectedLocation.toLowerCase())
          return cityMatch || stateMatch
        })
      }

      return matchesSearch
    })

    console.log('Search terms:', searchTerms)
    console.log('Filtered boards:', filteredBoards)
    console.log('Total boards:', boards.length)
    
    setSearchResults(filteredBoards)
    setIsSearching(false)
  }

  // Handle search on Enter key
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('')
    setSelectedType('all')
    setSelectedLocation('all')
    setSearchResults([])
  }

  // Get boards to display (search results or all boards)
  const displayBoards = searchResults.length > 0 ? searchResults : boards

  // Get top 8 cities - prioritize by activity, but always show 8 cities
  const cityBoards = boards.filter(board => board.type === 'CITY')
  
  let top8Cities: Board[] = []
  
  if (cityBoards.length >= 8) {
    // If we have 8+ cities, try to get the most active ones first
    const activeCities = cityBoards
      .filter(board => (board.postCount || 0) > 0)
      .sort((a, b) => {
        const aPostCount = (a.postCount || 0)
        const bPostCount = (b.postCount || 0)
        if (aPostCount !== bPostCount) {
          return bPostCount - aPostCount // Higher post count first
        }
        
        // Then by recent activity (more recent first)
        const aActivity = new Date(a.lastActivity || a.updatedAt).getTime()
        const bActivity = new Date(b.lastActivity || b.updatedAt).getTime()
        return bActivity - aActivity
      })
    
    if (activeCities.length >= 8) {
      // We have enough active cities, take top 8
      top8Cities = activeCities.slice(0, 8)
    } else {
      // Mix active cities with random inactive ones to get 8 total
      const remainingSlots = 8 - activeCities.length
      const inactiveCities = cityBoards
        .filter(board => (board.postCount || 0) === 0)
        .sort(() => Math.random() - 0.5) // Random shuffle
        .slice(0, remainingSlots)
      
      top8Cities = [...activeCities, ...inactiveCities]
    }
  } else {
    // If we have fewer than 8 cities total, show all of them
    top8Cities = cityBoards
  }
  
  // Ensure we always have exactly 8 cities (or all available if less than 8)
  if (top8Cities.length < 8 && cityBoards.length > top8Cities.length) {
    const remainingCities = cityBoards
      .filter(board => !top8Cities.some(topCity => topCity.id === board.id))
      .sort(() => Math.random() - 0.5) // Random shuffle
      .slice(0, 8 - top8Cities.length)
    
    top8Cities = [...top8Cities, ...remainingCities]
  }

  // Get remaining boards (excluding top 8 cities)
  const remainingBoards = boards.filter(board => 
    !top8Cities.some(topCity => topCity.id === board.id)
  )



  // Debug logging
  console.log('Total boards:', boards.length)
  console.log('City boards:', cityBoards.length)
  console.log('Top 8 cities:', top8Cities.length)
  console.log('Top 8 cities data:', top8Cities)

  const getBoardIcon = (type: string) => {
    switch (type) {
      case 'NATIONAL':
        return <Globe className="w-5 h-5 text-blue-600" />
      case 'STATE':
        return <MapPin className="w-5 h-5 text-green-600" />
      case 'CITY':
        return <Building2 className="w-5 h-5 text-purple-600" />
      default:
        return <Building2 className="w-5 h-5 text-gray-600" />
    }
  }

  const getBoardTypeColor = (type: string) => {
    switch (type) {
      case 'NATIONAL':
        return 'from-blue-400 to-blue-600'
      case 'STATE':
        return 'from-green-400 to-green-600'
      case 'CITY':
        return 'from-purple-400 to-purple-600'
      default:
        return 'from-gray-400 to-gray-600'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading boards...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Explore Community Boards
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover thousands of community boards across America. From national discussions to local neighborhoods, 
              find your community on iCorkIt. Social boards are accessed by clicking on usernames in posts.
              Use unified search - type "Dallas Texas" or "Texas Dallas" for the same results.
            </p>
          </div>
        </div>
      </div>

      {/* Unified Search Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Find Your Community
            </h2>
            
            {/* Main Search Bar */}
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search boards, cities, states, or topics... (e.g., 'Dallas Texas', 'California', 'Community')"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-black placeholder-gray-500"
                  />
                </div>
              </div>
              
              <Button
                onClick={handleSearch}
                disabled={isSearching}
                className="lg:w-auto px-8 py-3 bg-amber-600 hover:bg-amber-700 text-white"
              >
                {isSearching ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Searching...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Search className="w-4 h-4" />
                    <span>Search</span>
                  </div>
                )}
              </Button>
            </div>

            {/* Advanced Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Board Type</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-black bg-white"
                >
                  {boardTypes.map(type => (
                    <option key={type} value={type} className="text-black">
                      {type === 'all' ? 'All Types' : type}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-black bg-white"
                >
                  {locations.map(location => (
                    <option key={location} value={location} className="text-black">
                      {location === 'all' ? 'All Locations' : location}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Filter Actions */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {searchResults.length > 0 ? (
                  <span>Found {searchResults.length} boards matching your search</span>
                ) : (
                  <span>Showing {boards.length} total boards</span>
                )}
              </div>
              
              {(searchTerm || selectedType !== 'all' || selectedLocation !== 'all') && (
                <Button
                  onClick={clearFilters}
                  variant="outline"
                  size="sm"
                  className="text-gray-600 hover:text-gray-800"
                >
                  <X className="w-4 h-4 mr-2" />
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top 8 Cities Section */}
        {top8Cities.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Featured Cities
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {top8Cities.map((board) => (
                <div key={board.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border-2 border-amber-200">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${getBoardTypeColor(board.type)} rounded-lg flex items-center justify-center`}>
                        {getBoardIcon(board.type)}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Star className="w-5 h-5 text-amber-500" />
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{board.name}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{board.description}</p>

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{board.memberCount || 0}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{board.postCount || 0} posts</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <Link
                        href={board.city ? `/boards/city/${board.city.toLowerCase().replace(/\s+/g, '-')}` : `/boards/city/${board.name.toLowerCase().replace(/\s+/g, '-')}`}
                        className="text-amber-600 hover:text-amber-700 font-medium text-sm"
                      >
                        View Board →
                      </Link>
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-800">
                        TOP CITY
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search Results Only */}
        {searchResults.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Search Results
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map((board) => (
                <div key={board.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${getBoardTypeColor(board.type)} rounded-lg flex items-center justify-center`}>
                        {getBoardIcon(board.type)}
                      </div>
                      <div className="flex items-center space-x-2">
                        {board.isPrivate && (
                          <Lock className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{board.name}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{board.description}</p>

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{board.memberCount || 0}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{board.postCount || 0} posts</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <Link
                        href={board.city ? `/boards/city/${board.city.toLowerCase().replace(/\s+/g, '-')}` : 
                              board.state ? `/boards/state/${board.state.toLowerCase().replace(/\s+/g, '-')}` :
                              `/boards/${board.type.toLowerCase()}/${board.name.toLowerCase().replace(/\s+/g, '-')}`}
                        className="text-amber-600 hover:text-amber-700 font-medium text-sm"
                      >
                        View Board →
                      </Link>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        board.type === 'NATIONAL' ? 'bg-blue-100 text-blue-800' :
                        board.type === 'STATE' ? 'bg-green-100 text-green-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {board.type}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}



        {searchResults.length === 0 && boards.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No boards found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search terms or filters to find more boards.
            </p>
            <Button onClick={clearFilters} variant="outline">
              Clear All Filters
            </Button>
          </div>
        )}
      </div>

      {/* Find Other Boards Section */}
      <div className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Find Other Boards
            </h2>
            <p className="text-xl text-gray-600">
              Search for specific cities, states, or topics to discover more community boards. 
              Use unified search - type "Dallas Texas" or "Texas Dallas" for the same results.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Search Tips</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Type "Dallas Texas" to find Dallas boards</li>
                    <li>• Type "Texas" to find all Texas boards</li>
                    <li>• Type "Community" to find boards with that in the name</li>
                    <li>• Use filters to narrow down results</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Popular Searches</h3>
                  <div className="space-y-2">
                    {['California', 'New York', 'Texas', 'Florida', 'Community', 'Events'].map((term) => (
                      <button
                        key={term}
                        onClick={() => {
                          setSearchTerm(term)
                          handleSearch()
                        }}
                        className="block w-full text-left text-sm text-amber-600 hover:text-amber-700 hover:bg-amber-50 px-3 py-2 rounded-md transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
