import { useQuery } from '@tanstack/react-query'

import { getActivitiesByTripId } from '../get-activities-by-trip-id'

export function useTripActivities(tripId: string) {
  return useQuery({
    queryKey: ['trip-activities', tripId],
    queryFn: () => getActivitiesByTripId(tripId),
  })
}
