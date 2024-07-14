import { useMutation, useQueryClient } from '@tanstack/react-query'

import { GetTripDetailsResponse } from '../get-trip-details'
import { updateTrip } from '../update-trip'

export function useUpdateTrip() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateTrip,
    onSuccess(_, updatedTrip) {
      const queryKey = ['trip-details', updatedTrip.id]
      const cached = queryClient.getQueryData<GetTripDetailsResponse>(queryKey)

      if (cached) {
        queryClient.setQueryData<GetTripDetailsResponse>(queryKey, {
          ...cached,
          trip: {
            ...cached.trip,
            destination: updatedTrip.destination,
            starts_at: updatedTrip.starts_at,
            ends_at: updatedTrip.ends_at,
          },
        })
      }
    },
    onError(error) {
      console.warn('useUpdateTrip', error)
    },
  })
}
