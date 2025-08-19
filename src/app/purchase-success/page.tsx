'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { CheckCircle, Pin, Users, MapPin, ArrowRight } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function PurchaseSuccessPage() {
  const { user } = useAuth()
  const [purchaseDetails, setPurchaseDetails] = useState<any>(null)

  useEffect(() => {
    // Get purchase details from URL params or localStorage
    const urlParams = new URLSearchParams(window.location.search)
    const packType = urlParams.get('packType')
    const packSize = urlParams.get('packSize')
    const price = urlParams.get('price')

    if (packType && packSize && price) {
      setPurchaseDetails({
        packType,
        packSize: parseInt(packSize),
        price: parseFloat(price)
      })
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>

        {/* Success Message */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Purchase Successful! 🎉
        </h1>
        
        <p className="text-lg text-gray-600 mb-8">
          Your pin pack has been added to your account. You're all set to start pinning!
        </p>

        {/* Purchase Details */}
        {purchaseDetails && (
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Purchase Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  {purchaseDetails.packType === 'SOCIAL' ? (
                    <Users className="w-6 h-6 text-amber-600" />
                  ) : (
                    <MapPin className="w-6 h-6 text-amber-600" />
                  )}
                </div>
                <p className="text-sm text-gray-600">Pack Type</p>
                <p className="font-semibold text-gray-900">
                  {purchaseDetails.packType === 'SOCIAL' ? 'Social' : 'Regular'} Pins
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Pin className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-sm text-gray-600">Quantity</p>
                <p className="font-semibold text-gray-900">{purchaseDetails.packSize} Pins</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-xl font-bold text-blue-600">$</span>
                </div>
                <p className="text-sm text-gray-600">Total Paid</p>
                <p className="font-semibold text-gray-900">${purchaseDetails.price.toFixed(2)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Current Balance */}
        {user && (
          <div className="bg-amber-50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Your Updated Pin Balance</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-center space-x-2">
                <Users className="w-5 h-5 text-green-600" />
                <span className="text-gray-700">Social Pins:</span>
                <span className="font-semibold text-green-600">{user.socialPins}</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <MapPin className="w-5 h-5 text-amber-600" />
                <span className="text-gray-700">Pin Packs:</span>
                <span className="font-semibold text-amber-600">{user.pinPacks}</span>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 bg-amber-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-amber-700 transition-colors"
          >
            <span>Start Pinning</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          
          <div className="text-sm text-gray-500">
            <p>You'll receive a confirmation email shortly.</p>
            <p>Need help? Contact our support team.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
