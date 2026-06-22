import { Hero } from '@/components/home/hero'
import { HowItWorks } from '@/components/home/how-it-works'
import { WhoWeAre } from '@/components/home/who-we-are'
import { FAQ } from '@/components/home/faq'
import { ContactCTA } from '@/components/home/contact-cta'

export default function HomePage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <WhoWeAre />
      <FAQ />
      <ContactCTA />
    </>
  )
}
