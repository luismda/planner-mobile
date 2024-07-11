import AsyncStorage from '@react-native-async-storage/async-storage'

import { TRIP_STORAGE_KEY } from '../keys'

export async function getTripStorage() {
  const tripId = await AsyncStorage.getItem(TRIP_STORAGE_KEY)

  return tripId
}
