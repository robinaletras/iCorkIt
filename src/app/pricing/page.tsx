import React from 'react'
import { Check, Star, Pin, Zap, Crown, Users, MapPin } from 'lucide-react'

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-amber-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get started for free with 200 social pins, then choose the pin packs that fit your needs. 
              All plans include our core features with no hidden fees.
            </p>
          </div>
        </div>
      </div>

      {/* Social Pins - Free Starter */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
            Social Pins - Always Free to Start
          </h2>
          <p className="text-lg text-gray-600 text-center mb-12">
            Every user gets 200 free social pins for their personal social board. These pins are reusable!
          </p>
          
          <div className="bg-white rounded-2xl shadow-xl border-2 border-green-500 p-8 max-w-2xl mx-auto">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">Free Social Pins</h3>
              <p className="text-gray-600">Perfect for personal social boards</p>
            </div>
            
            <div className="text-center mb-6">
              <span className="text-5xl font-bold text-green-600">200</span>
              <span className="text-2xl text-gray-600 ml-2">Free Social Pins</span>
            </div>
            
            <ul className="space-y-3 mb-8">
              <li className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-3" />
                <span>200 social pins included with every account</span>
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-3" />
                <span>Pins are reusable - they return after use</span>
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-3" />
                <span>Can only be used on your social board</span>
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-3" />
                <span>Never expire - use them anytime</span>
              </li>
            </ul>
            
            <div className="text-center">
              <span className="text-sm text-gray-500">No credit card required • Sign up now</span>
            </div>
          </div>
          
          {/* Additional Social Pins */}
          <div className="bg-white rounded-2xl shadow-lg border-2 border-blue-200 p-8 max-w-2xl mx-auto mt-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Pin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Need More Social Pins?</h3>
              <p className="text-gray-600">Purchase additional social pins when you need them</p>
            </div>
            
            <div className="text-center mb-6">
              <span className="text-4xl font-bold text-blue-600">$10</span>
              <span className="text-2xl text-gray-600 ml-2">for 100 Social Pins</span>
            </div>
            
            <ul className="space-y-3 mb-8">
              <li className="flex items-center">
                <Check className="w-5 h-5 text-blue-500 mr-3" />
                <span>100 additional social pins</span>
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-blue-500 mr-3" />
                <span>Same reusable behavior</span>
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-blue-500 mr-3" />
                <span>Only $0.10 per pin</span>
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-blue-500 mr-3" />
                <span>Instant delivery to your account</span>
              </li>
            </ul>
            
            <div className="text-center">
              <span className="text-sm text-gray-500">Available in your account dashboard</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pin Packs for Location Boards */}
      <div className="py-16 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
            Pin Packs for Location Boards
          </h2>
          <p className="text-lg text-gray-600 text-center mb-12">
            Pin your posts on city, state, and national boards. Each pin costs $1 and lasts 1 day.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Basic Package */}
            <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Pin className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Starter Pack</h3>
                <p className="text-gray-600">Perfect for occasional use</p>
              </div>
              
              <div className="text-center mb-6">
                <span className="text-4xl font-bold text-gray-900">$25</span>
                <span className="text-gray-600">/pack</span>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>25 pins included</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>Use on any location board</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>1 pin = 1 day of visibility</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>Never expire</span>
                </li>
              </ul>
              
              <button className="w-full bg-amber-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-amber-700 transition-colors">
                Buy Pack
              </button>
            </div>

            {/* Pro Package */}
            <div className="bg-white rounded-2xl shadow-xl border-2 border-amber-500 p-8 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center">
                  <Star className="w-4 h-4 mr-2" />
                  Most Popular
                </div>
              </div>
              
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Pro Pack</h3>
                <p className="text-gray-600">For active community members</p>
              </div>
              
              <div className="text-center mb-6">
                <span className="text-4xl font-bold text-gray-900">$90</span>
                <span className="text-gray-600">/pack</span>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>100 pins included</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>Use on any location board</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>1 pin = 1 day of visibility</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>Never expire</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>10% savings vs. individual pins</span>
                </li>
              </ul>
              
              <button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 px-6 rounded-lg font-medium hover:from-amber-600 hover:to-orange-600 transition-colors">
                Choose Pro
              </button>
            </div>

            {/* Enterprise Package */}
            <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Crown className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Enterprise Pack</h3>
                <p className="text-gray-600">For businesses & organizations</p>
              </div>
              
              <div className="text-center mb-6">
                <span className="text-4xl font-bold text-gray-900">$400</span>
                <span className="text-gray-600">/pack</span>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>500 pins included</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>Use on any location board</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>1 pin = 1 day of visibility</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>Never expire</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>20% savings vs. individual pins</span>
                </li>
              </ul>
              
              <button className="w-full bg-gray-800 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-900 transition-colors">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Social Pin Packs */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
            Need More Social Pins?
          </h2>
          <p className="text-lg text-gray-600 text-center mb-12">
            Expand your social board capacity with additional social pin packs.
          </p>
          
          <div className="bg-white rounded-2xl shadow-xl border-2 border-blue-500 p-8 max-w-2xl mx-auto">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">Social Pin Pack</h3>
              <p className="text-gray-600">Expand your social board capacity</p>
            </div>
            
            <div className="text-center mb-6">
              <span className="text-5xl font-bold text-blue-600">$10</span>
              <span className="text-2xl text-gray-600 ml-2">for 25 Social Pins</span>
            </div>
            
            <ul className="space-y-3 mb-8">
              <li className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-3" />
                <span>25 additional social pins</span>
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-3" />
                <span>Pins are reusable - they return after use</span>
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-3" />
                <span>Can only be used on your social board</span>
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-3" />
                <span>Never expire - use them anytime</span>
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-3" />
                <span>Only $0.40 per pin (vs $1 for location boards)</span>
              </li>
            </ul>
            
            <button className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-600 hover:to-indigo-600 transition-colors">
              Buy Social Pin Pack
            </button>
          </div>
        </div>
      </div>

      {/* How Pinning Works */}
      <div className="py-16 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
            How Pinning Works
          </h2>
          <p className="text-lg text-gray-600 text-center mb-12">
            Two different pin systems for different types of boards.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Social Pins */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Social Pins</h3>
                <p className="text-gray-600">For your personal social board</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-green-600 font-bold text-sm">1</span>
                  </div>
                  <span>Pin your post on your social board</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-green-600 font-bold text-sm">2</span>
                  </div>
                  <span>Post stays visible for the duration</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-green-600 font-bold text-sm">3</span>
                  </div>
                  <span>Pin returns to your account after use</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-green-600 font-bold text-sm">4</span>
                  </div>
                  <span>Reuse the same pin again and again</span>
                </div>
              </div>
            </div>

            {/* Regular Pins */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Regular Pins</h3>
                <p className="text-gray-600">For city, state, and national boards</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-amber-600 font-bold text-sm">1</span>
                  </div>
                  <span>Pin your post on a location board</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-amber-600 font-bold text-sm">2</span>
                  </div>
                  <span>Post stays visible for the duration</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-amber-600 font-bold text-sm">3</span>
                  </div>
                  <span>Pin is consumed and not returned</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-amber-600 font-bold text-sm">4</span>
                  </div>
                  <span>Buy more pins when you need them</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What's the difference between social pins and regular pins?
              </h3>
              <p className="text-gray-600">
                Social pins are reusable and can only be used on your personal social board. Regular pins are consumable and can be used on any city, state, or national board. Social pins return to your account after use, while regular pins are consumed permanently.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                How long do pins last?
              </h3>
              <p className="text-gray-600">
                All pins last 1, 3, or 7 days depending on how many you use. You choose the duration when you pin a post. Longer durations cost more pins but provide better visibility.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I use social pins on location boards?
              </h3>
              <p className="text-gray-600">
                No, social pins can only be used on your personal social board. For city, state, and national boards, you need to purchase regular pins at $1 each.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Do pins expire?
              </h3>
              <p className="text-gray-600">
                No, pins never expire. You can use them anytime to pin posts. Social pins are reusable, while regular pins are consumed when used.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gradient-to-r from-amber-600 to-orange-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-amber-100 mb-8">
            Join thousands of communities already using iCorkIt to connect and grow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/boards"
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-amber-600 bg-white hover:bg-gray-50 transition-colors"
            >
              Explore Boards
            </a>
            <a
              href="/create-board"
              className="inline-flex items-center justify-center px-8 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-amber-700 transition-colors"
            >
              Create Your Board
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
