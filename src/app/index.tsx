import dayjs from 'dayjs'
import { router } from 'expo-router'
import {
  ArrowRight,
  AtSign,
  Calendar as CalendarIcon,
  MapPin,
  Settings2,
  UserRoundPlus,
} from 'lucide-react-native'
import { useEffect, useState } from 'react'
import { Alert, Image, Keyboard, Text, View } from 'react-native'
import { DateData } from 'react-native-calendars'
import Animated, {
  CurvedTransition,
  Easing,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated'

import { Button } from '@/components/button'
import { Calendar } from '@/components/calendar'
import { GuestEmail } from '@/components/email'
import { Input } from '@/components/input'
import { Loading } from '@/components/loading'
import { Modal } from '@/components/modal'
import { createTrip, getTripDetails } from '@/server/trips'
import { getTripStorage, saveTripStorage } from '@/storage/trips'
import { colors } from '@/styles/colors'
import { calendarUtils, DatesSelected } from '@/utils/calendar-utils'
import { validateInput } from '@/utils/validate-input'

enum FormStepEnum {
  TRIP_DETAILS,
  ADD_EMAILS,
}

enum VisibleModalEnum {
  NONE,
  CALENDAR,
  GUESTS,
}

export default function Index() {
  const [formStep, setFormStep] = useState(FormStepEnum.TRIP_DETAILS)
  const [visibleModal, setVisibleModal] = useState(VisibleModalEnum.NONE)

  const [destination, setDestination] = useState('')
  const [selectedDates, setSelectedDates] = useState({} as DatesSelected)
  const [emailToInvite, setEmailToInvite] = useState('')
  const [emailsToInvite, setEmailsToInvite] = useState<string[]>([])

  const [isGettingTrip, setIsGettingTrip] = useState(true)
  const [isCreatingTrip, setIsCreatingTrip] = useState(false)

  function handleNextFormStep() {
    if (
      destination.trim().length === 0 ||
      !selectedDates.startsAt ||
      !selectedDates.endsAt
    ) {
      return Alert.alert(
        'Viajem',
        'Preencha todas as informações da viajem para seguir.',
      )
    }

    if (destination.trim().length < 4) {
      return Alert.alert(
        'Viajem',
        'O destino da viajem deve ter pelo menos 4 caracteres.',
      )
    }

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

  function handleSelectDate(selectedDay: DateData) {
    const dates = calendarUtils.orderStartsAtAndEndsAt({
      startsAt: selectedDates.startsAt,
      endsAt: selectedDates.endsAt,
      selectedDay,
    })

    setSelectedDates(dates)
  }

  function handleRemoveEmail(emailToRemove: string) {
    setEmailsToInvite((prevEmails) =>
      prevEmails.filter((email) => email !== emailToRemove),
    )
  }

  function handleAddEmail() {
    if (!validateInput.email(emailToInvite)) {
      return Alert.alert('Selecionar convidados', 'Informe um e-mail válido.')
    }

    const existingEmail = emailsToInvite.find(
      (email) => email === emailToInvite,
    )

    if (existingEmail) {
      return Alert.alert(
        'Selecionar convidados',
        'Esse convidado já foi adicionado.',
      )
    }

    setEmailsToInvite((prevEmails) => [...prevEmails, emailToInvite])
    setEmailToInvite('')
  }

  async function handleCreateTrip() {
    setIsCreatingTrip(true)

    try {
      const { tripId } = await createTrip({
        destination,
        emails_to_invite: emailsToInvite,
        ends_at: dayjs(selectedDates.endsAt?.dateString).toString(),
        starts_at: dayjs(selectedDates.startsAt?.dateString).toString(),
      })

      await saveTripStorage(tripId)

      router.navigate(`/trip/${tripId}`)
    } catch (error) {
      setIsCreatingTrip(false)

      console.warn(error)

      Alert.alert(
        'Confirmar viajem',
        'Ocorreu uma falha ao confirmar a viajem.',
      )
    }
  }

  async function fetchTrip() {
    try {
      const tripId = await getTripStorage()

      if (!tripId) {
        setIsGettingTrip(false)
        return
      }

      const { trip } = await getTripDetails(tripId)

      if (!trip) {
        setIsGettingTrip(false)
        return
      }

      router.navigate(`/trip/${trip.id}`)
    } catch (error) {
      setIsGettingTrip(false)

      console.warn(error)
    }
  }

  const isTripDetailsButtonDisabled =
    destination.trim().length === 0 ||
    !selectedDates.startsAt ||
    !selectedDates.endsAt

  useEffect(() => {
    fetchTrip()
  }, [])

  if (isGettingTrip) {
    return <Loading />
  }

  return (
    <View className="flex-1 items-center justify-center px-5">
      <Image source={require('@/assets/bg.png')} alt="" className="absolute" />

      <Animated.View layout={CurvedTransition}>
        <Image
          source={require('@/assets/logo.png')}
          alt="Planner"
          className="h-8"
          resizeMode="contain"
        />

        <Text className="mt-3 text-center font-regular text-lg text-zinc-400">
          Convide seus amigos e planeje sua{'\n'}próxima viajem!
        </Text>
      </Animated.View>

      <Animated.View
        layout={CurvedTransition.easingHeight(Easing.linear)}
        className="my-8 w-full gap-3 rounded-xl border border-zinc-800 bg-zinc-900 p-4"
      >
        <View className="gap-2">
          <Input>
            <MapPin color={colors.zinc[400]} size={20} />

            <Input.Field
              value={destination}
              placeholder="Para onde?"
              editable={formStep === FormStepEnum.TRIP_DETAILS}
              onChangeText={setDestination}
            />
          </Input>

          <Input>
            <CalendarIcon color={colors.zinc[400]} size={20} />

            <Input.Field
              placeholder="Quando?"
              showSoftInputOnFocus={false}
              value={selectedDates.formatDatesInText}
              editable={formStep === FormStepEnum.TRIP_DETAILS}
              onFocus={() => Keyboard.dismiss()}
              onPressIn={() => setVisibleModal(VisibleModalEnum.CALENDAR)}
            />
          </Input>
        </View>

        {formStep === FormStepEnum.ADD_EMAILS && (
          <Animated.View
            className="gap-3"
            entering={FadeIn.delay(100)}
            exiting={FadeOut.duration(100)}
          >
            <Button variant="secondary" onPress={handlePrevFormStep}>
              <Button.Title>Alterar local/data</Button.Title>
              <Settings2 color={colors.zinc[200]} size={20} />
            </Button>

            <View className="h-px bg-zinc-800" />

            <Input>
              <UserRoundPlus color={colors.zinc[400]} size={20} />

              <Input.Field
                autoCorrect={false}
                showSoftInputOnFocus={false}
                placeholder="Quem estará na viagem?"
                value={
                  emailsToInvite.length > 0
                    ? `${emailsToInvite.length} pessoa(s) convidada(s)`
                    : ''
                }
                onPress={() => {
                  Keyboard.dismiss()
                  setVisibleModal(VisibleModalEnum.GUESTS)
                }}
              />
            </Input>
          </Animated.View>
        )}

        <Animated.View layout={CurvedTransition.duration(400)}>
          {formStep === FormStepEnum.TRIP_DETAILS && (
            <Button
              disabled={isTripDetailsButtonDisabled}
              onPress={handleNextFormStep}
            >
              <Button.Title>Continuar</Button.Title>
              <ArrowRight color={colors.lime[950]} size={20} />
            </Button>
          )}

          {formStep === FormStepEnum.ADD_EMAILS && (
            <Button
              isLoading={isCreatingTrip}
              disabled={emailsToInvite.length === 0}
              onPress={handleCreateTrip}
            >
              <Button.Title>Confirmar viajem</Button.Title>
              <ArrowRight color={colors.lime[950]} size={20} />
            </Button>
          )}
        </Animated.View>
      </Animated.View>

      <Animated.View layout={CurvedTransition}>
        <Text className="text-center font-regular text-sm text-zinc-500">
          Ao planejar sua viagem pela plann.er você{'\n'}automaticamente
          concorda com nossos{' '}
          <Text className="text-zinc-300 underline underline-offset-1">
            termos de uso
          </Text>
          {'\n'}e{' '}
          <Text className="text-zinc-300 underline underline-offset-1">
            políticas de privacidade
          </Text>
          .
        </Text>
      </Animated.View>

      <Modal
        title="Selecionar datas"
        subtitle="Selecione a data de ida e volta da viajem"
        visible={visibleModal === VisibleModalEnum.CALENDAR}
        onClose={() => setVisibleModal(VisibleModalEnum.NONE)}
      >
        <View className="mt-5 gap-4">
          <Calendar
            minDate={dayjs().toISOString()}
            markedDates={selectedDates.dates}
            onDayPress={handleSelectDate}
          />

          <Button onPress={() => setVisibleModal(VisibleModalEnum.NONE)}>
            <Button.Title>Confirmar</Button.Title>
          </Button>
        </View>
      </Modal>

      <Modal
        title="Selecionar convidados"
        subtitle="Os convidados irão receber e-mails para confirmar a participação na viajem."
        visible={visibleModal === VisibleModalEnum.GUESTS}
        onClose={() => setVisibleModal(VisibleModalEnum.NONE)}
      >
        <View className="flex-wrap items-start gap-2 border-b border-zinc-800 py-5">
          {emailsToInvite.length > 0 ? (
            emailsToInvite.map((email) => {
              return (
                <GuestEmail
                  key={email}
                  email={email}
                  onRemove={() => handleRemoveEmail(email)}
                />
              )
            })
          ) : (
            <Text className="font-regular text-base text-zinc-400">
              Nenhum e-mail adicionado.
            </Text>
          )}
        </View>

        <View className="mt-5 gap-3">
          <Input variant="secondary">
            <AtSign color={colors.zinc[400]} size={20} />

            <Input.Field
              autoCorrect={false}
              value={emailToInvite}
              returnKeyType="send"
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="Digite o e-mail do convidado"
              onSubmitEditing={handleAddEmail}
              onChangeText={(text) => setEmailToInvite(text.toLowerCase())}
            />
          </Input>

          <Button onPress={handleAddEmail}>
            <Button.Title>Convidar</Button.Title>
          </Button>
        </View>
      </Modal>
    </View>
  )
}
