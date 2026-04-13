import { useMemo, useRef, useState } from 'react';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { adminCredentials } from '../../constants/products';
import { useAuth } from '../../context/auth-context';
import { useInventory } from '../../context/inventory-context';

const emptyForm = {
  name: '',
  price: '',
  stock: '',
  sizes: '',
  colors: '',
  category: 'Imagem',
  shape: 'circle',
  accent: '#2f82c5',
  description: '',
};

const shapes = ['circle', 'arch', 'drop', 'cat'];
const categories = ['Mandala', 'Chaveiro', 'Imagem', 'Decoracao'];

function InputField({ label, value, onChangeText, placeholder, multiline = false, keyboardType }) {
  return (
    <View style={styles.fieldBlock}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#87a1aa"
        keyboardType={keyboardType}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
        style={[styles.input, multiline && styles.inputMultiline]}
      />
    </View>
  );
}

function OptionChip({ label, active, onPress }) {
  return (
    <Pressable style={[styles.optionChip, active && styles.optionChipActive]} onPress={onPress}>
      <Text style={[styles.optionChipText, active && styles.optionChipTextActive]}>{label}</Text>
    </Pressable>
  );
}

export default function AdminScreen() {
  const router = useRouter();
  const { products, addProduct, updateProduct, removeProduct } = useInventory();
  const { logout, email } = useAuth();
  const scrollRef = useRef(null);
  const [formSectionY, setFormSectionY] = useState(0);
  const [selectedId, setSelectedId] = useState('');
  const [form, setForm] = useState(emptyForm);

  const selectedProduct = useMemo(
    () => products.find((product) => product.id === selectedId) ?? null,
    [products, selectedId]
  );

  const resetForm = () => {
    setSelectedId('');
    setForm(emptyForm);
  };

  const loadProduct = (product) => {
    setSelectedId(product.id);
    setForm({
      name: product.name,
      price: String(product.price).replace('R$', '').trim().replace(',', '.'),
      stock: String(product.stock),
      sizes: product.sizes.join(', '),
      colors: product.colors.join(', '),
      category: product.category,
      shape: product.shape,
      accent: product.accent,
      description: product.description,
    });

    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({
        y: Math.max(formSectionY - 16, 0),
        animated: true,
      });
    });
  };

  const handleSubmit = () => {
    if (!form.name.trim() || !form.price.trim()) {
      Alert.alert('Campos obrigatorios', 'Preencha pelo menos nome e valor do item.');
      return;
    }

    if (selectedProduct) {
      updateProduct(selectedProduct.id, form);
      Alert.alert('Produto atualizado', 'As informacoes do item foram atualizadas.');
    } else {
      addProduct(form);
      Alert.alert('Produto adicionado', 'O novo item entrou no estoque.');
    }

    resetForm();
  };

  const handleRemove = (productId) => {
    Alert.alert('Remover item', 'Deseja remover este item do estoque?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover',
        style: 'destructive',
        onPress: () => {
          removeProduct(productId);

          if (selectedId === productId) {
            resetForm();
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.shell}>
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>Area protegida</Text>
            <Text style={styles.title}>Painel administrativo</Text>
            <Text style={styles.subtitle}>Controle total do estoque, preco, tamanhos e cores.</Text>
          </View>

          <Pressable style={styles.logoutButton} onPress={() => {
            logout();
            router.replace('/login');
          }}>
            <Feather name="log-out" size={16} color="#073847" />
          </Pressable>
        </View>

        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Acesso atual</Text>
            <Text style={styles.infoText}>Logado como: {email || adminCredentials.email}</Text>
            <Text style={styles.infoText}>Somente credenciais de admin entram nesta pasta.</Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{products.length}</Text>
              <Text style={styles.statLabel}>Itens cadastrados</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>
                {products.reduce((total, product) => total + product.stock, 0)}
              </Text>
              <Text style={styles.statLabel}>Unidades em estoque</Text>
            </View>
          </View>

          <View
            style={styles.section}
            onLayout={(event) => setFormSectionY(event.nativeEvent.layout.y)}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Formulario do item</Text>
              <Pressable onPress={resetForm}>
                <Text style={styles.clearText}>Novo item</Text>
              </Pressable>
            </View>

            <InputField
              label="Nome"
              value={form.name}
              onChangeText={(value) => setForm((current) => ({ ...current, name: value }))}
              placeholder="Ex.: Mandala azul"
            />
            <InputField
              label="Valor"
              value={form.price}
              onChangeText={(value) => setForm((current) => ({ ...current, price: value }))}
              placeholder="Ex.: 49.90"
              keyboardType="decimal-pad"
            />
            <InputField
              label="Quantidade em estoque"
              value={form.stock}
              onChangeText={(value) => setForm((current) => ({ ...current, stock: value }))}
              placeholder="Ex.: 12"
              keyboardType="number-pad"
            />
            <InputField
              label="Tamanhos"
              value={form.sizes}
              onChangeText={(value) => setForm((current) => ({ ...current, sizes: value }))}
              placeholder="Ex.: 15, 20, 25"
            />
            <InputField
              label="Cores"
              value={form.colors}
              onChangeText={(value) => setForm((current) => ({ ...current, colors: value }))}
              placeholder="Ex.: Azul, Branco, Dourado"
            />
            <InputField
              label="Cor principal"
              value={form.accent}
              onChangeText={(value) => setForm((current) => ({ ...current, accent: value }))}
              placeholder="Ex.: #2f82c5"
            />

            <Text style={styles.fieldLabel}>Categoria</Text>
            <View style={styles.optionRow}>
              {categories.map((category) => (
                <OptionChip
                  key={category}
                  label={category}
                  active={form.category === category}
                  onPress={() => setForm((current) => ({ ...current, category }))}
                />
              ))}
            </View>

            <Text style={styles.fieldLabel}>Formato da arte</Text>
            <View style={styles.optionRow}>
              {shapes.map((shape) => (
                <OptionChip
                  key={shape}
                  label={shape}
                  active={form.shape === shape}
                  onPress={() => setForm((current) => ({ ...current, shape }))}
                />
              ))}
            </View>

            <InputField
              label="Descricao"
              value={form.description}
              onChangeText={(value) => setForm((current) => ({ ...current, description: value }))}
              placeholder="Descreva o item para a loja"
              multiline
            />

            <Pressable style={styles.saveButton} onPress={handleSubmit}>
              <Text style={styles.saveButtonText}>
                {selectedProduct ? 'Salvar alteracoes' : 'Adicionar item'}
              </Text>
            </Pressable>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Itens do estoque</Text>

            {products.map((product) => (
              <View key={product.id} style={styles.productCard}>
                <View style={styles.productTopRow}>
                  <View style={styles.productBadge}>
                    <Text style={styles.productBadgeText}>{product.category}</Text>
                  </View>
                  <Text style={styles.stockText}>Estoque: {product.stock}</Text>
                </View>

                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productPrice}>{product.price}</Text>
                <Text style={styles.productMeta}>Tamanhos: {product.sizes.join(', ')}</Text>
                <Text style={styles.productMeta}>Cores: {product.colors.join(', ')}</Text>

                <View style={styles.cardActions}>
                  <Pressable style={styles.editButton} onPress={() => loadProduct(product)}>
                    <Text style={styles.editButtonText}>Editar</Text>
                  </Pressable>
                  <Pressable
                    style={styles.deleteButton}
                    onPress={() => handleRemove(product.id)}>
                    <Text style={styles.deleteButtonText}>Remover</Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#172126',
  },
  shell: {
    flex: 1,
    paddingHorizontal: 14,
    paddingTop: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  eyebrow: {
    color: '#7bd0e0',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  title: {
    color: '#f7fbfd',
    fontSize: 26,
    fontWeight: '700',
  },
  subtitle: {
    color: '#a8bcc4',
    fontSize: 13,
    maxWidth: 260,
    marginTop: 4,
  },
  logoutButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#7bd0e0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingBottom: 26,
    gap: 14,
  },
  infoCard: {
    backgroundColor: '#22323a',
    borderRadius: 18,
    padding: 16,
  },
  infoTitle: {
    color: '#f5fafc',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  infoText: {
    color: '#a8bcc4',
    fontSize: 13,
    lineHeight: 18,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#eff8fa',
    borderRadius: 18,
    padding: 16,
  },
  statValue: {
    color: '#17323b',
    fontSize: 26,
    fontWeight: '700',
  },
  statLabel: {
    color: '#5f7680',
    fontSize: 12,
    marginTop: 4,
  },
  section: {
    backgroundColor: '#eff3f4',
    borderRadius: 24,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  sectionTitle: {
    color: '#17323b',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  clearText: {
    color: '#25829a',
    fontSize: 13,
    fontWeight: '600',
  },
  fieldBlock: {
    marginBottom: 12,
  },
  fieldLabel: {
    color: '#32505b',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
  },
  input: {
    minHeight: 46,
    borderRadius: 14,
    backgroundColor: '#ffffff',
    paddingHorizontal: 14,
    color: '#17323b',
    fontSize: 14,
  },
  inputMultiline: {
    minHeight: 100,
    paddingTop: 12,
  },
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  optionChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#dbe6ea',
  },
  optionChipActive: {
    backgroundColor: '#17323b',
  },
  optionChipText: {
    color: '#32505b',
    fontSize: 12,
    fontWeight: '600',
  },
  optionChipTextActive: {
    color: '#ffffff',
  },
  saveButton: {
    marginTop: 6,
    height: 50,
    borderRadius: 16,
    backgroundColor: '#1192b1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  productCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
  },
  productTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  productBadge: {
    backgroundColor: '#dff2f6',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  productBadgeText: {
    color: '#0f7187',
    fontSize: 11,
    fontWeight: '700',
  },
  stockText: {
    color: '#70868f',
    fontSize: 12,
    fontWeight: '600',
  },
  productName: {
    color: '#17323b',
    fontSize: 17,
    fontWeight: '700',
  },
  productPrice: {
    color: '#1192b1',
    fontSize: 15,
    fontWeight: '700',
    marginTop: 4,
    marginBottom: 6,
  },
  productMeta: {
    color: '#62757d',
    fontSize: 12,
    lineHeight: 18,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  editButton: {
    flex: 1,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#17323b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  deleteButton: {
    flex: 1,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#f4d7dc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    color: '#8c3342',
    fontSize: 14,
    fontWeight: '700',
  },
});
