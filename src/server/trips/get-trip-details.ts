import { api } from '../api'

export interface GetTripDetailsResponse {
  id: string
  destination: string
  starts_at: string
  ends_at: string
  is_confirmed: boolean
}

export async function getTripDetails(tripId: string) {
  const { data } = await api.get<{ trip: GetTripDetailsResponse }>(
    `/trips/${tripId}`,
  )

  return data
}
