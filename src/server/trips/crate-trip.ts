import { api } from '../api'

export interface CreateTripRequest {
  destination: string
  starts_at: string
  ends_at: string
  emails_to_invite: string[]
}

export async function createTrip({
  destination,
  starts_at,
  ends_at,
  emails_to_invite,
}: CreateTripRequest) {
  const { data } = await api.post<{ tripId: string }>('/trips', {
    destination,
    starts_at,
    ends_at,
    emails_to_invite,
    owner_name: 'Luís Miguel',
    owner_email: 'luis.test@gmail.com',
  })

  return data
}
