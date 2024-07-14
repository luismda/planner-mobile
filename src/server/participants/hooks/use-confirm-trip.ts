import { useMutation, useQueryClient } from '@tanstack/react-query'

import { confirmTripByParticipantId } from '../confirm-trip-by-participant-id'
import { GetParticipantsByTripIdResponse } from '../get-participants-by-trip-id'

export function useConfirmTrip() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: confirmTripByParticipantId,
    onSuccess(_, { participant_id: participantId }) {
      const participantsListCache =
        queryClient.getQueriesData<GetParticipantsByTripIdResponse>({
          queryKey: ['trip-participants'],
        })

      participantsListCache.forEach(([cacheKey, cacheData]) => {
        if (!cacheData) {
          return
        }

        queryClient.setQueryData<GetParticipantsByTripIdResponse>(cacheKey, {
          ...cacheData,
          participants: cacheData.participants.map((participant) => {
            if (participant.id === participantId) {
              return {
                ...participant,
                is_confirmed: true,
              }
            }

            return participant
          }),
        })
      })
    },
    onError(error) {
      console.warn('useConfirmTrip', error)
    },
  })
}
