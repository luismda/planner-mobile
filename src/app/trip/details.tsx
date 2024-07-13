import { Link2, Plus, Tag } from 'lucide-react-native'
import { useCallback, useEffect, useState } from 'react'
import { Alert, FlatList, Text, View } from 'react-native'

import { Button } from '@/components/button'
import { Input } from '@/components/input'
import { Modal } from '@/components/modal'
import { Participant, ParticipantProps } from '@/components/participant'
import { TripLink, TripLinkProps } from '@/components/trip-link'
import { createLink, getLinksByTripId } from '@/server/links'
import { getParticipantsByTripId } from '@/server/participants'
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

  const [isCreatingTripLink, setIsCreatingTripLink] = useState(false)

  const [links, setLinks] = useState<TripLinkProps[]>([])
  const [participants, setParticipants] = useState<ParticipantProps[]>([])

  const fetchTripLinks = useCallback(async () => {
    try {
      const { links } = await getLinksByTripId(tripId)

      setLinks(links)
    } catch (error) {
      console.warn(error)
    }
  }, [tripId])

  const fetchTripParticipants = useCallback(async () => {
    try {
      const { participants } = await getParticipantsByTripId(tripId)

      setParticipants(participants)
    } catch (error) {
      console.warn(error)
    }
  }, [tripId])

  function resetTripLinkFields() {
    setLinkTitle('')
    setLinkUrl('')
  }

  async function handleCreateTripLink() {
    if (!linkTitle.trim()) {
      return Alert.alert('Cadastrar link', 'Informe um título para o link.')
    }

    if (!validateInput.url(linkUrl)) {
      return Alert.alert(
        'Cadastrar link',
        'Informe uma URL válida para o link.',
      )
    }

    setIsCreatingTripLink(true)

    try {
      await createLink({
        trip_id: tripId,
        url: linkUrl,
        title: linkTitle,
      })

      await fetchTripLinks()

      resetTripLinkFields()
    } catch (error) {
      console.warn(error)
    } finally {
      setIsCreatingTripLink(false)
    }
  }

  useEffect(() => {
    fetchTripLinks()
  }, [fetchTripLinks])

  useEffect(() => {
    fetchTripParticipants()
  }, [fetchTripParticipants])

  return (
    <View className="flex-1 pt-5">
      <Text className="mb-2 font-semibold text-2xl text-zinc-50">
        Links importantes
      </Text>

      <View className="flex-1">
        <FlatList
          data={links}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerClassName="gap-4 pb-44"
          renderItem={({ item }) => <TripLink data={item} />}
          ListEmptyComponent={
            <Text className="mb-6 mt-2 font-regular text-base text-zinc-400">
              Nenhum link adicionado.
            </Text>
          }
        />

        <Button
          variant="secondary"
          onPress={() => setVisibleModal(VisibleModalEnum.NEW_LINK)}
        >
          <Plus color={colors.zinc[200]} size={20} />
          <Button.Title>Cadastrar novo link</Button.Title>
        </Button>
      </View>

      <View className="mt-6 flex-1 border-t border-zinc-800">
        <Text className="my-6 font-semibold text-2xl text-zinc-50">
          Convidados
        </Text>

        <FlatList
          data={participants}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerClassName="gap-4 pb-44"
          renderItem={({ item }) => <Participant data={item} />}
        />
      </View>

      <Modal
        title="Cadastrar link"
        subtitle="Todos os convidados podem visualizar os links importantes."
        visible={visibleModal === VisibleModalEnum.NEW_LINK}
        onClose={() => setVisibleModal(VisibleModalEnum.NONE)}
      >
        <View className="mb-3 gap-2">
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
    </View>
  )
}
