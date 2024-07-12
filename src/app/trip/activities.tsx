import dayjs from 'dayjs'
import { Calendar as CalendarIcon, Clock, Plus, Tag } from 'lucide-react-native'
import { useState } from 'react'
import { Alert, Keyboard, Text, View } from 'react-native'

import { Button } from '@/components/button'
import { Calendar } from '@/components/calendar'
import { Input } from '@/components/input'
import { Modal } from '@/components/modal'
import { createActivity } from '@/server/activities'
import { colors } from '@/styles/colors'

import type { TripDetails } from './[id]'

enum VisibleModalEnum {
  NONE,
  CALENDAR,
  NEW_ACTIVITY,
}

interface ActivitiesProps {
  tripDetails: TripDetails
}

export function Activities({ tripDetails }: ActivitiesProps) {
  const [visibleModal, setVisibleModal] = useState(VisibleModalEnum.NONE)

  const [activityTitle, setActivityTitle] = useState('')
  const [activityDate, setActivityDate] = useState('')
  const [activityHour, setActivityHour] = useState('')

  const [isCreatingActivity, setIsCreatingActivity] = useState(false)

  function resetActivityFields() {
    setActivityTitle('')
    setActivityDate('')
    setActivityHour('')
  }

  async function handleCreateTripActivity() {
    if (!activityTitle.trim() || !activityDate.trim() || !activityHour.trim()) {
      return Alert.alert(
        'Cadastrar atividade',
        'Preencha as informações da atividade corretamente.',
      )
    }

    setIsCreatingActivity(true)

    try {
      await createActivity({
        trip_id: tripDetails.id,
        title: activityTitle,
        occurs_at: dayjs(activityDate)
          .add(Number(activityHour), 'hours')
          .toString(),
      })

      resetActivityFields()
    } catch (error) {
      console.warn(error)

      Alert.alert(
        'Cadastrar atividade',
        'Ocorreu uma falha ao salvar a atividade.',
      )
    } finally {
      setIsCreatingActivity(false)
    }
  }

  return (
    <View className="flex-1">
      <View className="mb-6 mt-5 w-full flex-row items-center">
        <Text className="flex-1 font-semibold text-2xl text-zinc-50">
          Atividades
        </Text>

        <Button onPress={() => setVisibleModal(VisibleModalEnum.NEW_ACTIVITY)}>
          <Button.Title>Nova atividade</Button.Title>
          <Plus color={colors.lime[950]} size={20} />
        </Button>
      </View>

      <Modal
        title="Cadastrar atividade"
        subtitle="Todos convidados podem visualizar as atividades."
        visible={visibleModal === VisibleModalEnum.NEW_ACTIVITY}
        onClose={() => setVisibleModal(VisibleModalEnum.NONE)}
      >
        <View className="mb-3 mt-4">
          <Input variant="secondary">
            <Tag color={colors.zinc[400]} size={20} />

            <Input.Field
              value={activityTitle}
              placeholder="Qual a atividade?"
              onChangeText={setActivityTitle}
            />
          </Input>

          <View className="mt-2 w-full flex-row gap-2">
            <Input variant="secondary" className="flex-1">
              <CalendarIcon color={colors.zinc[400]} size={20} />

              <Input.Field
                value={
                  activityDate ? dayjs(activityDate).format('DD [de] MMMM') : ''
                }
                placeholder="Data"
                showSoftInputOnFocus={false}
                onChangeText={setActivityDate}
                onFocus={() => Keyboard.dismiss()}
                onPressIn={() => setVisibleModal(VisibleModalEnum.CALENDAR)}
              />
            </Input>

            <Input variant="secondary" className="flex-1">
              <Clock color={colors.zinc[400]} size={20} />

              <Input.Field
                maxLength={2}
                value={activityHour}
                placeholder="Horário"
                keyboardType="numeric"
                onChangeText={(text) =>
                  setActivityHour(text.replace(/[^\d]/g, ''))
                }
              />
            </Input>
          </View>
        </View>

        <Button
          isLoading={isCreatingActivity}
          onPress={handleCreateTripActivity}
        >
          <Button.Title>Salvar atividade</Button.Title>
        </Button>
      </Modal>

      <Modal
        title="Selecionar data"
        subtitle="Selecione a data da atividade"
        visible={visibleModal === VisibleModalEnum.CALENDAR}
        onClose={() => setVisibleModal(VisibleModalEnum.NONE)}
      >
        <View className="mt-4 gap-4">
          <Calendar
            maxDate={tripDetails.ends_at.toString()}
            minDate={tripDetails.starts_at.toString()}
            initialDate={tripDetails.starts_at.toString()}
            markedDates={{ [activityDate]: { selected: true } }}
            onDayPress={(day) => setActivityDate(day.dateString)}
          />

          <Button
            onPress={() => setVisibleModal(VisibleModalEnum.NEW_ACTIVITY)}
          >
            <Button.Title>Confirmar</Button.Title>
          </Button>
        </View>
      </Modal>
    </View>
  )
}
