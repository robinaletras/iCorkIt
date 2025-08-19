'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/Button'
import { CreatePostForm } from '@/components/posts/CreatePostForm'
import { Pin, X, Plus, Move, Maximize2, Heart, MessageCircle, Share2, Edit3, Trash2, Home } from 'lucide-react'
import Link from 'next/link'
import { PinPurchaseModal } from '@/components/pins/PinPurchaseModal'
// import { MiniMap } from './MiniMap'

interface Post {
  id: string
  title: string
  content: string
  author: { displayName: string; id: string }
  category: string
  likes: number
  comments: number
  shares: number
  isPinned: boolean
  pinEndDate?: Date
  pinDaysRemaining?: number
  position: { x: number; y: number }
  createdAt: Date
  images?: string[]
  tags?: string[]
}

interface CorkBoardProps {
  boardId: string
  boardName: string
  boardType: string
  cityName?: string
  stateCode?: string
}

export function CorkBoard({ boardId, boardName, boardType, cityName, stateCode }: CorkBoardProps) {
  const { user, updateSocialPins, updatePinPacks } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [currentBoardName, setCurrentBoardName] = useState(boardName)
  const [panX, setPanX] = useState(0)
  const [panY, setPanY] = useState(0)
  const [isPanning, setIsPanning] = useState(false)
  const [panStart, setPanStart] = useState({ x: 0, y: 0 })
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false)
  const [isPinPostOpen, setIsPinPostOpen] = useState(false)
  const [isPinPurchaseOpen, setIsPinPurchaseOpen] = useState(false)
  const [postToPin, setPostToPin] = useState<Post | null>(null)
  const [pinDuration, setPinDuration] = useState(1)
  const [isUpdatingPositions, setIsUpdatingPositions] = useState(false)
  
  // Track which post is currently being dragged
  const [draggingPostId, setDraggingPostId] = useState<string | null>(null)

  console.log('🔍 CorkBoard component mounted with boardId:', boardId)

  // Monitor pin modal state changes
  useEffect(() => {
    console.log('Pin modal state changed - isPinPostOpen:', isPinPostOpen, 'postToPin:', postToPin)
  }, [isPinPostOpen, postToPin])

  // Monitor postToPin state changes specifically
  useEffect(() => {
    console.log('postToPin state changed to:', postToPin)
  }, [postToPin])

  // Load posts on mount
  useEffect(() => {
    console.log('🔍 useEffect triggered for board:', boardId, 'type:', boardType)
    
    const loadBoardData = async () => {
      try {
        console.log('Fetching posts for board:', boardId)
        const postsResponse = await fetch(`/api/posts?boardId=${boardId}`)
        
        if (postsResponse.ok) {
          const postsData = await postsResponse.json()
          console.log('API response received:', postsData.posts?.length || 0, 'posts')
          
          if (postsData.posts && postsData.posts.length > 0) {
            // Transform API posts to match our Post interface
            const realPosts = postsData.posts.map((post: any) => ({
              id: post.id,
              title: post.title,
              content: post.content,
              author: { displayName: post.author?.displayName || 'Unknown', id: post.authorId },
              category: post.category || 'General',
              likes: post.likeCount || 0,
              comments: post.commentCount || 0,
              shares: 0,
              isPinned: post.isPinned || false,
              pinEndDate: post.pinEndDate ? new Date(post.pinEndDate) : undefined,
              pinDaysRemaining: post.pinDaysRemaining || 0,
              position: { x: post.positionX, y: post.positionY },
              createdAt: new Date(post.createdAt),
              tags: Array.isArray(post.tags) ? post.tags : (post.tags ? JSON.parse(post.tags) : []),
              images: Array.isArray(post.images) ? post.images : (post.images ? JSON.parse(post.images) : [])
            }))
            
            console.log('Setting posts:', realPosts.length)
            setPosts(realPosts)
          } else {
            console.log('No posts found, setting empty array')
            setPosts([])
          }
        } else {
          console.error('Failed to fetch posts:', postsResponse.status)
          setPosts([])
        }
      } catch (error) {
        console.error('Error loading posts:', error)
        setPosts([])
      }
    }

    loadBoardData()
  }, [boardId])

  // Handle board panning
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsPanning(true)
      setPanStart({ x: e.clientX, y: e.clientY })
      e.preventDefault()
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      const deltaX = e.clientX - panStart.x
      const deltaY = e.clientY - panStart.y
      setPanX(prev => prev + deltaX)
      setPanY(prev => prev + deltaY)
      setPanStart({ x: e.clientX, y: e.clientY })
    }
  }

  const handleMouseUp = () => {
    setIsPanning(false)
  }

  // Handle post dragging - simplified version
  const handlePostMouseDown = (e: React.MouseEvent, post: Post) => {
    if (post.isPinned) {
      // For pinned posts, just stop propagation but don't prevent default
      // This allows the onClick to fire
      e.stopPropagation()
      return
    }
    
    e.stopPropagation()
    const startX = e.clientX
    const startY = e.clientY
    const startPostX = post.position.x
    const startPostY = post.position.y
    
    let hasDragged = false
    const dragThreshold = 5 // pixels
    
    // Set this post as the one being dragged
    setDraggingPostId(post.id)
    
    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX
      const deltaY = e.clientY - startY
      
      // Check if we've moved enough to consider it a drag
      if (Math.abs(deltaX) > dragThreshold || Math.abs(deltaY) > dragThreshold) {
        hasDragged = true
      }
      
      // Update post position in real-time while dragging
      setPosts(currentPosts =>
        currentPosts.map(p =>
          p.id === post.id
            ? { ...p, position: { x: startPostX + deltaX, y: startPostY + deltaY } }
            : p
        )
      )
    }
    
    const handleMouseUp = async (e: MouseEvent) => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      
      if (hasDragged) {
        const finalPosition = {
          x: startPostX + (e.clientX - startX),
          y: startPostY + (e.clientY - startY)
        }
        
        console.log('DRAG DEBUG:')
        console.log('  Start mouse position:', startX, startY)
        console.log('  End mouse position:', e.clientX, e.clientY)
        console.log('  Start post position:', startPostX, startPostY)
        console.log('  Final calculated position:', finalPosition)
        console.log('Saving post position:', finalPosition)
        
        try {
          const token = localStorage.getItem('authToken')
          if (token) {
            setIsUpdatingPositions(true)
            const response = await fetch(`/api/posts/${post.id}/update-position`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                positionX: Math.round(finalPosition.x),
                positionY: Math.round(finalPosition.y)
              })
            })
            
            if (response.ok) {
              console.log('Post position saved successfully')
              console.log('Updating local state from position:', post.position, 'to:', finalPosition)
              // Update local state to reflect the new position
              setPosts(currentPosts => {
                const updatedPosts = currentPosts.map(p =>
                  p.id === post.id
                    ? { ...p, position: finalPosition }
                    : p
                )
                console.log('Updated posts state:', updatedPosts)
                return updatedPosts
              })
            } else {
              console.error('Failed to save position')
              // Revert to original position if save failed
              setPosts(currentPosts =>
                currentPosts.map(p =>
                  p.id === post.id
                    ? { ...p, position: { x: startPostX, y: startPostY } }
                    : p
                )
              )
            }
          }
        } catch (error) {
          console.error('Failed to save post position:', error)
          // Revert to original position if save failed
          setPosts(currentPosts =>
            currentPosts.map(p =>
              p.id === post.id
                ? { ...p, position: { x: startPostX, y: startPostY } }
                : p
            )
          )
        } finally {
          setIsUpdatingPositions(false)
        }
      }
      
      // Clear the dragging state
      setDraggingPostId(null)
    }
    
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  // Helper functions removed - now using simple toggle system

  // Post actions
  const handlePostClick = (post: Post) => {
    console.log('Post clicked:', post.title, 'isPinned:', post.isPinned)
    setSelectedPost(post)
  }

  const handleLikePost = (postId: string) => {
    setPosts(currentPosts =>
      currentPosts.map(post =>
        post.id === postId
          ? { ...post, likes: post.likes + 1 }
          : post
      )
    )
  }

  const handlePinPost = async (post?: Post) => {
    // Use the passed post parameter or fall back to state
    const postToPinData = post || postToPin
    console.log('handlePinPost called with:', { postToPinData, user, pinDuration, post, postToPin })
    if (!postToPinData || !user) {
      console.log('Missing postToPin or user, returning early')
      return
    }

    // If post is already pinned, unpin it instead
    if (postToPinData.isPinned) {
      await handleUnpinPost(postToPinData)
      // Close the modal after unpinning
      setSelectedPost(null)
      return
    }

    const pinsNeeded = pinDuration

    // Check if user has enough pins based on board type
    if (boardType === 'SOCIAL') {
      if (user.socialPins < pinsNeeded) {
        setIsPinPostOpen(false) // Close modal
        setPostToPin(null) // Clear postToPin
        setPinDuration(1) // Reset duration
        setIsPinPurchaseOpen(true) // Open purchase modal
        return
      }
    } else {
      if (user.pinPacks < pinsNeeded) {
        setIsPinPostOpen(false) // Close modal
        setPostToPin(null) // Clear postToPin
        setPinDuration(1) // Reset duration
        setIsPinPurchaseOpen(true) // Open purchase modal
        return
      }
    }

    try {
      const response = await fetch('/api/pins/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          postId: postToPinData.id,
          boardId: boardId,
          daysPinned: pinDuration
        })
      })

      if (response.ok) {
        const result = await response.json()
        
        // Update user's pin balance based on board type
        if (boardType === 'SOCIAL') {
          const newSocialPins = user.socialPins - pinsNeeded
          updateSocialPins(newSocialPins)
        } else {
          const newPinPacks = user.pinPacks - pinsNeeded
          updatePinPacks(newPinPacks)
        }
        
        setIsPinPostOpen(false)
        setPostToPin(null)
        setPinDuration(1)
        
        // Refresh posts to show updated pin status
        refreshPosts()
        
        // No success message - user can see the pin status visually
      } else {
        const error = await response.json()
        alert(`Failed to pin post: ${error.error}`)
      }
    } catch (error) {
      console.error('Error pinning post:', error)
      alert('Failed to pin post')
    }
  }

  const handleUnpinPost = async (post: Post) => {
    if (!user) {
      alert('Please sign in to unpin posts')
      return
    }

    try {
      const response = await fetch('/api/pins/remove', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          postId: post.id,
          boardId: boardId
        })
      })

      if (response.ok) {
        // Get the pin data to know how many pins to return
        const pinData = await response.json()
        
        // Return pins to user's balance (only for social boards)
        if (boardType === 'SOCIAL' && pinData.pinsReturned) {
          const newSocialPins = user.socialPins + pinData.pinsReturned
          updateSocialPins(newSocialPins)
          // No alert - user can see the post is unpinned visually
        }
        
        // Close post detail modal if it's open
        if (selectedPost?.id === post.id) {
          setSelectedPost(null)
        }
        
        // Refresh posts to show updated pin status
        refreshPosts()
      } else {
        const error = await response.json()
        alert(`Failed to unpin post: ${error.error}`)
      }
    } catch (error) {
      console.error('Error unpinning post:', error)
      alert('Failed to unpin post')
    }
  }

  const handleDeletePost = (postId: string) => {
    if (!user) {
      alert('Please sign in to delete posts')
      return
    }
    if (confirm('Are you sure you want to delete this post?')) {
      setPosts(currentPosts => currentPosts.filter(post => post.id !== postId))
      setSelectedPost(null)
    }
  }

  const handleCreatePost = () => {
    if (!user) {
      alert('Please sign in to create posts')
      return
    }
    setIsCreatePostOpen(true)
  }

  const refreshPosts = async () => {
    console.log('refreshPosts called for boardType:', boardType, 'boardId:', boardId)
    try {
      // All posts now have boardId, so we can use the same logic for all board types
      const postsResponse = await fetch(`/api/posts?boardId=${boardId}`)
      console.log('Posts response status:', postsResponse.status)
      if (postsResponse.ok) {
        const postsData = await postsResponse.json()
        console.log('Posts data:', postsData)
        if (postsData.posts && postsData.posts.length > 0) {
          const realPosts = postsData.posts.map((post: any) => ({
            id: post.id,
            title: post.title,
            content: post.content,
            author: { displayName: post.author?.displayName || 'Unknown', id: post.authorId },
            category: post.category || 'General',
            likes: post.likeCount || 0,
            comments: post.commentCount || 0,
            shares: 0,
            isPinned: post.isPinned || false,
            pinEndDate: post.pinEndDate ? new Date(post.pinEndDate) : undefined,
            pinDaysRemaining: post.pinDaysRemaining || 0,
            position: { x: post.positionX, y: post.positionY }, // Use stored positions
            createdAt: new Date(post.createdAt),
            tags: post.tags ? JSON.parse(post.tags) : [],
            images: post.images ? JSON.parse(post.images) : []
          }))
          console.log('Setting posts:', realPosts)
          setPosts(realPosts)
          return
        }
      }
      
      console.log('No posts found, setting empty array')
      setPosts([])
    } catch (error) {
      console.error('Error refreshing posts:', error)
      setPosts([])
    }
  }

  // Create Post Modal
  const CreatePostModal = () => (
    <CreatePostForm
      isOpen={isCreatePostOpen}
      onClose={() => setIsCreatePostOpen(false)}
      onSuccess={() => {
        setIsCreatePostOpen(false)
        // Refresh posts to show the new post with red outline
        refreshPosts()
      }}
      boardId={boardId}
      boardName={currentBoardName}
    />
  )

  // Pin Post Modal
  const PinPostModal = () => {
    console.log('PinPostModal rendering with postToPin:', postToPin)
    return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border-4 border-amber-300">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              {postToPin?.isPinned ? 'Add Days to Post' : 'Pin Post'}
            </h2>
            <button
              onClick={() => setIsPinPostOpen(false)}
              className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="mb-4">
            <p className="text-gray-600 mb-2">
              {postToPin?.isPinned 
                ? `Add more days to "${postToPin?.title}" (currently has ${postToPin?.pinDaysRemaining || 0} days remaining). The new days will be added to your existing pin time.`
                : `Pin "${postToPin?.title}" to keep it visible on the board.`
              }
            </p>
            <div className="bg-amber-50 p-3 rounded-lg">
              <div className="flex items-center space-x-2 text-amber-700">
                <Pin className="w-4 h-4" />
                <span className="text-sm font-medium text-amber-700">
                  {boardType === 'SOCIAL' 
                    ? `You have ${user?.socialPins || 0} social pins remaining`
                    : `You have ${user?.pinPacks || 0} pins remaining`
                  }
                </span>
              </div>
            </div>
            <div className="mt-3 text-center">
              <p className="text-sm text-gray-500">💡 <strong>Pin Post Modal</strong> - Use the X button above to close</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {postToPin?.isPinned ? 'Add More Days' : 'Duration (days)'}
              </label>
              <select 
                id="pinDuration"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-black bg-white"
                onChange={(e) => setPinDuration(parseInt(e.target.value))}
                defaultValue="1"
              >
                {postToPin?.isPinned ? (
                  // For already pinned posts, show remaining days options
                  <>
                    <option value="1">+1 day - 1 pin</option>
                    <option value="3">+3 days - 3 pins</option>
                    <option value="7">+7 days - 7 pins</option>
                  </>
                ) : (
                  // For new pins, show total duration options
                  <>
                    <option value="1">1 day - 1 pin</option>
                    <option value="3">3 days - 3 pins</option>
                    <option value="7">7 days - 7 pins</option>
                  </>
                )}
              </select>
            </div>
            
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-sm text-blue-700">
                {boardType === 'SOCIAL' ? (
                  <span>✅ Social pins are reusable - they return to your stock after use</span>
                ) : (
                  <span>💰 Each day costs 1 pin (${pinDuration || 1})</span>
                )}
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsPinPostOpen(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => postToPin && handlePinPost(postToPin)}
                className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
              >
                {postToPin?.isPinned ? 'Add Days' : 'Pin Post'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    )
  }

  // Post Detail Modal
  const PostDetailModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">{selectedPost?.title}</h2>
            <button
              onClick={() => setSelectedPost(null)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="mb-4">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-3">
              {selectedPost?.category}
            </div>
            <p className="text-gray-700 leading-relaxed text-base">{selectedPost?.content}</p>
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
            <Link 
              href={`/boards/social/${selectedPost?.author.id}`}
              className="hover:text-amber-600 transition-colors cursor-pointer"
            >
              By {selectedPost?.author.displayName}
            </Link>
            <div className="flex items-center space-x-4">
              <span>{selectedPost?.likes} likes</span>
              <span>{selectedPost?.comments} comments</span>
              <span>{selectedPost?.shares} shares</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <button
              onClick={async () => {
                if (selectedPost) {
                  if (selectedPost.isPinned) {
                    // If already pinned, unpin it
                    await handleUnpinPost(selectedPost)
                  } else {
                    // If not pinned, pin it and close the modal
                    await handlePinPost(selectedPost)
                    setSelectedPost(null) // Close the post detail modal
                  }
                }
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedPost?.isPinned 
                  ? 'bg-red-600 text-white hover:bg-red-700' 
                  : 'bg-amber-600 text-white hover:bg-amber-700'
              }`}
            >
              {selectedPost?.isPinned ? 'Unpin Post' : 'Pin Post'}
            </button>
            
            {!selectedPost?.isPinned && (
              <button
                onClick={() => selectedPost && handleDeletePost(selectedPost.id)}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                Delete Post
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  // Calculate board dimensions for mini map
  const boardWidth = 2000 // Fixed board width
  const boardHeight = 1500 // Fixed board height
  
  // Debug logging
  console.log('CorkBoard render - posts:', posts, 'posts.length:', posts.length)
  
  // Handle mini map navigation
  // MiniMap functions removed - site was working before MiniMap was added

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      {/* Board Header */}
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-amber-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 bg-gradient-to-br ${getBoardTypeColor()} rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
              {getBoardTypeIcon()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{currentBoardName}</h1>
              <p className="text-gray-600">{getBoardSubtitle()}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Reset Board View Button */}
            <button
              onClick={() => {
                setPanX(0)
                setPanY(0)
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
              title="Reset Board View"
            >
              <Home className="w-4 h-4" />
              <span>Reset View</span>
            </button>
            
            {/* User Info */}
            {user && (
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-2 text-amber-700">
                  <Pin className="w-4 h-4" />
                  <span className="font-medium">
                    {boardType === 'SOCIAL' ? `${user.socialPins} social pins` : `${user.pinPacks} pins`}
                  </span>
                </div>
                
                <Button 
                  onClick={() => setIsCreatePostOpen(true)}
                  className="bg-amber-600 hover:bg-amber-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Post
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Cork Board */}
      <div className="relative w-full min-h-screen overflow-hidden">
        {/* Corkboard Background */}
        <div 
          className={`absolute inset-0 cursor-${isPanning ? 'grabbing' : 'grab'}`}
          style={{
            background: `
              url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><defs><pattern id="cork" patternUnits="userSpaceOnUse" width="100" height="100"><rect width="100" height="100" fill="%23D2B48C"/><circle cx="20" cy="20" r="3" fill="%23A0522D" opacity="0.3"/><circle cx="80" cy="30" r="2" fill="%23A0522D" opacity="0.3"/><circle cx="40" cy="70" r="4" fill="%23A0522D" opacity="0.3"/><circle cx="90" cy="80" r="2" fill="%23A0522D" opacity="0.3"/><circle cx="10" cy="60" r="3" fill="%23A0522D" opacity="0.3"/><circle cx="70" cy="10" r="2" fill="%23A0522D" opacity="0.3"/><circle cx="30" cy="90" r="3" fill="%23A0522D" opacity="0.3"/><circle cx="60" cy="50" r="2" fill="%23A0522D" opacity="0.3"/></pattern></defs><rect width="100" height="100" fill="url(%23cork)"/></svg>'),
              linear-gradient(90deg, rgba(139, 69, 19, 0.1) 1px, transparent 1px),
              linear-gradient(0deg, rgba(139, 69, 19, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '100px 100px, 50px 50px, 50px 50px',
            width: '10000px',
            height: '10000px',
            left: '-5000px',
            top: '-5000px',
            transform: `translate(${panX}px, ${panY}px)`
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          {/* Render Posts */}
          {posts.map((post) => (
            <div
              key={post.id}
              className={`absolute ${
                post.isPinned 
                  ? 'ring-2 ring-amber-400 ring-opacity-50 cursor-pointer hover:ring-amber-500 hover:ring-opacity-75' 
                  : 'cursor-grab active:cursor-grabbing'
              }`}
              style={{
                left: post.position.x + 5000,
                top: post.position.y + 5000,
                width: '280px',
                zIndex: post.isPinned ? 10 : 20,
              }}
              onMouseDown={(e) => handlePostMouseDown(e, post)}
              onClick={() => {
                // Only open modal if we're not currently dragging this post
                if (draggingPostId !== post.id) {
                  handlePostClick(post)
                }
              }}
            >
              {/* Post Card */}
              <div className="bg-white rounded-lg shadow-lg border-2 border-gray-200 overflow-hidden hover:shadow-xl transition-shadow">
                <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          {post.author.displayName.charAt(0)}
                        </span>
                      </div>
                      <Link 
                        href={`/boards/social/${post.author.id}`}
                        className="text-sm font-medium text-gray-700 hover:text-amber-600 transition-colors cursor-pointer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {post.author.displayName}
                      </Link>
                    </div>
                    
                    {post.isPinned && (
                      <div className="flex items-center space-x-1 bg-amber-50 px-2 py-1 rounded-full">
                        <Pin className="w-3 h-3 text-amber-600" />
                        <span className="text-xs text-amber-700 font-medium">Pinned</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-2">
                    {post.category}
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 text-sm leading-tight">
                    {post.title}
                  </h3>
                </div>

                <div className="p-4">
                  <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
                    {post.content}
                  </p>
                </div>

                <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 text-xs text-gray-500">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation()
                          handleLikePost(post.id)
                        }}
                        className="flex items-center space-x-1 hover:text-red-500 transition-colors"
                      >
                        <Heart className="w-3 h-3" />
                        <span>{post.likes}</span>
                      </button>
                      <span className="flex items-center space-x-1">
                        <MessageCircle className="w-3 h-3" />
                        <span>{post.comments}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Share2 className="w-3 h-3" />
                        <span>{post.shares}</span>
                      </span>
                      {/* Pin/Unpin Toggle Button - Only on Social Boards */}
                      {boardType === 'SOCIAL' && (
                        <button 
                          onClick={async (e) => {
                            e.stopPropagation()
                            console.log('Pin/Unpin button clicked for post:', post.title)
                            console.log('Post isPinned:', post.isPinned)
                            
                            if (post.isPinned) {
                              // If already pinned, unpin directly
                              console.log('Unpinning post:', post.title)
                              await handleUnpinPost(post)
                              console.log('Unpin completed, refreshing posts...')
                            } else {
                              // If not pinned, open pin modal
                              console.log('Opening pin modal for post:', post.title)
                              setPostToPin(post)
                              setPinDuration(1)
                              setIsPinPostOpen(true)
                            }
                          }}
                          className={`flex items-center space-x-1 transition-colors ${
                            post.isPinned 
                              ? 'text-red-600 hover:text-red-700' 
                              : 'text-amber-600 hover:text-amber-700'
                          }`}
                          title={post.isPinned ? 'Unpin Post' : 'Pin Post'}
                        >
                          <Pin className="w-3 h-3" />
                          <span className="text-xs">
                            {post.isPinned ? 'Unpin' : 'Pin'}
                          </span>
                        </button>
                      )}
                    </div>
                    
                    {!post.isPinned && (
                      <div className="flex items-center space-x-1 text-gray-400">
                        <Move className="w-3 h-3" />
                        <span className="text-xs">Drag to move</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Expand indicator */}
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full shadow-sm">
                  <Maximize2 className="w-3 h-3 text-gray-500" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      {isCreatePostOpen && <CreatePostModal />}
      {isPinPostOpen && <PinPostModal />}
      {selectedPost && <PostDetailModal />}
      {isPinPurchaseOpen && (
        <PinPurchaseModal
          isOpen={isPinPurchaseOpen}
          onClose={() => setIsPinPurchaseOpen(false)}
          onSuccess={() => {
            setIsPinPurchaseOpen(false)
            // Refresh posts to show updated pin status
            refreshPosts()
          }}
        />
      )}

      {/* MiniMap removed - site was working before it was added */}

      {/* Floating Create Post Button */}
      <button
        onClick={() => setIsCreatePostOpen(true)}
        className="fixed bottom-4 left-4 z-30 bg-amber-600 text-white p-3 rounded-full shadow-lg hover:bg-amber-700 transition-colors"
        title="Create New Post"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  )

  function getBoardTypeColor(): string {
    switch (boardType) {
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

  function getBoardTypeIcon(): string {
    switch (boardType) {
      case 'NATIONAL':
        return 'USA'
      case 'STATE':
        return stateCode?.toUpperCase() || 'ST'
      case 'CITY':
        return cityName?.substring(0, 3).toUpperCase() || 'CIT'
      case 'SOCIAL':
        return 'SOC'
      default:
        return 'BRD'
    }
  }

  function getBoardSubtitle(): string {
    switch (boardType) {
      case 'NATIONAL':
        return 'United States - Connect with America!'
      case 'STATE':
        return `${cityName || 'State'} - Connect with your state community!`
      case 'CITY':
        return `${cityName || 'City'} - Connect with your local community!`
      case 'SOCIAL':
        return 'Personal - Your private community space!'
      default:
        return 'Community - Connect with your community!'
    }
  }
}
