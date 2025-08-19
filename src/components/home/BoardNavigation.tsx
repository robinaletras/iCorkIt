'use client'

import { Button } from '@/components/ui/Button'
import { MapPin, Users, Building, Globe } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { CreateBoardForm } from '@/components/boards/CreateBoardForm'
import { LoginModal } from '@/components/auth/LoginModal'
import { RegisterModal } from '@/components/auth/RegisterModal'

const boardTypes = [
  {
    icon: Globe,
    title: 'National Board',
    description: 'The main board for country-wide content and announcements',
    color: 'from-blue-500 to-cyan-500',
    href: '/boards/national'
  },
  {
    icon: Building,
    title: 'State Boards',
    description: 'Regional boards for state-specific content and services',
    color: 'from-green-500 to-emerald-500',
    href: '/boards/state'
  },
  {
    icon: MapPin,
    title: 'City Boards',
    description: 'Local boards for city-level community content',
    color: 'from-purple-500 to-pink-500',
    href: '/boards/city'
  },
  {
    icon: Users,
    title: 'Social Boards',
    description: 'Private boards created by users for specific communities',
    color: 'from-orange-500 to-red-500',
    href: '/boards/social'
  }
]

const popularLocations = [
  { name: 'New York', state: 'NY', posts: 1247 },
  { name: 'Los Angeles', state: 'CA', posts: 1156 },
  { name: 'Chicago', state: 'IL', posts: 892 },
  { name: 'Houston', state: 'TX', posts: 756 },
  { name: 'Phoenix', state: 'AZ', posts: 634 },
  { name: 'Philadelphia', state: 'PA', posts: 589 }
]

export function BoardNavigation() {
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [isCreateBoardOpen, setIsCreateBoardOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false)
  const { user } = useAuth()

  const handleCreateBoard = () => {
    if (!user) {
      setIsLoginModalOpen(true)
      return
    }
    setIsCreateBoardOpen(true)
  }

  const handleBoardCreated = () => {
    setIsCreateBoardOpen(false)
    // Could show success message or redirect
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Explore Our Boards
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From national announcements to local community updates, find the perfect board 
            for your content and discover what's happening around you.
          </p>
        </div>

        {/* Board Types */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {boardTypes.map((board, index) => (
            <Link key={index} href={board.href}>
              <div
                className={`p-6 rounded-xl bg-gradient-to-br ${board.color} text-white cursor-pointer transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl`}
                onClick={() => setSelectedType(board.title)}
              >
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                  <board.icon className="w-6 h-6" />
                </div>
                
                <h3 className="text-xl font-semibold mb-2">
                  {board.title}
                </h3>
                
                <p className="text-white/90 text-sm leading-relaxed">
                  {board.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Popular Locations */}
        <div className="bg-gray-50 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Popular City Boards
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularLocations.map((location, index) => (
              <Link key={index} href={`/boards/city/${location.name.toLowerCase().replace(' ', '-')}`}>
                <div className="p-4 bg-white rounded-lg border border-gray-200 hover:border-amber-300 hover:shadow-md transition-all duration-300 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">{location.name}</h4>
                      <p className="text-sm text-gray-500">{location.state}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-amber-600">{location.posts}</div>
                      <div className="text-xs text-gray-500">posts</div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Link href="/explore">
              <Button 
                variant="outline" 
                size="lg"
                className="hover:bg-amber-50 hover:border-amber-400 hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                View All Boards
              </Button>
            </Link>
          </div>
        </div>

        {/* Create Your Own Board */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Ready to Create Your Own Board?
            </h3>
            <p className="text-amber-100 mb-6 max-w-2xl mx-auto">
              Create a location board for your city or town, or start a social board for your community. 
              Location boards help connect local communities, while social boards bring together people with shared interests.
            </p>
            <Button 
              variant="outline" 
              size="lg" 
              className="bg-white text-amber-600 hover:bg-gray-100 hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              onClick={handleCreateBoard}
            >
              Create Your Board
            </Button>
          </div>
        </div>
      </div>

      {/* Create Board Form Modal */}
      <CreateBoardForm
        isOpen={isCreateBoardOpen}
        onClose={() => setIsCreateBoardOpen(false)}
        onSuccess={handleBoardCreated}
      />

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSwitchToRegister={() => {
          setIsLoginModalOpen(false)
          setIsRegisterModalOpen(true)
        }}
      />

      {/* Register Modal */}
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onSwitchToLogin={() => {
          setIsRegisterModalOpen(false)
          setIsLoginModalOpen(true)
        }}
      />
    </section>
  )
}
