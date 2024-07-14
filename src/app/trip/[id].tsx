import dayjs from 'dayjs'
import { router, useLocalSearchParams } from 'expo-router'
import {
  Calendar as CalendarIcon,
  CalendarRange,
  Info,
  Mail,
  MapPin,
  Settings2,
  User,
} from 'lucide-react-native'
import { useEffect, useState } from 'react'
import { Alert, Keyboard, Text, TouchableOpacity, View } from 'react-native'
import { DateData } from 'react-native-calendars'

import { Button } from '@/components/button'
import { Calendar } from '@/components/calendar'
import { Input } from '@/components/input'
import { Loading } from '@/components/loading'
import { Modal } from '@/components/modal'
import { useConfirmTrip } from '@/server/participants'
import { useTripDetails, useUpdateTrip } from '@/server/trips'
import { removeTripStorage, saveTripStorage } from '@/storage/trips'
import { colors } from '@/styles/colors'
import { calendarUtils, DatesSelected } from '@/utils/calendar-utils'
import { validateInput } from '@/utils/validate-input'

import { Activities } from './activities'
import { Details } from './details'

type MenuOption = 'activity' | 'details'

enum VisibleModalEnum {
  NONE,
  UPDATE_TRIP,
  CALENDAR,
  CONFIRM_TRIP,
}

