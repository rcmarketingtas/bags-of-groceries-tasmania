import { Hero } from '@/components/home/hero'
import { HowItWorks } from '@/components/home/how-it-works'
import { FAQ } from '@/components/home/faq'
import { ContactCTA } from '@/components/home/contact-cta'

export default function HomePage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <FAQ />
      <ContactCTA />
    </>
  )
}
