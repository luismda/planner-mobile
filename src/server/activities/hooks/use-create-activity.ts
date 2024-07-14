import { useMutation, useQueryClient } from '@tanstack/react-query'

import { createActivity } from '../create-activity'

export function useCreateActivity() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createActivity,
    onSuccess(_, { trip_id: tripId }) {
      return queryClient.invalidateQueries({
        queryKey: ['trip-activities', tripId],
      })
    },
    onError(error) {
      console.warn('useCreateActivity', error)
    },
  })
}
