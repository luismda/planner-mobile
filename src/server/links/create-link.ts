import { api } from '../api'

export interface CreateLinkRequest {
  trip_id: string
  url: string
  title: string
}

export async function createLink({ trip_id, url, title }: CreateLinkRequest) {
  const { data } = await api.post<{ linkId: string }>(
    `/trips/${trip_id}/links`,
    {
      title,
      url,
    },
  )

  return data
}
