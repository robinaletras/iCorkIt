'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { MapPin, Users, Globe, Building, Plus, Search } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { CreateBoardForm } from '@/components/boards/CreateBoardForm'

interface Board {
  id: string
  name: string
  slug: string
  description: string
  type: string
  level: string
  city?: string
  state?: string
  postCount: number
  createdAt: string
}

export default function BoardsPage() {
  const [boards, setBoards] = useState<Board[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateBoardOpen, setIsCreateBoardOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<string>('ALL')
  const { user } = useAuth()

  // Mock data for now - will be replaced with API call
  useEffect(() => {
    const mockBoards: Board[] = [
      {
        id: '1',
        name: 'National Announcements',
        slug: 'national-announcements',
        description: 'Country-wide news and important updates',
        type: 'NATIONAL',
        level: 'NATIONAL',
        postCount: 45,
        createdAt: '2024-01-01'
      },
      {
        id: '2',
        name: 'New York City',
        slug: 'new-york-city',
        description: 'Local community updates for NYC residents',
        type: 'CITY',
        level: 'CITY',
        city: 'New York',
        state: 'NY',
        postCount: 1247,
        createdAt: '2024-01-01'
      },
      {
        id: '3',
        name: 'Los Angeles Community',
        slug: 'los-angeles-community',
        description: 'LA area events and services',
        type: 'CITY',
        level: 'CITY',
        city: 'Los Angeles',
        state: 'CA',
        postCount: 1156,
        createdAt: '2024-01-01'
      },
      {
        id: '4',
        name: 'Tech Enthusiasts',
        slug: 'tech-enthusiasts',
        description: 'Private board for technology discussions',
        type: 'SOCIAL',
        level: 'NEIGHBORHOOD',
        postCount: 89,
        createdAt: '2024-01-01'
      }
    ]
    
    setBoards(mockBoards)
    setIsLoading(false)
  }, [])

  const filteredBoards = boards.filter(board => {
    const matchesSearch = board.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         board.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (board.city && board.city.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesType = selectedType === 'ALL' || board.type === selectedType
    
    return matchesSearch && matchesType
  })

  const handleBoardCreated = () => {
    setIsCreateBoardOpen(false)
    // Refresh boards list
    // In real implementation, this would fetch from API
  }

  const getBoardIcon = (type: string) => {
    switch (type) {
      case 'NATIONAL':
        return <Globe className="w-6 h-6" />
      case 'STATE':
        return <Building className="w-6 h-6" />
      case 'CITY':
        return <MapPin className="w-6 h-6" />
      case 'SOCIAL':
        return <Users className="w-6 h-6" />
      default:
        return <MapPin className="w-6 h-6" />
    }
  }

  const getBoardColor = (type: string) => {
    switch (type) {
      case 'NATIONAL':
        return 'from-blue-500 to-cyan-500'
      case 'STATE':
        return 'from-green-500 to-emerald-500'
      case 'CITY':
        return 'from-purple-500 to-pink-500'
      case 'SOCIAL':
        return 'from-orange-500 to-red-500'
      default:
        return 'from-gray-500 to-gray-600'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading boards...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Browse Boards
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover communities, local updates, and specialized boards on iCorkIt
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search boards..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            {/* Type Filter */}
            <div className="flex gap-2">
              {['ALL', 'NATIONAL', 'STATE', 'CITY', 'SOCIAL'].map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedType === type
                      ? 'bg-amber-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type === 'ALL' ? 'All Types' : type}
                </button>
              ))}
            </div>

            {/* Create Board Button */}
            {user && (
              <Button onClick={() => setIsCreateBoardOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Board
              </Button>
            )}
          </div>
        </div>

        {/* Boards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBoards.map((board) => {
            // Generate correct URL based on board type
            let boardUrl = '/boards'
            if (board.type === 'NATIONAL') {
              boardUrl = '/boards/national'
            } else if (board.type === 'STATE') {
              boardUrl = '/boards/state'
            } else if (board.type === 'CITY') {
              // For city boards, use the city name in the correct format
              const citySlug = board.city?.toLowerCase().replace(' ', '-') || board.slug
              boardUrl = `/boards/city/${citySlug}`
            } else if (board.type === 'SOCIAL') {
              boardUrl = '/boards/social'
            }

            return (
              <Link key={board.id} href={boardUrl}>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 cursor-pointer">
                  {/* Board Header */}
                  <div className={`p-6 bg-gradient-to-br ${getBoardColor(board.type)} text-white rounded-t-xl`}>
                    <div className="flex items-center justify-between mb-3">
                      {getBoardIcon(board.type)}
                      <span className="text-sm opacity-90">{board.type}</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{board.name}</h3>
                    <p className="text-white/90 text-sm">{board.description}</p>
                  </div>

                  {/* Board Details */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-sm text-gray-600">
                        {board.city && board.state && (
                          <span className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {board.city}, {board.state}
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-amber-600">{board.postCount}</div>
                        <div className="text-xs text-gray-500">posts</div>
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      Created {new Date(board.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Empty State */}
        {filteredBoards.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No boards found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search terms or filters
            </p>
            {user && (
              <Button onClick={() => setIsCreateBoardOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create the First Board
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Create Board Form Modal */}
      <CreateBoardForm
        isOpen={isCreateBoardOpen}
        onClose={() => setIsCreateBoardOpen(false)}
        onSuccess={handleBoardCreated}
      />
    </div>
  )
}
