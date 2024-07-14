import { api } from '../api'

export interface LinkData {
  id: string
  url: string
  title: string
}

export interface GetLinksByTripIdResponse {
  links: LinkData[]
}

export async function getLinksByTripId(tripId: string) {
  const { data } = await api.get<GetLinksByTripIdResponse>(
    `/trips/${tripId}/links`,
  )

  return data
}
