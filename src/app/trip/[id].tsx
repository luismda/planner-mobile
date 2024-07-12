import dayjs from 'dayjs'
import { router, useLocalSearchParams } from 'expo-router'
import {
  Calendar as CalendarIcon,
  CalendarRange,
  Info,
  MapPin,
  Settings2,
} from 'lucide-react-native'
import { useCallback, useEffect, useState } from 'react'
import { Alert, Keyboard, TouchableOpacity, View } from 'react-native'
import { DateData } from 'react-native-calendars'

import { Button } from '@/components/button'
import { Calendar } from '@/components/calendar'
import { Input } from '@/components/input'
import { Loading } from '@/components/loading'
import { Modal } from '@/components/modal'
import { getTripDetails, GetTripDetailsResponse } from '@/server/trips'
import { updateTrip } from '@/server/trips/update-trip'
import { colors } from '@/styles/colors'
import { calendarUtils, DatesSelected } from '@/utils/calendar-utils'

import { Activities } from './activities'
import { Details } from './details'

export type TripDetails = GetTripDetailsResponse & { when: string }
type MenuOption = 'activity' | 'details'

enum VisibleModalEnum {
  NONE,
  UPDATE_TRIP,
  CALENDAR,
}

export default function Trip() {
  const { id: tripId } = useLocalSearchParams<{ id: string }>()

  const [isLoadingTrip, setIsLoadingTrip] = useState(true)
  const [isUpdatingTrip, setIsUpdatingTrip] = useState(false)

  const [tripDetails, setTripDetails] = useState({} as TripDetails)

  const [menuOption, setMenuOption] = useState<MenuOption>('activity')
  const [visibleModal, setVisibleModal] = useState(VisibleModalEnum.NONE)

  const [destination, setDestination] = useState('')
  const [selectedDates, setSelectedDates] = useState({} as DatesSelected)

  const fetchTrip = useCallback(async () => {
    setIsLoadingTrip(true)

    if (!tripId) {
      router.back()
      return
    }

    try {
      const { trip } = await getTripDetails(tripId)

      const destination =
        trip.destination.length > 14
          ? trip.destination.substring(0, 14).trimEnd().concat('...')
          : trip.destination

      const endDay = dayjs(trip.ends_at).format('DD')
      const startDay = dayjs(trip.starts_at).format('DD')
      const startMonth = dayjs(trip.starts_at).format('MMM')

      setTripDetails({
        ...trip,
        when: `${destination} de ${startDay} a ${endDay} de ${startMonth}.`,
      })

      setDestination(trip.destination)
    } catch (error) {
      console.warn(error)
    } finally {
      setIsLoadingTrip(false)
    }
  }, [tripId])

  function handleSelectDate(selectedDay: DateData) {
    const dates = calendarUtils.orderStartsAtAndEndsAt({
      startsAt: selectedDates.startsAt,
      endsAt: selectedDates.endsAt,
      selectedDay,
    })

    setSelectedDates(dates)
  }

  async function handleUpdateTrip() {
    if (!tripId) return

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

    setIsUpdatingTrip(true)

    try {
      await updateTrip({
        id: tripId,
        destination,
        ends_at: dayjs(selectedDates.endsAt?.dateString).toString(),
        starts_at: dayjs(selectedDates.startsAt?.dateString).toString(),
      })

      setVisibleModal(VisibleModalEnum.NONE)

      await fetchTrip()
    } catch (error) {
      console.warn(error)

      Alert.alert(
        'Atualizar viajem',
        'Ocorreu uma falha ao atualizar a viajem.',
      )
    } finally {
      setIsUpdatingTrip(false)
    }
  }

  useEffect(() => {
    fetchTrip()
  }, [fetchTrip])

  if (isLoadingTrip) {
    return <Loading />
  }

  return (
    <View className="flex-1 px-5 pt-16">
      <Input variant="tertiary">
        <MapPin color={colors.zinc[400]} size={20} />
        <Input.Field value={tripDetails.when} readOnly />

        <TouchableOpacity
          activeOpacity={0.9}
          className="h-9 w-9 items-center justify-center rounded bg-zinc-800"
          onPress={() => setVisibleModal(VisibleModalEnum.UPDATE_TRIP)}
        >
          <Settings2 color={colors.zinc[400]} size={20} />
        </TouchableOpacity>
      </Input>

      {menuOption === 'activity' ? (
        <Activities tripDetails={tripDetails} />
      ) : (
        <Details />
      )}

      <View className="absolute -bottom-1 z-10 w-full justify-end self-center bg-zinc-950 pb-5">
        <View className="w-full flex-row gap-2 rounded-lg border border-zinc-800 bg-zinc-900 p-4">
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
        <View className="my-4 gap-3">
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
    </View>
  )
}
