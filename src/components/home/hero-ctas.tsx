import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface HeroCTAsProps {
  layout?: 'row' | 'column'
  size?: 'default' | 'sm'
  variant?: 'sage' | 'light'
  onNavigate?: () => void
}

export function HeroCTAs({
  layout = 'row',
  size = 'default',
  variant = 'sage',
  onNavigate,
}: HeroCTAsProps) {
  const isRow = layout === 'row'
  const btnSize = size === 'sm' ? 'sm' : 'lg'
  const isLight = variant === 'light'

  return (
    <div
      className={
        isRow
          ? 'flex flex-col items-center gap-4 sm:flex-row sm:gap-5'
          : 'flex w-full flex-col gap-4'
      }
    >
      <Button
        asChild
        size={btnSize}
        className={
          isRow
            ? size === 'sm'
              ? 'btn-glow bg-[#1c4d31] text-white hover:bg-[#163d27]'
              : 'btn-glow w-full bg-[#1c4d31] text-white hover:bg-[#163d27] sm:w-auto'
            : 'btn-glow w-full bg-[#1c4d31] text-white hover:bg-[#163d27]'
        }
      >
        <Link href="/sponsor" onClick={onNavigate}>
          Give to a Family
        </Link>
      </Button>

      <div className="flex flex-col items-center gap-1">
        <Button
          asChild
          variant="outline"
          size={btnSize}
          className={
            isLight
              ? isRow
                ? size === 'sm'
                  ? 'border-[#D5E0DA] text-[#1c4d31] hover:bg-[#F4F7F5] hover:text-[#1c4d31]'
                  : 'w-full border-[#D5E0DA] text-[#1c4d31] hover:bg-[#F4F7F5] hover:text-[#1c4d31] sm:w-auto'
                : 'w-full border-[#D5E0DA] text-[#1c4d31] hover:bg-[#F4F7F5] hover:text-[#1c4d31]'
              : isRow
                ? size === 'sm'
                  ? 'border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white'
                  : 'w-full border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white sm:w-auto'
                : 'w-full border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white'
          }
        >
          <Link href="/apply" onClick={onNavigate}>
            I Have a Family
          </Link>
        </Button>
        <span
          className={
            isLight
              ? 'text-[10px] font-medium uppercase tracking-wider text-[#1c4d31]/60'
              : 'text-xs font-medium uppercase tracking-wider text-white/70'
          }
        >
          In need
        </span>
      </div>
    </div>
  )
}
