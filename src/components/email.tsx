import { X } from 'lucide-react-native'
import { Text, TouchableOpacity, View } from 'react-native'

import { colors } from '@/styles/colors'

type Props = {
  email: string
  onRemove: () => void
}

export function GuestEmail({ email, onRemove }: Props) {
  return (
    <View className="flex-row items-center gap-3 rounded-lg bg-zinc-800 px-3 py-2">
      <Text className="font-regular text-base text-zinc-300">{email}</Text>
      <TouchableOpacity onPress={onRemove}>
        <X color={colors.zinc[400]} size={16} />
      </TouchableOpacity>
    </View>
  )
}
