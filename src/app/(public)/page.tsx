import { Hero } from '@/components/home/hero'
import { HowItWorks } from '@/components/home/how-it-works'
import { WhoWeAre } from '@/components/home/who-we-are'
import { FAQ } from '@/components/home/faq'
import { ContactCTA } from '@/components/home/contact-cta'
import { TasmaniaMap } from '@/components/home/tasmania-map'
import { getTotalBagsDelivered } from '@/lib/donations'

// Always read live totals — ISR (revalidate=60) still served stale counts after checkout.
export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const familiesCount = await getTotalBagsDelivered()

  return (
    <>
      <Hero familiesCount={familiesCount} />
      <HowItWorks />
      <WhoWeAre />
      <TasmaniaMap />
      <FAQ />
      <ContactCTA />
    </>
  )
}
