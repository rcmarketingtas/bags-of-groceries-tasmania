import Link from 'next/link'
import { Heart, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getLeaderboardDonations } from '@/lib/donations'
import { formatRelativeTime } from '@/lib/utils'

type DonorLeaderboardProps = {
  variant?: 'sage' | 'white'
  /** When true, empty state scrolls to the donation form instead of linking to /sponsor. */
  onSponsorPage?: boolean
}

export async function DonorLeaderboard({
  variant = 'sage',
  onSponsorPage = false,
}: DonorLeaderboardProps) {
  const donors = await getLeaderboardDonations(10)
  const isSage = variant === 'sage'

  return (
    <section
      className={isSage ? 'section-sage py-12' : 'section-white py-12'}
      id={onSponsorPage ? 'recent-supporters' : undefined}
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <div
            className={
              isSage
                ? 'mb-3 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white'
                : 'mb-3 inline-flex items-center gap-1.5 rounded-full border border-[#D5E0DA] bg-[#F4F7F5] px-3 py-1 text-xs font-medium text-[#1c4d31]'
            }
          >
            <Heart
              className={
                isSage
                  ? 'h-3 w-3 fill-white text-white'
                  : 'h-3 w-3 fill-[#1c4d31] text-[#1c4d31]'
              }
            />
            Community Giving
          </div>
          <h2
            className={
              isSage
                ? 'mb-2 text-2xl font-bold tracking-tight text-white sm:text-3xl'
                : 'mb-2 text-2xl font-bold tracking-tight text-black sm:text-3xl'
            }
          >
            Recent Supporters
          </h2>
          <p
            className={
              isSage
                ? 'text-sm text-[#A3C2B2]'
                : 'text-sm text-[#1c4d31]/80'
            }
          >
            Tasmanians stepping up to put food on the table for families doing
            it tough.
          </p>
        </div>

        {donors.length === 0 ? (
          <div className="card-light px-6 py-10 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#3d6b51]/15">
              <ShoppingBag className="h-5 w-5 text-[#1c4d31]" />
            </div>
            <p className="mb-4 text-base font-medium text-black">
              {onSponsorPage
                ? 'You could be the first supporter listed here'
                : 'Be the first to give to a family'}
            </p>
            <p className="mb-6 text-sm leading-relaxed text-[#1c4d31]/80">
              {onSponsorPage
                ? 'Complete the form below to buy a bag — your gift helps a Tasmanian family and shows up on this leaderboard.'
                : "Every bag of groceries makes a real difference. Buy a bag today and we'll make sure it reaches a family that needs it."}
            </p>
            {onSponsorPage ? (
              <Button
                asChild
                size="lg"
                className="btn-glow bg-[#1c4d31] text-white hover:bg-[#163d27]"
              >
                <a href="#donation-form">Buy Your First Bag</a>
              </Button>
            ) : (
              <Button
                asChild
                size="lg"
                className="btn-glow bg-[#1c4d31] text-white hover:bg-[#163d27]"
              >
                <Link href="/sponsor">Buy a Bag of Groceries</Link>
              </Button>
            )}
          </div>
        ) : (
          <>
            <ul className="space-y-2">
              {donors.map((donor) => (
                <li
                  key={`${donor.displayName}-${donor.lastDonationAt}`}
                  className="card-light flex items-center gap-3 px-4 py-3 sm:px-5 sm:py-3.5"
                >
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#3d6b51]/15 text-xs font-bold text-[#1c4d31]"
                    aria-hidden="true"
                  >
                    {donor.displayName.charAt(0).toUpperCase()}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-black">
                      {donor.displayName}
                    </p>
                    <p className="text-xs text-[#1c4d31]/70">
                      {formatRelativeTime(donor.lastDonationAt)}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-1 rounded-full bg-[#1c4d31]/10 px-2.5 py-1 text-xs font-semibold text-[#1c4d31]">
                    <ShoppingBag className="h-3 w-3" />
                    {donor.bags} {donor.bags === 1 ? 'bag' : 'bags'}
                  </div>
                </li>
              ))}
            </ul>

            {!onSponsorPage && (
              <div className="mt-8 text-center">
                <Button
                  asChild
                  size="lg"
                  className="btn-glow border border-white/25 bg-white/10 text-white hover:bg-white/20"
                >
                  <Link href="/sponsor">Join Them — Buy a Bag</Link>
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
