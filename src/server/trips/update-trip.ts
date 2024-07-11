import { api } from '../api'

export interface UpdateTripRequest {
  id: string
  destination: string
  starts_at: string
  ends_at: string
}

export async function updateTrip({
  id,
  destination,
  starts_at,
  ends_at,
}: UpdateTripRequest) {
  await api.put(`/trips/${id}`, {
    destination,
    starts_at,
    ends_at,
  })
}
