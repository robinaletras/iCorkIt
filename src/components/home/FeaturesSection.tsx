import { Pin, Globe, Users, Shield, TrendingUp, MessageCircle } from 'lucide-react'

const features = [
  {
    icon: Pin,
    title: 'Smart Pinning System',
    description: 'Pin your important content for up to 7 days. Pinned posts stay visible and can\'t be covered by new content.',
    color: 'from-amber-500 to-orange-500'
  },
  {
    icon: Globe,
    title: 'Multi-Level Boards',
    description: 'From national to city-level boards, find the perfect community for your content. Create your own board anytime.',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Users,
    title: 'Social Connections',
    description: 'Connect with friends, discover social boards, and build meaningful relationships within your community.',
    color: 'from-green-500 to-emerald-500'
  },
  {
    icon: Shield,
    title: 'Content Moderation',
    description: 'We maintain quality across all boards while preserving user-generated content. Safe, respectful, and engaging.',
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: TrendingUp,
    title: 'Real-Time Relevance',
    description: 'Content is organized by recency and relevance. The newest and most engaging posts get the spotlight they deserve.',
    color: 'from-red-500 to-pink-500'
  },
  {
    icon: MessageCircle,
    title: 'Community Engagement',
    description: 'Comment, like, and interact with posts. Build conversations and strengthen community bonds.',
    color: 'from-indigo-500 to-purple-500'
  }
]

export function FeaturesSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose iCorkIt?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our platform combines the simplicity of traditional cork boards with the power of modern technology, 
            creating an engaging and effective way to share and discover content.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-6 bg-gray-50 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300 border border-transparent hover:border-gray-200"
            >
              <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Special Highlight */}
        <div className="mt-16 p-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl text-white text-center">
          <h3 className="text-2xl font-bold mb-4">
            🚨 Amber Alert Integration Coming Soon
          </h3>
          <p className="text-amber-100 max-w-2xl mx-auto">
            We're working to integrate the Amber Alert system to help keep communities safe. 
            Important safety information will be automatically pinned to relevant boards.
          </p>
        </div>
      </div>
    </section>
  )
}
