import { useMemo } from 'react';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import AppBottomNav from '../components/app-bottom-nav';
import ProductArtwork from '../components/product-artwork';
import { useFavorites } from '../context/favorites-context';
import { useInventory } from '../context/inventory-context';

function FavoriteCard({ product, onOpen, onRemove }) {
  return (
    <Pressable style={styles.card} onPress={onOpen}>
      <View style={styles.cardArtwork}>
        <ProductArtwork item={product} />
      </View>
      <Text style={styles.cardName}>{product.name}</Text>
      <Text style={styles.cardPrice}>{product.price}</Text>
      <Pressable style={styles.trashButton} onPress={onRemove} hitSlop={8}>
        <Feather name="trash-2" size={12} color="#75c3da" />
      </Pressable>
    </Pressable>
  );
}

export default function FavoritosScreen() {
  const router = useRouter();
  const { favoriteIds, removeFavorite } = useFavorites();
  const { products } = useInventory();

  const favoriteProducts = useMemo(
    () => products.filter((product) => favoriteIds.includes(product.id)),
    [favoriteIds, products]
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.panel}>
        <View style={styles.topBar}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Feather name="chevron-left" size={20} color="#6bbad4" />
          </Pressable>
          <Text style={styles.title}>Favoritados</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.grid}>
          {favoriteProducts.map((product) => (
            <FavoriteCard
              key={product.id}
              product={product}
              onOpen={() => router.push({ pathname: '/produto', params: { id: product.id } })}
              onRemove={() => removeFavorite(product.id)}
            />
          ))}
        </View>

        <AppBottomNav active="favorites" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#212121',
    paddingHorizontal: 4,
    paddingTop: 8,
  },
  panel: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 16,
  },
  backButton: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1f1f1f',
  },
  placeholder: {
    width: 28,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 110,
    rowGap: 24,
  },
  card: {
    width: '46%',
    height: 118,
    borderRadius: 14,
    backgroundColor: '#d7e4ec',
    alignItems: 'center',
    justifyContent: 'flex-start',
    position: 'relative',
    paddingTop: 10,
    paddingHorizontal: 6,
  },
  cardArtwork: {
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardName: {
    marginTop: 6,
    fontSize: 11,
    fontWeight: '600',
    color: '#202020',
    textAlign: 'center',
  },
  cardPrice: {
    marginTop: 2,
    fontSize: 11,
    fontWeight: '700',
    color: '#16b5db',
    textAlign: 'center',
  },
  trashButton: {
    position: 'absolute',
    right: 8,
    bottom: 8,
  },
});
