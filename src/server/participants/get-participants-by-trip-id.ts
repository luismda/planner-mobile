import { api } from '../api'

export interface GetParticipantsByTripIdResponse {
  id: string
  name: string
  email: string
  is_confirmed: boolean
}

export async function getParticipantsByTripId(tripId: string) {
  const { data } = await api.get<{
    participants: GetParticipantsByTripIdResponse[]
  }>(`/trips/${tripId}/participants`)

  return data
}
