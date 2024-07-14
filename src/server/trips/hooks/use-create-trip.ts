import { useMutation } from '@tanstack/react-query'

import { saveTripStorage } from '@/storage/trips'

import { createTrip } from '../crate-trip'

export function useCreateTrip() {
  return useMutation({
    mutationFn: createTrip,
    onSuccess({ tripId }) {
      return saveTripStorage(tripId)
    },
    onError(error) {
      console.warn('useCreateTrip', error)
    },
  })
}
