import AsyncStorage from '@react-native-async-storage/async-storage'

import { TRIP_STORAGE_KEY } from '../keys'

export async function saveTripStorage(tripId: string) {
  await AsyncStorage.setItem(TRIP_STORAGE_KEY, tripId)
}
