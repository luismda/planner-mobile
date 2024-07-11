import AsyncStorage from '@react-native-async-storage/async-storage'

import { TRIP_STORAGE_KEY } from '../keys'

export async function removeTripStorage() {
  await AsyncStorage.removeItem(TRIP_STORAGE_KEY)
}
