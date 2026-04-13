import { useMemo } from 'react';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import AppBottomNav from '../components/app-bottom-nav';
import ProductArtwork from '../components/product-artwork';
import { useCart } from '../context/cart-context';
import { useInventory } from '../context/inventory-context';

function CartRow({ item, product, onToggle, onDecrease, onIncrease }) {
  return (
    <View style={styles.itemCard}>
      <Pressable onPress={onToggle} style={styles.checkWrap}>
        <Feather
          name={item.selected ? 'check-square' : 'square'}
          size={20}
          color={item.selected ? '#5bb8d4' : '#4a6d80'}
        />
      </Pressable>

      <View style={styles.itemArtwork}>
        <View style={styles.itemArtworkScale}>
          <ProductArtwork item={product} />
        </View>
      </View>

      <View style={styles.itemInfo}>
        <Text style={styles.itemTitle}>{product.name}</Text>
        <Text style={styles.itemSubtitle}>{product.name}</Text>
        <Text style={styles.itemPrice}>{product.price}</Text>
      </View>

      <View style={styles.itemQty}>
        <Pressable style={styles.qtyButton} onPress={onIncrease}>
          <Feather name="plus" size={12} color="#5aa6c4" />
        </Pressable>
        <Text style={styles.qtyValue}>{item.quantity}</Text>
        <Pressable style={styles.qtyButton} onPress={onDecrease}>
          <Feather name="minus" size={12} color="#8ba2ae" />
        </Pressable>
      </View>
    </View>
  );
}

export default function CarrinhoScreen() {
  const router = useRouter();
  const { items, toggleSelected, updateQuantity, selectedCount, totalPrice } = useCart();
  const { products } = useInventory();

  const cartProducts = useMemo(
    () =>
      items
        .map((item) => ({
          item,
          product: products.find((product) => product.id === item.productId),
        }))
        .filter((entry) => entry.product),
    [items, products]
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.shell}>
        <Text style={styles.headerLabel}>Carrinho</Text>

        <View style={styles.panel}>
          <View style={styles.topBar}>
            <Pressable style={styles.backButton} onPress={() => router.back()}>
              <Feather name="chevron-left" size={22} color="#5aa6c4" />
            </Pressable>
            <Text style={styles.title}>Carrinho</Text>
            <View style={styles.placeholder} />
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
            {cartProducts.map(({ item, product }) => (
              <CartRow
                key={product.id}
                item={item}
                product={product}
                onToggle={() => toggleSelected(product.id)}
                onIncrease={() => updateQuantity(product.id, item.quantity + 1)}
                onDecrease={() => updateQuantity(product.id, item.quantity - 1)}
              />
            ))}

            <View style={styles.addressRow}>
              <Pressable style={styles.addressButton} onPress={() => router.push('/endereco')}>
                <Feather name="map-pin" size={14} color="#2c2c2c" />
                <Text style={styles.addressText}>Endereco</Text>
              </Pressable>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryText}>Total de itens: {selectedCount}</Text>
              <Pressable style={styles.checkoutButton}>
                <Text style={styles.checkoutText}>
                  Continuar compra
                  {selectedCount > 0 ? ` - R$${totalPrice.toFixed(0)}` : ''}
                </Text>
              </Pressable>
            </View>
          </ScrollView>

          <AppBottomNav active="cart" />
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
    overflow: 'hidden',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 12,
  },
  backButton: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#171717',
  },
  placeholder: {
    width: 28,
  },
  content: {
    paddingHorizontal: 10,
    paddingBottom: 120,
  },
  itemCard: {
    minHeight: 56,
    backgroundColor: '#d1e4ef',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    marginBottom: 10,
  },
  checkWrap: {
    width: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemArtwork: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  itemArtworkScale: {
    transform: [{ scale: 0.55 }],
  },
  itemInfo: {
    flex: 1,
    paddingRight: 6,
  },
  itemTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#202020',
    lineHeight: 14,
    maxWidth: 116,
  },
  itemSubtitle: {
    fontSize: 10,
    color: '#8aa0af',
    marginTop: 1,
  },
  itemPrice: {
    fontSize: 11,
    fontWeight: '700',
    color: '#13b3db',
    marginTop: 1,
  },
  itemQty: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qtyButton: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#f2f7fb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyValue: {
    minWidth: 12,
    textAlign: 'center',
    fontSize: 12,
    color: '#40515c',
    marginHorizontal: 3,
  },
  addressRow: {
    alignItems: 'flex-end',
    marginTop: 6,
    marginBottom: 24,
  },
  addressButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2d2d2d',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 4,
  },
  addressText: {
    color: '#202020',
    fontSize: 12,
    fontWeight: '600',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 22,
  },
  summaryText: {
    color: '#717171',
    fontSize: 15,
  },
  checkoutButton: {
    minWidth: 140,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#12b6df',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  checkoutText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});
