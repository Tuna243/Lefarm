'use client'

import { useTrackPageVisit } from '@/hooks/use-track-page-visit'

export function PageVisitTracker() {
  useTrackPageVisit()
  return null
}
