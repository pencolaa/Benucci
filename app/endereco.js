import { useMemo, useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import { Alert, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

const initialAddresses = [
  {
    id: 'home',
    title: 'Casa',
    subtitle: 'Rua Marcilio Dias, 260 - Canto do Forte',
    icon: 'home',
  },
  {
    id: 'saved',
    title: 'R. Marcilio Dias',
    subtitle: 'Canto do Forte, Praia Grande - SP',
    icon: 'map-pin',
  },
];

function AddressCard({
  item,
  isSelected,
  isEditing,
  editTitle,
  editSubtitle,
  onSelect,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onDelete,
  onChangeTitle,
  onChangeSubtitle,
}) {
  return (
    <Pressable
      style={[styles.addressCard, isSelected && styles.addressCardSelected]}
      onPress={onSelect}>
      <View style={styles.addressTopRow}>
        <View style={[styles.addressIconWrap, isSelected && styles.addressIconWrapSelected]}>
          <Feather name={item.icon} size={18} color="#52bdd7" />
        </View>

        <View style={styles.addressInfo}>
          {isEditing ? (
            <>
              <TextInput
                value={editTitle}
                onChangeText={onChangeTitle}
                placeholder="Nome do endereco"
                placeholderTextColor="#98a4ae"
                style={[styles.editInput, styles.editInputTitle]}
              />
              <TextInput
                value={editSubtitle}
                onChangeText={onChangeSubtitle}
                placeholder="Rua, numero e bairro"
                placeholderTextColor="#98a4ae"
                style={[styles.editInput, styles.editInputSubtitle]}
                multiline
              />
              <View style={styles.editActionRow}>
                <Pressable style={[styles.smallAction, styles.cancelAction]} onPress={onCancelEdit}>
                  <Text style={[styles.smallActionText, styles.cancelActionText]}>Cancelar</Text>
                </Pressable>
                <Pressable style={styles.smallAction} onPress={onSaveEdit}>
                  <Text style={styles.smallActionText}>Salvar</Text>
                </Pressable>
              </View>
            </>
          ) : (
            <>
              <View style={styles.addressHeaderRow}>
                <Text style={styles.addressTitle}>{item.title}</Text>
                <View style={styles.actionRow}>
                  <Pressable style={styles.smallAction} onPress={onDelete}>
                    <Text style={styles.smallActionText}>Excluir</Text>
                  </Pressable>
                  <Pressable style={styles.smallAction} onPress={onStartEdit}>
                    <Text style={styles.smallActionText}>Editar</Text>
                  </Pressable>
                </View>
              </View>
              <Text style={styles.addressSubtitle}>{item.subtitle}</Text>
            </>
          )}
        </View>
      </View>
    </Pressable>
  );
}

export default function EnderecoScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [addresses, setAddresses] = useState(initialAddresses);
  const [selectedAddressId, setSelectedAddressId] = useState(initialAddresses[0].id);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [draftTitle, setDraftTitle] = useState('');
  const [draftSubtitle, setDraftSubtitle] = useState('');
  const [currentLocationLabel, setCurrentLocationLabel] = useState('Toque para usar sua localizacao real');
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);

  const filteredAddresses = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return addresses;
    }

    return addresses.filter((item) => {
      return (
        item.title.toLowerCase().includes(normalizedQuery) ||
        item.subtitle.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [addresses, searchQuery]);

  function startEditing(item) {
    setEditingAddressId(item.id);
    setDraftTitle(item.title);
    setDraftSubtitle(item.subtitle);
  }

  function saveEditing(itemId) {
    const nextTitle = draftTitle.trim();
    const nextSubtitle = draftSubtitle.trim();

    if (!nextTitle || !nextSubtitle) {
      Alert.alert('Campos obrigatorios', 'Preencha o nome e o endereco antes de salvar.');
      return;
    }

    setAddresses((currentAddresses) =>
      currentAddresses.map((item) =>
        item.id === itemId
          ? {
              ...item,
              title: nextTitle,
              subtitle: nextSubtitle,
            }
          : item
      )
    );
    setEditingAddressId(null);
    setDraftTitle('');
    setDraftSubtitle('');
  }

  function deleteAddress(itemId) {
    setAddresses((currentAddresses) => {
      const nextAddresses = currentAddresses.filter((item) => item.id !== itemId);

      if (selectedAddressId === itemId && nextAddresses.length > 0) {
        setSelectedAddressId(nextAddresses[0].id);
      }

      return nextAddresses;
    });

    if (editingAddressId === itemId) {
      setEditingAddressId(null);
      setDraftTitle('');
      setDraftSubtitle('');
    }
  }

  async function applyCurrentLocation() {
    try {
      setIsFetchingLocation(true);
      setCurrentLocationLabel('Buscando sua localizacao atual...');

      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        setCurrentLocationLabel('Permissao negada para acessar sua localizacao');
        Alert.alert('Permissao negada', 'Autorize a localizacao do aparelho para preencher o endereco automaticamente.');
        return;
      }

      const currentPosition = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const [place] = await Location.reverseGeocodeAsync({
        latitude: currentPosition.coords.latitude,
        longitude: currentPosition.coords.longitude,
      });

      const streetLine = [place?.street, place?.streetNumber].filter(Boolean).join(', ');
      const regionLine = [place?.district, place?.city, place?.region].filter(Boolean).join(' - ');
      const formattedAddress = [streetLine, regionLine].filter(Boolean).join(' - ');
      const nextSubtitle =
        formattedAddress || `${currentPosition.coords.latitude.toFixed(5)}, ${currentPosition.coords.longitude.toFixed(5)}`;

      setCurrentLocationLabel(nextSubtitle);

      setAddresses((currentAddresses) => {
        const locationAddress = {
          id: 'current-location',
          title: 'Local atual',
          subtitle: nextSubtitle,
          icon: 'crosshair',
        };

        const alreadyExists = currentAddresses.some((item) => item.id === locationAddress.id);

        if (alreadyExists) {
          return currentAddresses.map((item) => (item.id === locationAddress.id ? locationAddress : item));
        }

        return [locationAddress, ...currentAddresses];
      });

      setSelectedAddressId('current-location');
    } catch (_error) {
      setCurrentLocationLabel('Nao foi possivel obter sua localizacao');
      Alert.alert('Erro ao buscar localizacao', 'Nao foi possivel localizar o aparelho neste momento.');
    } finally {
      setIsFetchingLocation(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.shell}>
        <Text style={styles.headerLabel}>Enderecos</Text>

        <View style={styles.panel}>
          <View style={styles.topBar}>
            <Pressable style={styles.backButton} onPress={() => router.back()}>
              <Feather name="chevron-left" size={20} color="#56bad5" />
            </Pressable>
            <Text style={styles.title}>Endereco de entrega</Text>
            <View style={styles.placeholder} />
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
            <View style={styles.searchBar}>
              <Feather name="search" size={16} color="#b7bcc4" />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Endereco e numero"
                placeholderTextColor="#b7bcc4"
                style={styles.searchInput}
              />
            </View>

            <Pressable style={styles.locationCurrent} onPress={applyCurrentLocation} disabled={isFetchingLocation}>
              <View style={styles.locationIconWrap}>
                <Feather name="crosshair" size={14} color="#52bdd7" />
              </View>
              <View style={styles.locationTextWrap}>
                <Text style={styles.locationTitle}>Usar localizacao atual</Text>
                <Text style={styles.locationSubtitle}>{currentLocationLabel}</Text>
              </View>
              {isFetchingLocation ? <Feather name="loader" size={14} color="#52bdd7" /> : null}
            </Pressable>

            <View style={styles.cardsWrap}>
              {filteredAddresses.map((item) => (
                <AddressCard
                  key={item.id}
                  item={item}
                  isSelected={selectedAddressId === item.id}
                  isEditing={editingAddressId === item.id}
                  editTitle={draftTitle}
                  editSubtitle={draftSubtitle}
                  onSelect={() => setSelectedAddressId(item.id)}
                  onStartEdit={() => startEditing(item)}
                  onCancelEdit={() => {
                    setEditingAddressId(null);
                    setDraftTitle('');
                    setDraftSubtitle('');
                  }}
                  onSaveEdit={() => saveEditing(item.id)}
                  onDelete={() => deleteAddress(item.id)}
                  onChangeTitle={setDraftTitle}
                  onChangeSubtitle={setDraftSubtitle}
                />
              ))}
            </View>

            {filteredAddresses.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyTitle}>Nenhum endereco encontrado</Text>
                <Text style={styles.emptyText}>Tente outro termo de busca para localizar seus enderecos.</Text>
              </View>
            ) : null}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#212121',
  },
  shell: {
    flex: 1,
    paddingTop: 8,
  },
  headerLabel: {
    color: '#6c6c6c',
    fontSize: 18,
    marginLeft: 14,
    marginBottom: 6,
  },
  panel: {
    flex: 1,
    marginHorizontal: 10,
    backgroundColor: '#cddbe4',
    borderTopLeftRadius: 34,
    borderTopRightRadius: 34,
    borderBottomLeftRadius: 34,
    borderBottomRightRadius: 34,
    overflow: 'hidden',
  },
  topBar: {
    backgroundColor: '#f6f6f6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 14,
  },
  backButton: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#181818',
  },
  placeholder: {
    width: 28,
  },
  content: {
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 120,
  },
  searchBar: {
    height: 38,
    borderRadius: 19,
    backgroundColor: '#e3e5e8',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    color: '#31353a',
    fontSize: 13,
    paddingVertical: 0,
  },
  locationCurrent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 14,
  },
  locationTextWrap: {
    flex: 1,
  },
  locationIconWrap: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#98d5e3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationTitle: {
    color: '#161616',
    fontSize: 13,
    fontWeight: '500',
  },
  locationSubtitle: {
    color: '#5b646f',
    fontSize: 11,
    marginTop: 2,
  },
  cardsWrap: {
    gap: 14,
  },
  addressCard: {
    backgroundColor: '#f5f6f7',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  addressCardSelected: {
    borderWidth: 1,
    borderColor: '#a8dae7',
  },
  addressTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  addressIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  addressIconWrapSelected: {
    backgroundColor: '#e1f4f8',
  },
  addressInfo: {
    flex: 1,
    marginLeft: 10,
  },
  addressHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  addressTitle: {
    color: '#171717',
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    paddingRight: 8,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 6,
  },
  editActionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 6,
    marginTop: 8,
  },
  smallAction: {
    backgroundColor: '#b8edf6',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  cancelAction: {
    backgroundColor: '#e5ebef',
  },
  smallActionText: {
    color: '#24748a',
    fontSize: 9,
    fontWeight: '700',
  },
  cancelActionText: {
    color: '#66727c',
  },
  addressSubtitle: {
    color: '#505a64',
    fontSize: 12,
    lineHeight: 17,
    marginTop: 6,
    maxWidth: 180,
  },
  editInput: {
    borderRadius: 10,
    backgroundColor: '#edf2f5',
    color: '#26323b',
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 12,
  },
  editInputTitle: {
    fontWeight: '600',
    marginBottom: 8,
  },
  editInputSubtitle: {
    minHeight: 64,
    textAlignVertical: 'top',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 28,
  },
  emptyTitle: {
    color: '#1f2b34',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  emptyText: {
    color: '#72808c',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 19,
    maxWidth: 220,
  },
});
