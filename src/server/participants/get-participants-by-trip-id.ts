import { api } from '../api'

export interface ParticipantData {
  id: string
  name: string
  email: string
  is_confirmed: boolean
}

export interface GetParticipantsByTripIdResponse {
  participants: ParticipantData[]
}

export async function getParticipantsByTripId(tripId: string) {
  const { data } = await api.get<GetParticipantsByTripIdResponse>(
    `/trips/${tripId}/participants`,
  )

  return data
}
