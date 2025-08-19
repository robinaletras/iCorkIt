import { HeroSection } from '@/components/home/HeroSection'
import { FeaturesSection } from '@/components/home/FeaturesSection'
import { BoardNavigation } from '@/components/home/BoardNavigation'
import { HowItWorks } from '@/components/home/HowItWorks'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <HowItWorks />
      <BoardNavigation />
    </div>
  )
}
