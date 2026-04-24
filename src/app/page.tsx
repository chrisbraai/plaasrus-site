import { HeroStoep } from '@/components/HeroStoep'
import { TheHouse } from '@/components/TheHouse'
import { TheFarm } from '@/components/TheFarm'
import { TheMornings } from '@/components/TheMornings'
import { BookSection } from '@/components/BookSection'
import { FindUs } from '@/components/FindUs'

export default function Home() {
  return (
    <main className="flex-1">
      <HeroStoep />
      <TheHouse />
      <TheFarm />
      <TheMornings />
      <BookSection />
      <FindUs />
    </main>
  )
}
