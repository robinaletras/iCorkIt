import { Search, Pin, Share, Users } from 'lucide-react'

const steps = [
  {
    icon: Search,
    title: 'Discover Boards',
    description: 'Browse through our network of boards, from national to local levels. Find communities that match your interests and location.',
    color: 'bg-blue-100 text-blue-600'
  },
  {
    icon: Pin,
    title: 'Pin Your Content',
    description: 'Use pins to keep important posts visible for up to 7 days. Pinned content stays at the top and can\'t be covered by new posts.',
    color: 'bg-amber-100 text-amber-600'
  },
  {
    icon: Share,
    title: 'Share & Engage',
    description: 'Post your content, interact with others, and build meaningful connections within your community.',
    color: 'bg-green-100 text-green-600'
  },
  {
    icon: Users,
    title: 'Build Community',
    description: 'Create your own boards, invite friends, and foster a vibrant community around shared interests.',
    color: 'bg-purple-100 text-purple-600'
  }
]

export function HowItWorks() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How iCorkIt Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Getting started with iCorkIt is simple. Follow these four easy steps to begin sharing 
            and connecting with your community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              {/* Step Number */}
              <div className="w-12 h-12 bg-amber-500 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                {index + 1}
              </div>
              
              {/* Icon */}
              <div className={`w-16 h-16 ${step.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <step.icon className="w-8 h-8" />
              </div>
              
              {/* Content */}
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {step.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* Pins Explanation */}
        <div className="mt-16 bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              📌 Understanding Our Pin System
            </h3>
            <p className="text-gray-600 max-w-3xl mx-auto">
              We have two types of pins for different board types. Here's how they work:
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center p-6 bg-green-50 rounded-xl border border-green-200">
              <div className="text-2xl font-bold text-green-600 mb-2">🟢 Social Pins</div>
              <p className="text-gray-700 font-medium">For Personal Social Boards</p>
              <p className="text-sm text-gray-500 mt-2">200 free pins included</p>
              <p className="text-sm text-gray-500">$10 for 100 additional pins</p>
              <p className="text-sm text-gray-500">Pins are reusable</p>
            </div>
            
            <div className="text-center p-6 bg-amber-50 rounded-xl border border-amber-200">
              <div className="text-2xl font-bold text-amber-600 mb-2">🟡 Regular Pins</div>
              <p className="text-gray-700 font-medium">For City/State/National Boards</p>
              <p className="text-sm text-gray-500 mt-2">$1 per pin</p>
              <p className="text-sm text-gray-500">Pins are consumable</p>
              <p className="text-sm text-gray-500">Buy in packs for savings</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
