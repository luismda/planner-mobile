import { CircleCheck, CircleDashed } from 'lucide-react-native'
import { Text, View } from 'react-native'

import { colors } from '@/styles/colors'

export type ParticipantProps = {
  id: string
  name?: string
  email: string
  is_confirmed: boolean
}

type Props = {
  data: ParticipantProps
}

export function Participant({ data }: Props) {
  return (
    <View className="w-full flex-row items-center">
      <View className="flex-1 gap-1.5">
        <Text className="font-medium text-base text-zinc-100">
          {data.name ?? 'Pendente'}
        </Text>

        <Text className="font-regular text-sm text-zinc-400">{data.email}</Text>
      </View>

      {data.is_confirmed ? (
        <CircleCheck color={colors.lime[300]} size={20} />
      ) : (
        <CircleDashed color={colors.zinc[400]} size={20} />
      )}
    </View>
  )
}
