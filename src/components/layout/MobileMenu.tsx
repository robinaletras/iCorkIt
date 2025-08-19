'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { X, User, Bell, MessageCircle, Home, MapPin, Users, Info, CreditCard, Crown, LogOut, Settings, Plus, Search, Pin } from 'lucide-react'
import { User as AuthUser } from '@/contexts/AuthContext'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  onOpenLogin: () => void
  onOpenRegister: () => void
  user: AuthUser | null
  onLogout: () => void
}

export function MobileMenu({ isOpen, onClose, onOpenLogin, onOpenRegister, user, onLogout }: MobileMenuProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      
      {/* Menu */}
      <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* User Info (if logged in) */}
          {user && (
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {user.displayName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{user.displayName}</h3>
                  <div className="flex items-center space-x-2 text-amber-700">
                    <Pin className="w-4 h-4" />
                    <span>{user.socialPins} Social Pins</span>
                  </div>
                  <div className="flex items-center space-x-2 text-amber-700">
                    <Pin className="w-4 h-4" />
                    <span>{user.pinPacks} Pin Packs</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="flex-1 p-4 space-y-2">
            <Link
              href="/"
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={onClose}
            >
              <Home className="w-5 h-5 text-gray-600" />
              <span className="text-gray-900">Home</span>
            </Link>
            

            
            <Link
              href="/explore"
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={onClose}
            >
              <Search className="w-5 h-5 text-gray-600" />
              <span className="text-gray-900">Explore</span>
            </Link>
            
            <Link
              href="/about"
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={onClose}
            >
              <Info className="w-5 h-5 text-gray-600" />
              <span className="text-gray-900">About</span>
            </Link>
            
            <Link
              href="/pricing"
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={onClose}
            >
              <CreditCard className="w-5 h-5 text-gray-600" />
              <span className="text-gray-900">Pricing</span>
            </Link>
            
            {/* Buy Pins Button */}
            <button
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors w-full text-left"
              onClick={onClose}
            >
              <Pin className="w-5 h-5 text-gray-600" />
              <span className="text-gray-900">Buy Pins</span>
            </button>
          </nav>

          {/* User Actions */}
          <div className="p-4 border-t border-gray-200 space-y-3">
            {user ? (
              <>
                <Link
                  href={`/boards/social/${user.id}`}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                  onClick={onClose}
                >
                  <User className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-900">Social Board</span>
                </Link>
                
                <Link
                  href="/settings"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                  onClick={onClose}
                >
                  <Settings className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-900">Settings</span>
                </Link>
                
                <Button variant="ghost" className="w-full justify-start">
                  <MessageCircle className="w-4 h-4 mr-3" />
                  Messages
                </Button>
                
                <Button variant="ghost" className="w-full justify-start">
                  <Bell className="w-4 h-4 mr-3" />
                  Notifications
                </Button>
                

                
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-red-600 hover:text-red-700"
                  onClick={() => {
                    onLogout()
                    onClose()
                  }}
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" className="w-full justify-start" onClick={onOpenLogin}>
                  <User className="w-4 h-4 mr-3" />
                  Sign In
                </Button>
                <Button className="w-full" onClick={onOpenRegister}>
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
