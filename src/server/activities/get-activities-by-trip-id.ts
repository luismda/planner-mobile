import { api } from '../api'

export interface Activity {
  id: string
  occurs_at: string
  title: string
}

export interface GetActivitiesByTripIdResponse {
  date: string
  activities: Activity[]
}

export async function getActivitiesByTripId(tripId: string) {
  const { data } = await api.get<{
    activities: GetActivitiesByTripIdResponse[]
  }>(`/trips/${tripId}/activities`)

  return data
}
