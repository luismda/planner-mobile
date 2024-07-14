import { useMutation, useQueryClient } from '@tanstack/react-query'

import { createLink } from '../create-link'

export function useCreateLink() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createLink,
    onSuccess(_, { trip_id: tripId }) {
      return queryClient.invalidateQueries({
        queryKey: ['trip-links', tripId],
      })
    },
    onError(error) {
      console.warn('useCreateLink', error)
    },
  })
}
