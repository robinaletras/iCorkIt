'use client'

import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Heart, MapPin, Users, Building2, Globe, Star, Plus, Search } from 'lucide-react'
import Link from 'next/link'

interface FavoriteBoard {
  id: string
  name: string
  type: 'NATIONAL' | 'STATE' | 'CITY' | 'SOCIAL'
  description: string
  postCount: number
  memberCount: number
  isPrivate: boolean
  location?: string
  owner?: string
  tags: string[]
  lastVisited: string
  slug: string
}

export default function FavoritesPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('all')

  // Mock favorite boards - in real app this would come from user's favorites
  const [favoriteBoards, setFavoriteBoards] = useState<FavoriteBoard[]>([
    {
      id: '1',
      name: 'Los Angeles Community Board',
      type: 'CITY',
      description: 'City of Angels community board. Hollywood, Venice Beach, Downtown LA, and all neighborhoods.',
      postCount: 1234,
      memberCount: 15600,
      isPrivate: false,
      location: 'Los Angeles, CA',
      tags: ['los-angeles', 'california', 'city', 'hollywood', 'venice'],
      lastVisited: '2 hours ago',
      slug: 'city/los-angeles'
    },
    {
      id: '2',
      name: 'California Community Boards',
      type: 'STATE',
      description: 'All community boards across the Golden State. From San Francisco to San Diego.',
      postCount: 3247,
      memberCount: 45000,
      isPrivate: false,
      location: 'California',
      tags: ['california', 'state', 'community', 'west-coast'],
      lastVisited: '1 day ago',
      slug: 'state/ca'
    },
    {
      id: '3',
      name: 'National Community Board',
      type: 'NATIONAL',
      description: 'The main community board for all of America. Share national events and find services.',
      postCount: 15420,
      memberCount: 125000,
      isPrivate: false,
      tags: ['national', 'community', 'events', 'services'],
      lastVisited: '3 days ago',
      slug: 'national'
    }
  ])

  const boardTypes = ['all', 'NATIONAL', 'STATE', 'CITY', 'SOCIAL']

  const filteredBoards = favoriteBoards.filter(board => {
    const matchesSearch = board.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         board.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         board.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesType = selectedType === 'all' || board.type === selectedType
    return matchesSearch && matchesType
  })

  const getBoardTypeIcon = (type: string) => {
    switch (type) {
      case 'NATIONAL':
        return <Globe className="w-5 h-5 text-blue-600" />
      case 'STATE':
        return <MapPin className="w-5 h-5 text-green-600" />
      case 'CITY':
        return <Building2 className="w-5 h-5 text-purple-600" />
      case 'SOCIAL':
        return <Users className="w-5 h-5 text-orange-600" />
      default:
        return <Building2 className="w-5 h-5 text-gray-600" />
    }
  }

  const getBoardTypeColor = (type: string) => {
    switch (type) {
      case 'NATIONAL':
        return 'from-blue-500 to-blue-600'
      case 'STATE':
        return 'from-green-500 to-green-600'
      case 'CITY':
        return 'from-purple-500 to-purple-600'
      case 'SOCIAL':
        return 'from-orange-500 to-orange-600'
      default:
        return 'from-gray-500 to-gray-600'
    }
  }

  const removeFavorite = (boardId: string) => {
    setFavoriteBoards(current => current.filter(board => board.id !== boardId))
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Sign In to View Favorites</h1>
          <p className="text-xl text-gray-600 mb-8">
            Create an account or sign in to save your favorite boards and access them quickly.
          </p>
          <div className="space-y-4">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-8 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
            >
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-amber-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Your Favorite Boards
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Quick access to the boards you visit most often. Add boards to your favorites 
              to keep them organized and easily accessible.
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search your favorite boards..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              {/* Board Type Filter */}
              <div className="lg:w-48">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  {boardTypes.map(type => (
                    <option key={type} value={type}>
                      {type === 'all' ? 'All Types' : type.charAt(0) + type.slice(1).toLowerCase()}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Favorite Boards */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredBoards.length > 0 ? (
            <>
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
                Your Favorites ({filteredBoards.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBoards.map((board) => (
                  <div key={board.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${getBoardTypeColor(board.type)} rounded-lg flex items-center justify-center`}>
                        {getBoardTypeIcon(board.type)}
                      </div>
                      <button
                        onClick={() => removeFavorite(board.id)}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                        title="Remove from favorites"
                      >
                        <Heart className="w-5 h-5 fill-current" />
                      </button>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {board.name}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                      {board.description}
                    </p>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Type</span>
                        <span className="font-medium text-gray-700">{board.type.charAt(0) + board.type.slice(1).toLowerCase()}</span>
                      </div>
                      
                      {board.location && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Location</span>
                          <span className="font-medium text-gray-700">{board.location}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Posts</span>
                        <span className="font-medium text-gray-700">{board.postCount.toLocaleString()}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Members</span>
                        <span className="font-medium text-gray-700">{board.memberCount.toLocaleString()}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Last Visited</span>
                        <span className="font-medium text-gray-700">{board.lastVisited}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Link
                        href={`/boards/${board.slug}`}
                        className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                      >
                        Visit Board
                      </Link>
                      
                      <div className="flex items-center space-x-1 text-amber-600">
                        <Star className="w-4 h-4" />
                        <span className="text-sm font-medium">Favorite</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-10 h-10 text-gray-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">No Favorite Boards Yet</h2>
              <p className="text-gray-600 mb-8">
                Start exploring boards and add your favorites to see them here!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/explore"
                  className="inline-flex items-center justify-center px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                >
                  Explore Boards
                </Link>
                <Link
                  href="/boards"
                  className="inline-flex items-center justify-center px-6 py-3 border border-amber-600 text-amber-600 rounded-lg hover:bg-amber-50 transition-colors"
                >
                  Browse All Boards
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gradient-to-r from-amber-600 to-orange-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Discover More Boards
          </h2>
          <p className="text-xl text-amber-100 mb-8">
            Find new communities, cities, and topics to add to your favorites.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/explore"
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-amber-600 bg-white hover:bg-gray-50 transition-colors"
            >
              Explore Boards
            </Link>
            <Link
              href="/boards"
              className="inline-flex items-center justify-center px-8 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-amber-700 transition-colors"
            >
              Browse All Boards
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
