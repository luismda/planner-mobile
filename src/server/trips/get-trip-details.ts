import { api } from '../api'

export interface TripData {
  id: string
  destination: string
  starts_at: string
  ends_at: string
  is_confirmed: boolean
}

export interface GetTripDetailsResponse {
  trip: TripData
}

export async function getTripDetails(tripId: string) {
  const { data } = await api.get<GetTripDetailsResponse>(`/trips/${tripId}`)

  return data
}
