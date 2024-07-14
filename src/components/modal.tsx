import { BlurView } from 'expo-blur'
import { X } from 'lucide-react-native'
import { AnimatePresence, MotiView } from 'moti'
import { useCallback, useEffect, useState } from 'react'
import {
  Modal as RNModal,
  ModalProps,
  ScrollView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { colors } from '@/styles/colors'

type Props = ModalProps & {
  title: string
  subtitle?: string
  onClose?: () => void
}

export function Modal({
  title,
  subtitle = '',
  visible,
  onClose,
  children,
  ...rest
}: Props) {
  const insets = useSafeAreaInsets()
  const dimensions = useWindowDimensions()

  const [isVisible, setIsVisible] = useState(false)
  const [isContentVisible, setIsContentVisible] = useState(false)

  const toggleVisibility = useCallback(async () => {
    if (visible) {
      setIsVisible(true)
      setIsContentVisible(true)

      return
    }

    setIsContentVisible(false)

    await new Promise((resolve) => setTimeout(resolve, 800))

    setIsVisible(false)
  }, [visible])

  useEffect(() => {
    toggleVisibility()
  }, [toggleVisibility])

  return (
    <RNModal transparent animationType="none" visible={isVisible} {...rest}>
      <AnimatePresence>
        {isContentVisible && (
          <MotiView
            className="flex-1"
            from={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            exitTransition={{
              delay: 150,
            }}
          >
            <BlurView
              tint="dark"
              intensity={7}
              className="flex-1"
              experimentalBlurMethod="dimezisBlurView"
            >
              <MotiView
                className="flex-1"
                from={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                exit={{
                  opacity: 0,
                }}
                exitTransition={{
                  delay: 150,
                }}
              >
                <View className="flex-1 justify-end bg-black/60">
                  <MotiView
                    from={{
                      translateY: dimensions.height,
                    }}
                    animate={{
                      translateY: 0,
                    }}
                    transition={{
                      type: 'timing',
                      duration: 500,
                    }}
                    exit={{
                      translateY: dimensions.height,
                    }}
                    exitTransition={{
                      type: 'timing',
                      duration: 500,
                    }}
                  >
                    <View
                      style={{ paddingBottom: 20 + insets.bottom }}
                      className="border-t border-zinc-700 bg-zinc-900 px-6 pt-5"
                    >
                      <ScrollView showsVerticalScrollIndicator={false}>
                        <View className="flex-row items-center justify-between pt-5">
                          <Text className="font-semibold text-xl text-white">
                            {title}
                          </Text>

                          {onClose && (
                            <TouchableOpacity
                              activeOpacity={0.7}
                              onPress={onClose}
                            >
                              <X color={colors.zinc[400]} size={20} />
                            </TouchableOpacity>
                          )}
                        </View>

                        {subtitle.trim().length > 0 && (
                          <Text className="my-2 font-regular text-base leading-6 text-zinc-400">
                            {subtitle}
                          </Text>
                        )}

                        {children}
                      </ScrollView>
                    </View>
                  </MotiView>
                </View>
              </MotiView>
            </BlurView>
          </MotiView>
        )}
      </AnimatePresence>
    </RNModal>
  )
}
