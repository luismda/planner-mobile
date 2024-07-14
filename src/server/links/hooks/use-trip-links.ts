import { useQuery } from '@tanstack/react-query'

import { getLinksByTripId } from '../get-links-by-trip-id'

export function useTripLinks(tripId: string) {
  return useQuery({
    queryKey: ['trip-links', tripId],
    queryFn: () => getLinksByTripId(tripId),
  })
}
