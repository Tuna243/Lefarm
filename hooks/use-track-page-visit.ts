import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function useTrackPageVisit() {
  const pathname = usePathname()

  useEffect(() => {
    if (!pathname) return

    // Skip admin pages and API routes from being tracked
    if (pathname.startsWith('/admin')) return

    // Track the visit
    const trackVisit = async () => {
      try {
        await fetch('/api/analytics/visits', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            page: pathname,
          }),
        })
      } catch (error) {
        console.error('Failed to track visit:', error)
      }
    }

    trackVisit()
  }, [pathname])
}
