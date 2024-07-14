import { useQuery } from '@tanstack/react-query'

import { getParticipantsByTripId } from '../get-participants-by-trip-id'

export function useTripParticipants(tripId: string) {
  return useQuery({
    queryKey: ['trip-participants', tripId],
    queryFn: () => getParticipantsByTripId(tripId),
  })
}
