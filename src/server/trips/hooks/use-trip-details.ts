import { useQuery } from '@tanstack/react-query'

import { getTripDetails } from '../get-trip-details'

export function useTripDetails(tripId: string) {
  return useQuery({
    queryKey: ['trip-details', tripId],
    queryFn: () => getTripDetails(tripId),
  })
}
