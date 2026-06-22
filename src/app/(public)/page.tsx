import { Hero } from '@/components/home/hero'
import { HowItWorks } from '@/components/home/how-it-works'
import { WhoWeAre } from '@/components/home/who-we-are'
import { FAQ } from '@/components/home/faq'
import { ContactCTA } from '@/components/home/contact-cta'
import { TasmaniaMap } from '@/components/home/tasmania-map'
import { createAdminClient } from '@/lib/supabase/admin'

async function getTotalFamiliesFed(): Promise<number> {
  try {
    const supabase = createAdminClient()
    const { data } = await supabase.from('donations').select('bags')
    if (!data) return 0
    return data.reduce((sum, row) => sum + (row.bags ?? 0), 0)
  } catch {
    return 0
  }
}

export default async function HomePage() {
  const familiesCount = await getTotalFamiliesFed()

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
