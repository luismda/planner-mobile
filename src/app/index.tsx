import {
  ArrowRight,
  Calendar as CalendarIcon,
  MapPin,
  Settings2,
  UserRoundPlus,
} from 'lucide-react-native'
import { useState } from 'react'
import { Image, Text, View } from 'react-native'

import { Button } from '@/components/button'
import { Input } from '@/components/input'
import { colors } from '@/styles/colors'

enum FormStepEnum {
  TRIP_DETAILS,
  ADD_EMAILS,
}

export default function Index() {
  const [formStep, setFormStep] = useState(FormStepEnum.TRIP_DETAILS)

  function handleNextFormStep() {
    setFormStep((prevStep) => {
      if (prevStep === FormStepEnum.TRIP_DETAILS) {
        return FormStepEnum.ADD_EMAILS
      }

      return prevStep
    })
  }

  function handlePrevFormStep() {
    setFormStep((prevStep) => {
      if (prevStep === FormStepEnum.ADD_EMAILS) {
        return FormStepEnum.TRIP_DETAILS
      }

      return prevStep
    })
  }

  return (
    <View className="flex-1 items-center justify-center px-5">
      <Image
        source={require('@/assets/logo.png')}
        alt="Planner"
        className="h-8"
        resizeMode="contain"
      />

      <Image source={require('@/assets/bg.png')} alt="" className="absolute" />

      <Text className="mt-3 text-center font-regular text-lg text-zinc-400">
        Convide seus amigos e planeje sua{'\n'}próxima viajem
      </Text>

      <View className="my-8 w-full gap-3 rounded-xl border border-zinc-800 bg-zinc-900 p-4">
        <View className="gap-2">
          <Input>
            <MapPin color={colors.zinc[400]} size={20} />

            <Input.Field
              placeholder="Para onde?"
              editable={formStep === FormStepEnum.TRIP_DETAILS}
            />
          </Input>

          <Input>
            <CalendarIcon color={colors.zinc[400]} size={20} />

            <Input.Field
              placeholder="Quando?"
              editable={formStep === FormStepEnum.TRIP_DETAILS}
            />
          </Input>
        </View>

        {formStep === FormStepEnum.TRIP_DETAILS && (
          <Button onPress={handleNextFormStep}>
            <Button.Title>Continuar</Button.Title>
            <ArrowRight color={colors.lime[950]} size={20} />
          </Button>
        )}

        {formStep === FormStepEnum.ADD_EMAILS && (
          <>
            <Button variant="secondary" onPress={handlePrevFormStep}>
              <Button.Title>Alterar local/data</Button.Title>
              <Settings2 color={colors.zinc[200]} size={20} />
            </Button>

            <View className="h-px bg-zinc-800" />

            <Input>
              <UserRoundPlus color={colors.zinc[400]} size={20} />
              <Input.Field placeholder="Quem estará na viagem?" />
            </Input>

            <Button disabled>
              <Button.Title>Confirmar viajem</Button.Title>
              <ArrowRight color={colors.lime[950]} size={20} />
            </Button>
          </>
        )}
      </View>

      <Text className="text-center font-regular text-sm text-zinc-500">
        Ao planejar sua viagem pela plann.er você{'\n'}automaticamente concorda
        com nossos{' '}
        <Text className="text-zinc-300 underline underline-offset-1">
          termos de uso
        </Text>
        {'\n'}e{' '}
        <Text className="text-zinc-300 underline underline-offset-1">
          políticas de privacidade
        </Text>
        .
      </Text>
    </View>
  )
}
