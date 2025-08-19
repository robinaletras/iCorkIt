'use client'

import { CreateBoardForm } from '@/components/boards/CreateBoardForm'
import { Button } from '@/components/ui/Button'
import { MapPin, Users, Globe, Building } from 'lucide-react'
import { useState } from 'react'

export default function CreateBoardPage() {
  const [isCreateBoardOpen, setIsCreateBoardOpen] = useState(false)

  const handleBoardCreated = () => {
    setIsCreateBoardOpen(false)
    // Could show success message or redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Create Your Board
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Start building your community with iCorkIt. Choose from two types of boards to create.
          </p>
        </div>

        {/* Board Types Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Location Boards */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Location Boards</h3>
            <p className="text-gray-600 mb-6">
              Create a board for your city, town, or neighborhood. Connect with local communities, 
              share local events, and discover what's happening in your area.
            </p>
            <ul className="text-sm text-gray-600 space-y-2 mb-6">
              <li>• Search by ZIP code, city, or state</li>
              <li>• Automatically discoverable by location</li>
              <li>• Perfect for local businesses and events</li>
              <li>• Free to create and maintain</li>
            </ul>
          </div>

          {/* Social Boards */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Social Boards</h3>
            <p className="text-gray-600 mb-6">
              Create a private community board for your interests, hobbies, or organization. 
              Invite friends, share content, and build meaningful connections.
            </p>
            <ul className="text-sm text-gray-600 space-y-2 mb-6">
              <li>• Private or public community boards</li>
              <li>• Location-based or completely virtual</li>
              <li>• Perfect for clubs, groups, and interests</li>
              <li>• Free to create and maintain</li>
            </ul>
          </div>
        </div>

        {/* Official Boards Info */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-8 text-white mb-16">
          <h3 className="text-2xl font-bold mb-4 text-center">Official Boards</h3>
          <p className="text-gray-300 text-center mb-6 max-w-2xl mx-auto">
            National, State, and major City boards are created and managed by iCorkIt. 
            These official boards provide country-wide and regional content that's automatically 
            available to all users.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold mb-2">National Board</h4>
              <p className="text-sm text-gray-400">Country-wide announcements and content</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Building className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold mb-2">State Boards</h4>
              <p className="text-sm text-gray-400">Regional content for each state</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold mb-2">Major City Boards</h4>
              <p className="text-sm text-gray-400">Official boards for major metropolitan areas</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button 
            size="lg" 
            className="text-lg px-8 py-4 hover:bg-amber-700 hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            onClick={() => setIsCreateBoardOpen(true)}
          >
            Start Creating Your Board
          </Button>
        </div>

        {/* Create Board Form Modal */}
        <CreateBoardForm
          isOpen={isCreateBoardOpen}
          onClose={() => setIsCreateBoardOpen(false)}
          onSuccess={handleBoardCreated}
        />
      </div>
    </div>
  )
}
