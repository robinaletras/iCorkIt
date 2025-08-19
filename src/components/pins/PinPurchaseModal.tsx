'use client'

import React, { useState, useEffect } from 'react'
import { X, Pin, Users, MapPin, CreditCard, Lock } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'

// Load Stripe
const stripePromise = loadStripe('pk_live_51RoSL0FMw6pWHVm7fXnVbrs8BOT3228LWKOyWLsIekrNu0AumIWOcBYzeF6MUUmO2mL8qIcBwXS1DNA9o3Gs1OXQ00vieij561')

interface PinPurchaseModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

interface PinPack {
  type: 'SOCIAL' | 'REGULAR'
  size: number
  price: number
  description: string
  savings?: string
}

const pinPacks: PinPack[] = [
  {
    type: 'SOCIAL',
    size: 100,
    price: 10.00,
    description: 'Additional social pins for your personal board'
  },
  {
    type: 'REGULAR',
    size: 25,
    price: 25.00,
    description: 'Regular pins for city, state, and national boards'
  },
  {
    type: 'REGULAR',
    size: 100,
    price: 90.00,
    description: 'Regular pins for city, state, and national boards',
    savings: '10% savings'
  },
  {
    type: 'REGULAR',
    size: 500,
    price: 400.00,
    description: 'Regular pins for city, state, and national boards',
    savings: '20% savings'
  }
]

const cardElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#9e2146',
    },
  },
}

function PinPurchaseForm({ selectedPack, onSuccess, onClose, onPackSelect }: { 
  selectedPack: PinPack | null
  onSuccess: () => void
  onClose: () => void
  onPackSelect: (pack: PinPack) => void
}) {
  const { user, updateSocialPins, updatePinPacks } = useAuth()
  const stripe = useStripe()
  const elements = useElements()
  const [isPurchasing, setIsPurchasing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handlePurchase = async () => {
    if (!selectedPack || !user || !stripe || !elements) return

    setIsPurchasing(true)
    setError(null)

    try {
      // Create payment method
      const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement)!,
        billing_details: {
          name: user.displayName,
          email: user.email,
        },
      })

      if (paymentMethodError) {
        setError(paymentMethodError.message || 'Payment method creation failed')
        setIsPurchasing(false)
        return
      }

      // Make purchase request
      const response = await fetch('/api/pins/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          packType: selectedPack.type,
          packSize: selectedPack.size,
          paymentMethodId: paymentMethod.id
        })
      })

      if (response.ok) {
        const result = await response.json()
        
        if (result.requiresAction) {
          // Handle 3D Secure or other authentication
          const { error: confirmError } = await stripe.confirmCardPayment(result.clientSecret)
          
          if (confirmError) {
            setError(confirmError.message || 'Payment confirmation failed')
            setIsPurchasing(false)
            return
          }
        }
        
        // Update local state
        if (selectedPack.type === 'SOCIAL') {
          updateSocialPins(user.socialPins + selectedPack.size)
        } else {
          updatePinPacks(user.pinPacks + selectedPack.size)
        }
        
        onSuccess()
        onClose()
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to purchase pin pack')
      }
    } catch (error) {
      console.error('Error purchasing pin pack:', error)
      setError('Network error. Please try again.')
    } finally {
      setIsPurchasing(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Current Balance */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Current Pin Balance</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-green-600" />
            <span className="text-gray-700">Social Pins:</span>
            <span className="font-semibold text-green-600">{user?.socialPins || 0}</span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-amber-600" />
            <span className="text-gray-700">Pin Packs:</span>
            <span className="font-semibold text-amber-600">{user?.pinPacks || 0}</span>
          </div>
        </div>
      </div>

      {/* Pin Pack Options */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Your Pin Pack</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pinPacks.map((pack, index) => (
            <div
              key={index}
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                selectedPack === pack
                  ? 'border-amber-500 bg-amber-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => onPackSelect(pack)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {pack.type === 'SOCIAL' ? (
                    <Users className="w-5 h-5 text-green-600" />
                  ) : (
                    <MapPin className="w-5 h-5 text-amber-600" />
                  )}
                  <span className="font-semibold text-gray-900">
                    {pack.type === 'SOCIAL' ? 'Social' : 'Regular'} Pins
                  </span>
                </div>
                {pack.savings && (
                  <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    {pack.savings}
                  </span>
                )}
              </div>
              
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {pack.size} Pins
              </div>
              
              <div className="text-2xl font-bold text-amber-600 mb-2">
                ${pack.price.toFixed(2)}
              </div>
              
              <p className="text-sm text-gray-600 mb-2">
                {pack.description}
              </p>
              
              <div className="text-xs text-gray-500">
                {pack.type === 'SOCIAL' 
                  ? 'Pins are reusable and return after use'
                  : 'Pins are consumable and used permanently'
                }
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Form */}
      {selectedPack && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Payment Information</h3>
          
          <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
            <div className="flex items-center space-x-2 mb-3">
              <Lock className="w-4 h-4 text-green-600" />
              <span className="text-sm text-gray-600">Secure payment powered by Stripe</span>
            </div>
            
            <CardElement options={cardElementOptions} />
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="p-3 bg-red-100 border border-red-300 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Purchase Button */}
      <div className="flex justify-end space-x-3">
        <button
          onClick={onClose}
          className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handlePurchase}
          disabled={!selectedPack || !stripe || isPurchasing}
          className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
            selectedPack && stripe && !isPurchasing
              ? 'bg-amber-600 text-white hover:bg-amber-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isPurchasing ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Processing...</span>
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4" />
              <span>Purchase Pack - ${selectedPack?.price.toFixed(2)}</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export function PinPurchaseModal({ isOpen, onClose, onSuccess }: PinPurchaseModalProps) {
  const [selectedPack, setSelectedPack] = useState<PinPack | null>(null)

  if (!isOpen) return null

  const handlePackSelect = (pack: PinPack) => {
    setSelectedPack(pack)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
              <Pin className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Purchase Pin Packs</h2>
              <p className="text-gray-600">Expand your pinning capacity</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <Elements stripe={stripePromise}>
            <PinPurchaseForm 
              selectedPack={selectedPack}
              onSuccess={onSuccess}
              onClose={onClose}
              onPackSelect={handlePackSelect}
            />
          </Elements>
        </div>
      </div>
    </div>
  )
}
