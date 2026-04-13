import { useDeferredValue, useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import AppBottomNav from '../components/app-bottom-nav';
import ProductArtwork from '../components/product-artwork';
import { parsePriceValue } from '../constants/products';
import { useAuth } from '../context/auth-context';
import { useInventory } from '../context/inventory-context';

function SearchBar({ value, onChangeText, onReset, hasActiveFilters }) {
  return (
    <View style={styles.searchBar}>
      <Feather name="search" size={18} color="#9ca7b4" />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Procure aqui"
        placeholderTextColor="#b0b7c2"
        style={styles.searchInput}
      />
      <Pressable onPress={onReset} hitSlop={8}>
        <Feather name={hasActiveFilters ? 'x-circle' : 'sliders'} size={18} color="#9ca7b4" />
      </Pressable>
    </View>
  );
}

function CategoryPill({ label, active, onPress }) {
  return (
    <Pressable style={[styles.categoryPill, active && styles.categoryPillActive]} onPress={onPress}>
      <Text style={[styles.categoryText, active && styles.categoryTextActive]}>{label}</Text>
    </Pressable>
  );
}

function ProductCard({ item, onPress }) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.artworkWrap}>
        <ProductArtwork item={item} />
      </View>
      <Text style={styles.cardTitle}>{item.name}</Text>
      <Text style={styles.cardPrice}>{item.price}</Text>
    </Pressable>
  );
}

