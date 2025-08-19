'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/Button'
import { Pin, Search, Menu, X, Users } from 'lucide-react'
import { LoginModal } from '@/components/auth/LoginModal'
import { RegisterModal } from '@/components/auth/RegisterModal'
import { PinPurchaseModal } from '@/components/pins/PinPurchaseModal'
import { MobileMenu } from './MobileMenu'


export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isPinPurchaseModalOpen, setIsPinPurchaseModalOpen] = useState(false)

  
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    setIsUserMenuOpen(false)
  }

  const handleOpenPinPurchaseModal = () => {
    setIsPinPurchaseModalOpen(true)
  }


  return (
    <>
      <header className="bg-white/80 backdrop-blur-md border-b border-amber-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">i</span>
              </div>
              <span className="text-xl font-bold text-gray-900">CorkIt</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/explore" className="text-gray-700 hover:text-amber-600 transition-colors">
                Explore
              </Link>
              <Link href="/favorites" className="text-gray-700 hover:text-amber-600 transition-colors">
                Favorites
              </Link>
              {user?.isAdmin && (
                <Link href="/admin" className="text-gray-700 hover:text-amber-600 transition-colors">
                  Admin
                </Link>
              )}
              <Link href="/about" className="text-gray-700 hover:text-amber-600 transition-colors">
                About
              </Link>
              <Link href="/pricing" className="text-gray-700 hover:text-amber-600 transition-colors">
                Pricing
              </Link>
            </nav>



            {/* User Actions */}
            <div className="flex items-center space-x-4">
              {user ? (
                <>




                  {/* Messages */}
                  <Button variant="ghost" size="sm" className="hidden sm:flex">
                    {/* <MessageCircle className="w-4 h-4 mr-2" /> */}
                    Messages
                  </Button>

                  {/* Notifications */}
                  <Button variant="ghost" size="sm" className="hidden sm:flex">
                    {/* <Bell className="w-4 h-4 mr-2" /> */}
                    Notifications
                  </Button>

                  {/* Buy Pins */}
                  <Button variant="ghost" size="sm" className="hidden sm:flex" onClick={handleOpenPinPurchaseModal}>
                    <Pin className="w-4 h-4 mr-2" />
                    Buy Pins
                  </Button>

                  {/* User Menu */}
                  <div className="relative">
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {user.displayName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="hidden sm:block text-sm font-medium text-gray-700">
                        {user.displayName}
                      </span>
                    </button>

                    {/* User Dropdown */}
                    {isUserMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                        <Link
                          href={`/boards/social/${user.id}`}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Users className="w-4 h-4 mr-2" />
                          Social Board
                        </Link>
                        <Link
                          href="/settings"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          {/* <Settings className="w-4 h-4 mr-2" /> */}
                          Settings
                        </Link>

                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          {/* <LogOut className="w-4 h-4 mr-2" /> */}
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Button variant="ghost" size="sm" onClick={() => setIsLoginModalOpen(true)}>
                    {/* <User className="w-4 h-4 mr-2" /> */}
                    Sign In
                  </Button>
                  <Button onClick={() => setIsRegisterModalOpen(true)}>
                    Get Started
                  </Button>
                </>
              )}
              
              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <MobileMenu 
          isOpen={isMobileMenuOpen} 
          onClose={() => setIsMobileMenuOpen(false)}
          onOpenLogin={() => setIsLoginModalOpen(true)}
          onOpenRegister={() => setIsRegisterModalOpen(true)}
          user={user}
          onLogout={handleLogout}
        />
      </header>

      {/* Auth Modals - Moved outside header to break stacking context */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSwitchToRegister={() => {
          setIsLoginModalOpen(false)
          setIsRegisterModalOpen(true)
        }}
      />

      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onSwitchToLogin={() => {
          setIsRegisterModalOpen(false)
          setIsLoginModalOpen(true)
        }}
      />

      <PinPurchaseModal
        isOpen={isPinPurchaseModalOpen}
        onClose={() => setIsPinPurchaseModalOpen(false)}
        onSuccess={() => {
          // Refresh user data or show success message
          console.log('Pin pack purchased successfully!')
        }}
      />


    </>
  )
}
