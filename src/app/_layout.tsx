import '@/styles/global.css'

import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  useFonts,
} from '@expo-google-fonts/inter'
import { Slot } from 'expo-router'
import * as Splash from 'expo-splash-screen'
import { useCallback, useEffect } from 'react'
import { StatusBar, View } from 'react-native'

Splash.preventAutoHideAsync()

export default function Layout() {
  const [hasLoadedFonts] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  })

  const hideSplashScreen = useCallback(async () => {
    if (hasLoadedFonts) {
      await Splash.hideAsync()
    }
  }, [hasLoadedFonts])

  useEffect(() => {
    hideSplashScreen()
  }, [hideSplashScreen])

  if (!hasLoadedFonts) {
    return null
  }

  return (
    <View className="flex-1 bg-zinc-950">
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      <Slot />
    </View>
  )
}
