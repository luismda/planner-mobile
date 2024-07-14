import clsx from 'clsx'
import dayjs from 'dayjs'
import { Calendar as CalendarIcon, Clock, Plus, Tag } from 'lucide-react-native'
import { useState } from 'react'
import { Alert, Keyboard, SectionList, Text, View } from 'react-native'
import Animated, { SlideInLeft, SlideOutLeft } from 'react-native-reanimated'

import { Activity } from '@/components/activity'
import { Button } from '@/components/button'
import { Calendar } from '@/components/calendar'
import { Input } from '@/components/input'
import { Loading } from '@/components/loading'
import { Modal } from '@/components/modal'
import { useCreateActivity, useTripActivities } from '@/server/activities'
import { TripData } from '@/server/trips'
import { colors } from '@/styles/colors'

enum VisibleModalEnum {
  NONE,
  CALENDAR,
  NEW_ACTIVITY,
}

type TripDetails = TripData & { when: string }

interface ActivitiesProps {
  tripDetails: TripDetails
}

export function Activities({ tripDetails }: ActivitiesProps) {
  const [visibleModal, setVisibleModal] = useState(VisibleModalEnum.NONE)

  const [activityTitle, setActivityTitle] = useState('')
  const [activityDate, setActivityDate] = useState('')
  const [activityHour, setActivityHour] = useState('')

  const { data: tripActivities } = useTripActivities(tripDetails.id)

  const { mutate: createActivity, isPending: isCreatingActivity } =
    useCreateActivity()

  function resetActivityFields() {
    setActivityTitle('')
    setActivityDate('')
    setActivityHour('')
  }

  function handleCreateTripActivity() {
    if (!activityTitle.trim() || !activityDate.trim() || !activityHour.trim()) {
      return Alert.alert(
        'Cadastrar atividade',
        'Preencha as informações da atividade corretamente.',
      )
    }

    createActivity(
      {
        trip_id: tripDetails.id,
        title: activityTitle,
        occurs_at: dayjs(activityDate)
          .add(Number(activityHour), 'hours')
          .toString(),
      },
      {
        onSuccess: () => {
          resetActivityFields()
        },
        onError: () => {
          Alert.alert(
            'Cadastrar atividade',
            'Ocorreu uma falha ao salvar a atividade.',
          )
        },
      },
    )
  }

  const activitiesToSectionList = tripActivities?.activities.map(
    (dayActivity) => ({
      title: {
        dayNumber: dayjs(dayActivity.date).date(),
        dayName: dayjs(dayActivity.date).format('dddd').replace('-feira', ''),
        isPast: dayjs(dayjs()).isAfter(dayActivity.date),
      },
      data: dayActivity.activities.map((activity) => ({
        id: activity.id,
        title: activity.title,
        hour: dayjs(activity.occurs_at).format('hh[:]mm[h]'),
        isBefore: dayjs(activity.occurs_at).isBefore(dayjs()),
      })),
    }),
  )

  return (
    <Animated.View
      entering={SlideInLeft.duration(400)}
      exiting={SlideOutLeft.duration(400)}
      className="flex-1"
    >
      <View className="flex-1 gap-6 pt-5">
        <View className="w-full flex-row items-center">
          <Text className="flex-1 font-semibold text-2xl text-zinc-50">
            Atividades
          </Text>

          <Button
            onPress={() => setVisibleModal(VisibleModalEnum.NEW_ACTIVITY)}
          >
            <Button.Title>Nova atividade</Button.Title>
            <Plus color={colors.lime[950]} size={20} />
          </Button>
        </View>

        {!activitiesToSectionList ? (
          <Loading />
        ) : (
          <SectionList
            sections={activitiesToSectionList}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <Activity data={item} />}
            renderSectionHeader={({ section }) => (
              <View className="w-full">
                <Text
                  className={clsx(
                    'pt-[1.375rem] font-semibold text-xl text-zinc-50',
                    { 'opacity-60': section.title.isPast },
                  )}
                >
                  Dia {section.title.dayNumber}{' '}
                  <Text className="font-regular text-xs capitalize text-zinc-500">
                    {section.title.dayName}
                  </Text>
                </Text>

                {section.data.length === 0 && (
                  <Text className="mt-2.5 font-regular text-sm text-zinc-500">
                    Nenhuma atividade cadastrada nessa data.
                  </Text>
                )}
              </View>
            )}
            contentContainerClassName="pb-48 gap-2.5 -mt-3"
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      <Modal
        title="Cadastrar atividade"
        subtitle="Todos convidados podem visualizar as atividades."
        visible={visibleModal === VisibleModalEnum.NEW_ACTIVITY}
        onClose={() => setVisibleModal(VisibleModalEnum.NONE)}
      >
        <View className="mb-3 mt-5">
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
        <View className="mt-5 gap-4">
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
    </Animated.View>
  )
}
