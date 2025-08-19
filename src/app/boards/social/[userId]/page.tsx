'use client'

import { CorkBoard } from '@/components/boards/CorkBoard'
import { useAuth } from '@/contexts/AuthContext'
import { useEffect, useState } from 'react'

interface SocialBoardPageProps {
  params: {
    userId: string
  }
}

export default function SocialBoardPage({ params }: SocialBoardPageProps) {
  const { user } = useAuth()
  const [userInfo, setUserInfo] = useState<{ displayName: string; id: string; socialBoardId: string } | null>(null)

  // Fetch user info and social board from the database
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        // Check if params.userId is an email or user ID
        const isEmail = params.userId.includes('@')
        
        let userData
        if (isEmail) {
          // If it's an email, find user by email first
          const userResponse = await fetch(`/api/users/email/${encodeURIComponent(params.userId)}`)
          if (userResponse.ok) {
            userData = await userResponse.json()
          } else {
            throw new Error('User not found by email')
          }
        } else {
          // If it's a user ID, fetch directly
          const userResponse = await fetch(`/api/users/${params.userId}`)
          if (userResponse.ok) {
            userData = await userResponse.json()
          } else {
            throw new Error('User not found by ID')
          }
        }
        
        if (userData?.user) {
          // Then get the user's social board
          const boardResponse = await fetch(`/api/boards?type=SOCIAL&socialOwnerId=${userData.user.id}`)
          if (boardResponse.ok) {
            const boardData = await boardResponse.json()
            const socialBoard = boardData.boards?.[0]
            
            if (socialBoard) {
              setUserInfo({
                id: userData.user.id,
                displayName: userData.user.displayName,
                socialBoardId: socialBoard.id
              })
            } else {
              // Fallback if no social board found
              setUserInfo({
                id: userData.user.id,
                displayName: userData.user.displayName,
                socialBoardId: userData.user.id
              })
            }
          } else {
            // Fallback if board fetch fails
            setUserInfo({
              id: userData.user.id,
              displayName: userData.user.displayName,
              socialBoardId: userData.user.id
            })
          }
        } else {
          throw new Error('Invalid user data')
        }
      } catch (error) {
        console.error('Error fetching user info:', error)
        // Fallback to mock data on error
        setUserInfo({
          id: params.userId,
          displayName: `User ${params.userId}`,
          socialBoardId: params.userId
        })
      }
    }

    fetchUserInfo()
  }, [params.userId])

  if (!userInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-white text-2xl">👤</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Loading User Board...</h1>
        </div>
      </div>
    )
  }

  return (
    <CorkBoard
      boardId={userInfo.socialBoardId}
      boardName={`${userInfo.displayName}'s Social Board`}
      boardType="SOCIAL"
    />
  )
}
