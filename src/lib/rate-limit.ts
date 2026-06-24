import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

let _ratelimit: Ratelimit | null = null

function getRatelimit(): Ratelimit | null {
  if (
    !process.env.UPSTASH_REDIS_REST_URL ||
    !process.env.UPSTASH_REDIS_REST_TOKEN
  ) {
    return null
  }
  if (!_ratelimit) {
    try {
      _ratelimit = new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.slidingWindow(5, '1 m'),
        analytics: false,
      })
    } catch (err) {
      console.error('Rate limit init failed (disabled):', err)
      return null
    }
  }
  return _ratelimit
}

export async function rateLimit(
  identifier: string,
): Promise<{ success: boolean }> {
  const rl = getRatelimit()
  if (!rl) return { success: true }

  try {
    return await rl.limit(identifier)
  } catch (err) {
    console.error('Rate limit check failed (allowing request):', err)
    return { success: true }
  }
}
