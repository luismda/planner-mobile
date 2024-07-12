import { api } from '../api'

export interface CreateActivityRequest {
  trip_id: string
  title: string
  occurs_at: string
}

export async function createActivity({
  trip_id,
  title,
  occurs_at,
}: CreateActivityRequest) {
  const { data } = await api.post<{ activityId: string }>(
    `/trips/${trip_id}/activities`,
    {
      occurs_at,
      title,
    },
  )

  return data
}
