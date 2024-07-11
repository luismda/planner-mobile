import { BlurView } from 'expo-blur'
import { X } from 'lucide-react-native'
import {
  Modal as RNModal,
  ModalProps,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import { colors } from '@/styles/colors'

type Props = ModalProps & {
  title: string
  subtitle?: string
  onClose?: () => void
}

export function Modal({
  title,
  subtitle = '',
  onClose,
  children,
  ...rest
}: Props) {
  return (
    <RNModal transparent animationType="slide" {...rest}>
      <BlurView
        className="flex-1"
        intensity={7}
        tint="dark"
        experimentalBlurMethod="dimezisBlurView"
      >
        <View className="flex-1 justify-end bg-black/60">
          <View className="border-t border-zinc-700 bg-zinc-900 px-6 pb-10 pt-5">
            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="flex-row items-center justify-between pt-5">
                <Text className="font-medium text-xl text-white">{title}</Text>

                {onClose && (
                  <TouchableOpacity activeOpacity={0.7} onPress={onClose}>
                    <X color={colors.zinc[400]} size={20} />
                  </TouchableOpacity>
                )}
              </View>

              {subtitle.trim().length > 0 && (
                <Text className="my-2 font-regular leading-6 text-zinc-400">
                  {subtitle}
                </Text>
              )}

              {children}
            </ScrollView>
          </View>
        </View>
      </BlurView>
    </RNModal>
  )
}
