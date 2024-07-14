import clsx from 'clsx'
import { CircleCheck, CircleDashed } from 'lucide-react-native'
import { Text, View } from 'react-native'

import { colors } from '@/styles/colors'

export type ActivityProps = {
  id: string
  title: string
  hour: string
  isBefore: boolean
}

type Props = {
  data: ActivityProps
}

export function Activity({ data }: Props) {
  return (
    <View
      className={clsx(
        'h-10 w-full flex-row items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900 px-4',
        { 'opacity-60': data.isBefore },
      )}
    >
      {data.isBefore ? (
        <CircleCheck color={colors.lime[300]} size={20} />
      ) : (
        <CircleDashed color={colors.zinc[400]} size={20} />
      )}

      <Text className="flex-1 font-regular text-base text-zinc-100">
        {data.title}
      </Text>

      <Text className="font-regular text-sm text-zinc-400">{data.hour}</Text>
    </View>
  )
}