export default function Trip() {
  const tripParams = useLocalSearchParams<{
    id: string
    participant?: string
  }>()

  const [menuOption, setMenuOption] = useState<MenuOption>('activity')
  const [visibleModal, setVisibleModal] = useState(VisibleModalEnum.NONE)

  const [destination, setDestination] = useState('')
  const [selectedDates, setSelectedDates] = useState({} as DatesSelected)
  const [guestName, setGuestName] = useState('')
  const [guestEmail, setGuestEmail] = useState('')

  const { data: tripDetails } = useTripDetails(tripParams.id ?? '')
  const { mutate: updateTrip, isPending: isUpdatingTrip } = useUpdateTrip()
  const { mutate: confirmTrip, isPending: isConfirmingTrip } = useConfirmTrip()

  function handleOpenUpdateTripModal() {
    const { trip } = tripDetails ?? {}

    setDestination(trip?.destination ?? '')
    setVisibleModal(VisibleModalEnum.UPDATE_TRIP)
  }

  function handleSelectDate(selectedDay: DateData) {
    const dates = calendarUtils.orderStartsAtAndEndsAt({
      startsAt: selectedDates.startsAt,
      endsAt: selectedDates.endsAt,
      selectedDay,
    })

    setSelectedDates(dates)
  }

  function handleUpdateTrip() {
    if (!tripParams.id) return

    if (
      destination.trim().length === 0 ||
      !selectedDates.startsAt ||
      !selectedDates.endsAt
    ) {
      return Alert.alert(
        'Atualizar viajem',
        'Preencha todas as informações da viajem para atualizar.',
      )
    }

    if (destination.trim().length < 4) {
      return Alert.alert(
        'Atualizar viajem',
        'O destino da viajem deve ter pelo menos 4 caracteres.',
      )
    }

    updateTrip(
      {
        id: tripParams.id,
        destination,
        ends_at: dayjs(selectedDates.endsAt?.dateString).toString(),
        starts_at: dayjs(selectedDates.startsAt?.dateString).toString(),
      },
      {
        onSuccess: () => {
          setVisibleModal(VisibleModalEnum.NONE)
        },
        onError: () => {
          Alert.alert(
            'Atualizar viajem',
            'Ocorreu uma falha ao atualizar a viajem.',
          )
        },
      },
    )
  }

  function handleConfirmTrip() {
    const { id, participant } = tripParams

    if (!id || !participant) return

    if (!guestName.trim() || !guestEmail.trim()) {
      return Alert.alert(
        'Confirmar presença',
        'Informe seu nome e e-mail corretamente para confirmar a viajem.',
      )
    }

    if (!validateInput.email(guestEmail)) {
      return Alert.alert(
        'Confirmar presença',
        'Informe um e-mail válido para confirmar a viajem.',
      )
    }

    confirmTrip(
      {
        participant_id: participant,
        name: guestName.trim(),
        email: guestEmail.trim(),
      },
      {
        onSuccess: async () => {
          await saveTripStorage(id)
          setVisibleModal(VisibleModalEnum.NONE)
        },
        onError: () => {
          Alert.alert(
            'Confirmar presença',
            'Ocorreu uma falha ao confirmar sua presença.',
          )
        },
      },
    )
  }

  async function handleRemoveTrip() {
    Alert.alert(
      'Remover viajem',
      'Ao confirmar, a viajem será removida do seu dispositivo.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          onPress: async () => {
            await removeTripStorage()
            router.replace('/')
          },
        },
      ],
    )
  }

  useEffect(() => {
    if (tripParams.participant) {
      setVisibleModal(VisibleModalEnum.CONFIRM_TRIP)
    }
  }, [tripParams.participant])

  if (!tripDetails) {
    return <Loading />
  }

  const { trip } = tripDetails

  const endDay = dayjs(trip.ends_at).format('DD')
  const startDay = dayjs(trip.starts_at).format('DD')
  const startMonth = dayjs(trip.starts_at).format('MMM')

  const when = `${startDay} a ${endDay} de ${startMonth}.`

  return (
    <View className="flex-1 px-5 pt-5">
      <View className="h-16 flex-row items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900 px-4">
        <View className="flex-1 flex-row items-center gap-2">
          <MapPin color={colors.zinc[400]} size={20} />

          <View className="flex-1 flex-row items-center gap-3">
            <Text
              className="flex-1 font-regular text-base text-zinc-100"
              numberOfLines={1}
            >
              {trip.destination}
            </Text>

            <Text className="font-regular text-base text-zinc-100">{when}</Text>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.9}
          className="h-9 w-9 items-center justify-center rounded-lg bg-zinc-800"
          onPress={handleOpenUpdateTripModal}
        >
          <Settings2 color={colors.zinc[200]} size={20} />
        </TouchableOpacity>
      </View>

      {menuOption === 'activity' ? (
        <Activities tripDetails={{ ...trip, when }} />
      ) : (
        <Details tripId={trip.id} />
      )}

      <View className="absolute -bottom-1 z-10 w-full justify-end self-center bg-zinc-950 pb-5">
        <View className="w-full flex-row gap-2 rounded-lg border border-zinc-800 bg-zinc-900 p-3">
          <Button
            className="flex-1"
            variant={menuOption === 'activity' ? 'primary' : 'secondary'}
            onPress={() => setMenuOption('activity')}
          >
            <CalendarRange
              size={20}
              color={
                menuOption === 'activity' ? colors.lime[950] : colors.zinc[200]
              }
            />

            <Button.Title>Atividades</Button.Title>
          </Button>

          <Button
            className="flex-1"
            variant={menuOption === 'details' ? 'primary' : 'secondary'}
            onPress={() => setMenuOption('details')}
          >
            <Info
              size={20}
              color={
                menuOption === 'details' ? colors.lime[950] : colors.zinc[200]
              }
            />

            <Button.Title>Detalhes</Button.Title>
          </Button>
        </View>
      </View>

      <Modal
        title="Atualizar viajem"
        subtitle="Somente quem criou a viajem pode editar."
        visible={visibleModal === VisibleModalEnum.UPDATE_TRIP}
        onClose={() => setVisibleModal(VisibleModalEnum.NONE)}
      >
        <View className="mt-5 gap-3">
          <View className="gap-2">
            <Input variant="secondary">
              <MapPin color={colors.zinc[400]} size={20} />

              <Input.Field
                value={destination}
                placeholder="Para onde?"
                onChangeText={setDestination}
              />
            </Input>

            <Input variant="secondary">
              <CalendarIcon color={colors.zinc[400]} size={20} />

              <Input.Field
                placeholder="Quando?"
                showSoftInputOnFocus={false}
                value={selectedDates.formatDatesInText}
                onFocus={() => Keyboard.dismiss()}
                onPressIn={() => setVisibleModal(VisibleModalEnum.CALENDAR)}
              />
            </Input>
          </View>

          <Button isLoading={isUpdatingTrip} onPress={handleUpdateTrip}>
            <Button.Title>Atualizar</Button.Title>
          </Button>

          <Button variant="secondary" onPress={handleRemoveTrip}>
            <Button.Title>Remover</Button.Title>
          </Button>
        </View>
      </Modal>

      <Modal
        title="Selecionar datas"
        subtitle="Selecione a data de ida e volta da viajem"
        visible={visibleModal === VisibleModalEnum.CALENDAR}
        onClose={() => setVisibleModal(VisibleModalEnum.NONE)}
      >
        <View className="mt-4 gap-4">
          <Calendar
            minDate={dayjs().toISOString()}
            markedDates={selectedDates.dates}
            onDayPress={handleSelectDate}
          />

          <Button onPress={() => setVisibleModal(VisibleModalEnum.UPDATE_TRIP)}>
            <Button.Title>Confirmar</Button.Title>
          </Button>
        </View>
      </Modal>

      <Modal
        title="Confirmar presença"
        visible={visibleModal === VisibleModalEnum.CONFIRM_TRIP}
      >
        <Text className="mt-2 font-regular leading-6 text-zinc-400">
          Você foi convidado(a) para participar de uma viajem para{' '}
          <Text className="font-semibold text-zinc-100">
            {trip.destination}
          </Text>{' '}
          nas datas de{' '}
          <Text className="font-semibold text-zinc-100">
            {dayjs(trip.starts_at).date()} a {dayjs(trip.ends_at).date()} de{' '}
            {dayjs(trip.ends_at).format('MMMM')}
          </Text>
          .{'\n\n'}
          Para confirmar sua presença na viajem, preencha os dados abaixo:
        </Text>

        <View className="mb-3 mt-5 gap-2">
          <Input variant="secondary">
            <User color={colors.zinc[400]} size={20} />

            <Input.Field
              value={guestName}
              placeholder="Seu nome completo"
              onChangeText={setGuestName}
            />
          </Input>

          <Input variant="secondary">
            <Mail color={colors.zinc[400]} size={20} />

            <Input.Field
              value={guestEmail}
              placeholder="E-mail de confirmação"
              onChangeText={setGuestEmail}
            />
          </Input>
        </View>

        <Button isLoading={isConfirmingTrip} onPress={handleConfirmTrip}>
          <Button.Title>Confirmar</Button.Title>
        </Button>
      </Modal>
    </View>
  )
}