export default function DashboardScreen() {
  const router = useRouter();
  const { products } = useInventory();
  const { userName, isAdmin } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tudo');
  const [sortMode, setSortMode] = useState('default');
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const categories = useMemo(
    () => ['Tudo', ...new Set(products.map((product) => product.category || 'Imagem'))],
    [products]
  );

  const filteredProducts = useMemo(() => {
    const normalizedQuery = deferredSearchQuery.trim().toLowerCase();

    const visibleProducts = products.filter((product) => {
      const category = product.category || 'Imagem';
      const matchesCategory = selectedCategory === 'Tudo' || category === selectedCategory;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        product.name.toLowerCase().includes(normalizedQuery) ||
        product.description.toLowerCase().includes(normalizedQuery) ||
        category.toLowerCase().includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });

    if (sortMode === 'price-asc') {
      return [...visibleProducts].sort(
        (first, second) => parsePriceValue(first.price) - parsePriceValue(second.price)
      );
    }

    if (sortMode === 'price-desc') {
      return [...visibleProducts].sort(
        (first, second) => parsePriceValue(second.price) - parsePriceValue(first.price)
      );
    }

    if (sortMode === 'name-asc') {
      return [...visibleProducts].sort((first, second) => first.name.localeCompare(second.name, 'pt-BR'));
    }

    return visibleProducts;
  }, [deferredSearchQuery, products, selectedCategory, sortMode]);

  const hasActiveFilters =
    searchQuery.trim().length > 0 || selectedCategory !== 'Tudo' || sortMode !== 'default';

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.shell}>
        <Text style={styles.headerLabel}>Home</Text>

        <View style={styles.panel}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}>
            <View style={styles.topRow}>
              <View style={styles.userBlock}>
                <View style={styles.avatar}>
                  <Feather name="user" size={22} color="#ffffff" />
                </View>

                <View>
                  <Text style={styles.welcomeText}>Bem-vindo(a)!</Text>
                  <Text style={styles.userName}>{userName || 'Cliente'}</Text>
                  <View style={styles.locationRow}>
                    <Feather name="map-pin" size={11} color="#c9d1da" />
                    <Text style={styles.locationText}>Praia Grande, Sao Paulo</Text>
                  </View>
                </View>
              </View>

              <View style={styles.notificationBadge}>
                <Pressable onPress={() => isAdmin && router.push('/admin')} hitSlop={8}>
                  <Feather name={isAdmin ? 'shield' : 'bell'} size={18} color="#65b9d2" />
                </Pressable>
                {isAdmin ? <View style={styles.notificationDot} /> : null}
              </View>
            </View>

            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              hasActiveFilters={hasActiveFilters}
              onReset={() => {
                setSearchQuery('');
                setSelectedCategory('Tudo');
                setSortMode('default');
              }}
            />

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Categoria</Text>
              <View style={styles.sortGroup}>
                <Pressable
                  style={[styles.sortButton, sortMode === 'price-asc' && styles.sortButtonActive]}
                  onPress={() =>
                    setSortMode((currentMode) => (currentMode === 'price-asc' ? 'default' : 'price-asc'))
                  }>
                  <Feather name="arrow-up" size={16} color="#48697d" />
                </Pressable>
                <Pressable
                  style={[styles.sortButton, sortMode === 'price-desc' && styles.sortButtonActive]}
                  onPress={() =>
                    setSortMode((currentMode) => (currentMode === 'price-desc' ? 'default' : 'price-desc'))
                  }>
                  <Feather name="arrow-down" size={16} color="#48697d" />
                </Pressable>
                <Pressable
                  style={[
                    styles.sortButton,
                    styles.sortWide,
                    sortMode === 'name-asc' && styles.sortButtonActive,
                  ]}
                  onPress={() =>
                    setSortMode((currentMode) => (currentMode === 'name-asc' ? 'default' : 'name-asc'))
                  }>
                  <Text style={styles.sortWideText}>A - Z</Text>
                </Pressable>
              </View>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesRow}>
              {categories.map((category) => (
                <CategoryPill
                  key={category}
                  label={category}
                  active={selectedCategory === category}
                  onPress={() => setSelectedCategory(category)}
                />
              ))}
            </ScrollView>

            <View style={styles.grid}>
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  item={product}
                  onPress={() => router.push({ pathname: '/produto', params: { id: product.id } })}
                />
              ))}
            </View>

            {filteredProducts.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyTitle}>Nenhum produto encontrado</Text>
                <Text style={styles.emptyText}>Ajuste sua busca ou limpe os filtros para ver mais itens.</Text>
              </View>
            ) : null}
          </ScrollView>

          <AppBottomNav active="home" />
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
    marginLeft: 24,
    marginBottom: 6,
  },
  panel: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    borderTopLeftRadius: 34,
    borderTopRightRadius: 34,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
    marginHorizontal: 10,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 120,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  userBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#1878c9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeText: {
    fontSize: 14,
    color: '#9ba6b1',
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#252525',
    marginTop: -2,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  locationText: {
    fontSize: 11,
    color: '#c0c8d1',
  },
  notificationBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#e8eef2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationDot: {
    position: 'absolute',
    top: 7,
    right: 8,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#f25c5c',
  },
  searchBar: {
    height: 42,
    borderRadius: 21,
    backgroundColor: '#edf0f4',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    color: '#3d4650',
    fontSize: 15,
    paddingVertical: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sectionTitle: {
    color: '#141414',
    fontSize: 18,
    fontWeight: '600',
  },
  sortGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sortButton: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: '#dbe7ee',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sortButtonActive: {
    backgroundColor: '#bcdcea',
  },
  sortWide: {
    width: 48,
  },
  sortWideText: {
    color: '#48697d',
    fontSize: 12,
    fontWeight: '700',
  },
  categoriesRow: {
    paddingRight: 16,
    marginBottom: 18,
  },
  categoryPill: {
    minWidth: 84,
    paddingHorizontal: 16,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ced5dc',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    backgroundColor: '#f5f5f5',
  },
  categoryPillActive: {
    backgroundColor: '#16b7de',
    borderColor: '#16b7de',
  },
  categoryText: {
    color: '#c5c9ce',
    fontSize: 15,
  },
  categoryTextActive: {
    color: '#ffffff',
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 16,
  },
  emptyState: {
    paddingVertical: 28,
    alignItems: 'center',
  },
  emptyTitle: {
    color: '#1f2b34',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  emptyText: {
    color: '#72808c',
    fontSize: 14,
    textAlign: 'center',
    maxWidth: 240,
    lineHeight: 20,
  },
  card: {
    width: '47%',
    backgroundColor: '#d7e4ec',
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingTop: 16,
    paddingBottom: 14,
    minHeight: 168,
  },
  artworkWrap: {
    height: 92,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    color: '#121212',
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 17,
  },
  cardPrice: {
    color: '#121212',
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 18,
  },
});
