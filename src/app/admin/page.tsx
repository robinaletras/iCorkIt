'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { CheckCircle, XCircle, Clock, AlertTriangle, Users, MapPin, CreditCard, Settings } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface PendingBoard {
  id: string
  name: string
  type: string
  city?: string
  state?: string
  description?: string
  createdAt: string
  owner: {
    id: string
    displayName: string
    email: string
  }
}

export default function AdminDashboard() {
  const { user } = useAuth()
  const [pendingBoards, setPendingBoards] = useState<PendingBoard[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<string | null>(null)

  useEffect(() => {
    if (user?.isAdmin) {
      fetchPendingBoards()
    }
  }, [user])

  const fetchPendingBoards = async () => {
    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch('/api/admin/boards/pending', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setPendingBoards(data.boards)
      }
    } catch (error) {
      console.error('Error fetching pending boards:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApproval = async (boardId: string, approved: boolean, rejectionReason?: string) => {
    setProcessing(boardId)
    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch('/api/admin/boards/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ boardId, approved, rejectionReason })
      })

      if (response.ok) {
        // Remove from pending list
        setPendingBoards(prev => prev.filter(board => board.id !== boardId))
      }
    } catch (error) {
      console.error('Error updating board approval:', error)
    } finally {
      setProcessing(null)
    }
  }

  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access the admin dashboard.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Manage boards, users, and system settings</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Logged in as: {user.displayName}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-semibold text-gray-900">-</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <MapPin className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Boards</p>
                <p className="text-2xl font-semibold text-gray-900">-</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
                <p className="text-2xl font-semibold text-gray-900">{pendingBoards.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <CreditCard className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Revenue</p>
                <p className="text-2xl font-semibold text-gray-900">-</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Board Approvals */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Pending Board Approvals</h2>
            <p className="text-sm text-gray-600">Review and approve new location-based boards</p>
          </div>

          {pendingBoards.length === 0 ? (
            <div className="px-6 py-8 text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <p className="text-gray-600">No pending board approvals</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {pendingBoards.map((board) => (
                <div key={board.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-medium text-gray-900">{board.name}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          board.type === 'CITY' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {board.type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {board.city && board.state ? `${board.city}, ${board.state}` : board.state || board.city}
                      </p>
                      {board.description && (
                        <p className="text-sm text-gray-500 mt-2">{board.description}</p>
                      )}
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <span>Created by: {board.owner.displayName}</span>
                        <span>Email: {board.owner.email}</span>
                        <span>Date: {new Date(board.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 ml-6">
                      <Button
                        onClick={() => handleApproval(board.id, true)}
                        disabled={processing === board.id}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleApproval(board.id, false, 'Rejected by admin')}
                        disabled={processing === board.id}
                        variant="outline"
                        className="border-red-300 text-red-700 hover:bg-red-50"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Additional Admin Sections */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <Settings className="w-6 h-6 text-gray-600 mr-3" />
              <h3 className="text-lg font-medium text-gray-900">System Settings</h3>
            </div>
            <p className="text-gray-600 mb-4">Configure system-wide settings and preferences</p>
            <Button variant="outline" className="w-full">
              Manage Settings
            </Button>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <Users className="w-6 h-6 text-gray-600 mr-3" />
              <h3 className="text-lg font-medium text-gray-900">User Management</h3>
            </div>
            <p className="text-gray-600 mb-4">Manage user accounts, roles, and permissions</p>
            <Button variant="outline" className="w-full">
              Manage Users
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
