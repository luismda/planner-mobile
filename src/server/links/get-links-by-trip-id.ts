import { api } from '../api'

export interface GetLinksByTripIdResponse {
  id: string
  url: string
  title: string
}

export async function getLinksByTripId(tripId: string) {
  const { data } = await api.get<{ links: GetLinksByTripIdResponse[] }>(
    `/trips/${tripId}/links`,
  )

  return data
}
