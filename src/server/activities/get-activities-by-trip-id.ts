import { api } from '../api'

export interface ActivityData {
  id: string
  occurs_at: string
  title: string
}

export interface DayActivities {
  date: string
  activities: ActivityData[]
}

export interface GetActivitiesByTripIdResponse {
  activities: DayActivities[]
}

export async function getActivitiesByTripId(tripId: string) {
  const { data } = await api.get<GetActivitiesByTripIdResponse>(
    `/trips/${tripId}/activities`,
  )

  return data
}
