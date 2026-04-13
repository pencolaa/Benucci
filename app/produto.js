import { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import ProductArtwork from '../components/product-artwork';
import { useCart } from '../context/cart-context';
import { useFavorites } from '../context/favorites-context';
import { useInventory } from '../context/inventory-context';

const reviews = [
  {
    id: '1',
    author: 'Cliente',
    rating: 5,
    text: 'Produto otimo, chegou no prazo!',
  },
  {
    id: '2',
    author: 'Cliente',
    rating: 5,
    text: 'Qualidade de produto maravilhosa, recomendo muito!',
  },
];

function SizeChip({ label, active, onPress }) {
  return (
    <Pressable style={[styles.sizeChip, active && styles.sizeChipActive]} onPress={onPress}>
      <Text style={[styles.sizeChipText, active && styles.sizeChipTextActive]}>{label}</Text>
    </Pressable>
  );
}

export default function ProdutoScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { getProductById, products } = useInventory();
  const product = getProductById(Array.isArray(id) ? id[0] : id);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] ?? '');
  const { addItem } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    if (!product) {
      return;
    }

    setSelectedSize(product.sizes[0] ?? '');
    setQuantity(1);
  }, [product]);

  if (!product) {
    return null;
  }

  const recommendedProducts = products.filter((item) => item.id !== product.id).slice(0, 2);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.shell}>
        <Text style={styles.headerLabel}>Produto</Text>

        <View style={styles.panel}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.content}>
            <View style={styles.topActions}>
              <Pressable style={styles.iconButton} onPress={() => router.back()}>
                <Feather name="chevron-left" size={22} color="#9ab0be" />
              </Pressable>

              <Pressable style={styles.iconButton} onPress={() => toggleFavorite(product.id)}>
                <Feather
                  name="heart"
                  size={18}
                  color={isFavorite(product.id) ? '#f05a73' : '#63b8d3'}
                />
              </Pressable>
            </View>

            <View style={styles.heroWrap}>
              <ProductArtwork item={product} large />
            </View>

            <View style={styles.infoRow}>
              <View>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productPrice}>{product.price}</Text>
              </View>

              <View style={styles.qtyWrap}>
                <Pressable
                  style={styles.qtyButton}
                  onPress={() => setQuantity((current) => Math.max(1, current - 1))}>
                  <Feather name="minus" size={14} color="#ffffff" />
                </Pressable>
                <Text style={styles.qtyValue}>{quantity}</Text>
                <Pressable
                  style={styles.qtyButton}
                  onPress={() => setQuantity((current) => current + 1)}>
                  <Feather name="plus" size={14} color="#ffffff" />
                </Pressable>
              </View>
            </View>

            <Text style={styles.sectionTitle}>Tamanho em cm</Text>
            <View style={styles.sizesRow}>
              {product.sizes.map((size) => (
                <SizeChip
                  key={size}
                  label={size}
                  active={selectedSize === size}
                  onPress={() => setSelectedSize(size)}
                />
              ))}
            </View>

            <Text style={styles.sectionTitle}>Cores disponiveis</Text>
            <Text style={styles.metaText}>{product.colors.join(', ')}</Text>

            <Text style={styles.sectionTitle}>Estoque</Text>
            <Text style={styles.metaText}>{product.stock} unidade(s) disponivel(is)</Text>

            <Text style={styles.sectionTitle}>Descricao</Text>
            <Text style={styles.descriptionTitle}>{product.name.toUpperCase()}</Text>
            <Text style={styles.descriptionText}>{product.description}</Text>

            <Text style={styles.sectionTitle}>Avaliacoes</Text>
            <View style={styles.ratingSummary}>
              <Text style={styles.ratingValue}>5.0</Text>
              <View style={styles.ratingStars}>
                {Array.from({ length: 5 }).map((_, index) => (
                  <Feather key={index} name="star" size={12} color="#202020" />
                ))}
              </View>
            </View>

            {reviews.map((review) => (
              <View key={review.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <View style={styles.reviewAvatar}>
                    <Feather name="user" size={18} color="#ffffff" />
                  </View>
                  <View style={styles.reviewStars}>
                    {Array.from({ length: review.rating }).map((_, index) => (
                      <Feather key={index} name="star" size={13} color="#f2b322" />
                    ))}
                  </View>
                </View>
                <Text style={styles.reviewText}>{review.text}</Text>
              </View>
            ))}

            <Text style={[styles.sectionTitle, styles.recommendedTitle]}>Recomendados</Text>
            <View style={styles.recommendedRow}>
              {recommendedProducts.map((item) => (
                <Pressable
                  key={item.id}
                  style={styles.recommendedItem}
                  onPress={() => router.replace({ pathname: '/produto', params: { id: item.id } })}>
                  <View style={styles.recommendedCard}>
                    <ProductArtwork item={item} />
                  </View>
                  <Text style={styles.recommendedName}>{item.name}</Text>
                </Pressable>
              ))}
            </View>

            <Pressable
              style={styles.button}
              onPress={() => {
                addItem(product.id, quantity);
                router.push('/carrinho');
              }}>
              <Text style={styles.buttonText}>Adicionar ao carrinho</Text>
            </Pressable>
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
    backgroundColor: '#f4f4f4',
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
  },
  content: {
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 18,
  },
  topActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#eef2f4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
    paddingBottom: 14,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  productName: {
    fontSize: 25,
    fontWeight: '700',
    color: '#1d1d1d',
  },
  productPrice: {
    fontSize: 24,
    fontWeight: '700',
    color: '#14b4dd',
    marginTop: 4,
  },
  qtyWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  qtyButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#18b7df',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyValue: {
    minWidth: 10,
    textAlign: 'center',
    color: '#404040',
    fontSize: 16,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#202020',
    marginBottom: 8,
  },
  sizesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 14,
  },
  sizeChip: {
    minWidth: 30,
    height: 24,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#79bedd',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  sizeChipActive: {
    backgroundColor: '#e7f8fd',
  },
  sizeChipText: {
    color: '#4d95b9',
    fontSize: 11,
    fontWeight: '600',
  },
  sizeChipTextActive: {
    color: '#168fba',
  },
  descriptionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#515151',
    marginBottom: 2,
  },
  descriptionText: {
    fontSize: 12,
    lineHeight: 17,
    color: '#9ea7ae',
    marginBottom: 18,
  },
  metaText: {
    fontSize: 12,
    lineHeight: 17,
    color: '#60717b',
    marginBottom: 14,
  },
  ratingSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -2,
    marginBottom: 10,
  },
  ratingValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#202020',
    marginRight: 6,
  },
  ratingStars: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewCard: {
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  reviewAvatar: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#167fd0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  reviewStars: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewText: {
    color: '#888888',
    fontSize: 12,
    lineHeight: 16,
    maxWidth: 150,
  },
  recommendedTitle: {
    marginTop: 2,
    marginBottom: 12,
  },
  recommendedRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 12,
    marginBottom: 18,
  },
  recommendedItem: {
    alignItems: 'center',
  },
  recommendedCard: {
    width: 84,
    height: 84,
    borderRadius: 22,
    backgroundColor: '#d7e4ec',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recommendedName: {
    marginTop: 6,
    fontSize: 11,
    fontWeight: '600',
    color: '#2a2a2a',
    textAlign: 'center',
    maxWidth: 84,
  },
  button: {
    height: 42,
    borderRadius: 21,
    backgroundColor: '#12b6df',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 'auto',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
});
