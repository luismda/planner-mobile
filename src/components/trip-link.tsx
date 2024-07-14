import * as Linking from 'expo-linking'
import { Link2 } from 'lucide-react-native'
import { Text, TouchableOpacity, View } from 'react-native'

import { colors } from '@/styles/colors'

export type TripLinkProps = {
  id: string
  title: string
  url: string
}

type Props = {
  data: TripLinkProps
}

export function TripLink({ data }: Props) {
  function handleLinkOpen() {
    Linking.openURL(data.url)
  }

  return (
    <View className="w-full flex-row items-center gap-32">
      <View className="flex-1 gap-1.5">
        <Text className="font-medium text-base text-zinc-100">
          {data.title}
        </Text>

        <Text className="font-regular text-xs text-zinc-400" numberOfLines={1}>
          {data.url}
        </Text>
      </View>

      <TouchableOpacity activeOpacity={0.7} onPress={handleLinkOpen}>
        <Link2 color={colors.zinc[400]} size={20} />
      </TouchableOpacity>
    </View>
  )
}
