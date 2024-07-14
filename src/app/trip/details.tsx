import { Link2, Plus, Tag, UserCog } from 'lucide-react-native'
import { useState } from 'react'
import { Alert, ScrollView, Text, View } from 'react-native'
import Animated, { SlideInRight, SlideOutRight } from 'react-native-reanimated'

import { Button } from '@/components/button'
import { Input } from '@/components/input'
import { Modal } from '@/components/modal'
import { Participant } from '@/components/participant'
import { TripLink } from '@/components/trip-link'
import { useCreateLink, useTripLinks } from '@/server/links'
import { useTripParticipants } from '@/server/participants'
import { colors } from '@/styles/colors'
import { validateInput } from '@/utils/validate-input'

enum VisibleModalEnum {
  NONE,
  NEW_LINK,
}

interface DetailsProps {
  tripId: string
}

export function Details({ tripId }: DetailsProps) {
  const [visibleModal, setVisibleModal] = useState(VisibleModalEnum.NONE)

  const [linkTitle, setLinkTitle] = useState('')
  const [linkUrl, setLinkUrl] = useState('')

  const { data: tripLinks } = useTripLinks(tripId)
  const { data: tripParticipants } = useTripParticipants(tripId)
  const { mutate: createLink, isPending: isCreatingTripLink } = useCreateLink()

  function resetTripLinkFields() {
    setLinkTitle('')
    setLinkUrl('')
  }

  function handleCreateTripLink() {
    if (!linkTitle.trim()) {
      return Alert.alert('Cadastrar link', 'Informe um título para o link.')
    }

    if (!validateInput.url(linkUrl)) {
      return Alert.alert(
        'Cadastrar link',
        'Informe uma URL válida para o link.',
      )
    }

    createLink(
      {
        trip_id: tripId,
        url: linkUrl,
        title: linkTitle,
      },
      {
        onSuccess: () => {
          resetTripLinkFields()
        },
        onError: () => {
          Alert.alert('Cadastrar link', 'Ocorreu uma falha ao salvar o link.')
        },
      },
    )
  }

  const links = tripLinks?.links ?? []
  const participants = tripParticipants?.participants ?? []

  return (
    <Animated.View
      className="flex-1 pt-5"
      entering={SlideInRight.duration(400)}
      exiting={SlideOutRight.duration(400)}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="flex-grow-1 gap-5 pb-48"
      >
        <View className="gap-6">
          <Text className="font-semibold text-xl text-zinc-50">
            Links importantes
          </Text>

          <View className="gap-5">
            {links.length > 0 ? (
              links.map((link) => <TripLink key={link.id} data={link} />)
            ) : (
              <Text className="font-regular text-sm text-zinc-500">
                Nenhum link adicionado.
              </Text>
            )}
          </View>

          <Button
            variant="secondary"
            onPress={() => setVisibleModal(VisibleModalEnum.NEW_LINK)}
          >
            <Plus color={colors.zinc[200]} size={20} />
            <Button.Title>Cadastrar novo link</Button.Title>
          </Button>
        </View>

        <View className="h-px bg-zinc-800" />

        <View className="gap-6">
          <Text className="font-semibold text-xl text-zinc-50">Convidados</Text>

          <View className="gap-5">
            {participants.map((participant) => (
              <Participant key={participant.id} data={participant} />
            ))}
          </View>

          <Button variant="secondary">
            <UserCog color={colors.zinc[200]} size={20} />
            <Button.Title>Gerenciar convidados</Button.Title>
          </Button>
        </View>

        <Modal
          title="Cadastrar link"
          subtitle="Todos os convidados podem visualizar os links importantes."
          visible={visibleModal === VisibleModalEnum.NEW_LINK}
          onClose={() => setVisibleModal(VisibleModalEnum.NONE)}
        >
          <View className="mb-3 mt-5 gap-2">
            <Input variant="secondary">
              <Tag color={colors.zinc[400]} size={20} />

              <Input.Field
                value={linkTitle}
                placeholder="Título do link"
                onChangeText={setLinkTitle}
              />
            </Input>

            <Input variant="secondary">
              <Link2 color={colors.zinc[400]} size={20} />

              <Input.Field
                value={linkUrl}
                placeholder="URL"
                keyboardType="url"
                onChangeText={setLinkUrl}
              />
            </Input>
          </View>

          <Button isLoading={isCreatingTripLink} onPress={handleCreateTripLink}>
            <Button.Title>Salvar link</Button.Title>
          </Button>
        </Modal>
      </ScrollView>
    </Animated.View>
  )
}
