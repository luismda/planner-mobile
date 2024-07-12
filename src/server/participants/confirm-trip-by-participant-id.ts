import { api } from '../api'

export interface ConfirmTripByParticipantIdRequest {
  participant_id: string
  name: string
  email: string
}

export async function confirmTripByParticipantId({
  participant_id,
  name,
  email,
}: ConfirmTripByParticipantIdRequest) {
  await api.patch(`/participants/${participant_id}/confirm`, { name, email })
}
