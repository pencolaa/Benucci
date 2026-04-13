import { createContext, useContext, useMemo, useState } from 'react';
import {
  formatPriceValue,
  initialProducts,
  normalizeListInput,
  slugifyProductName,
} from '../constants/products';

const InventoryContext = createContext(null);

function sanitizeProduct(payload, currentId) {
  const stockValue = Number(payload.stock);
  const name = String(payload.name).trim();

  return {
    id: currentId || slugifyProductName(name) || `item-${Date.now()}`,
    name,
    price: formatPriceValue(payload.price),
    accent: String(payload.accent).trim() || '#2f82c5',
    shape: String(payload.shape).trim() || 'circle',
    category: String(payload.category).trim() || 'Imagem',
    description: String(payload.description).trim(),
    sizes: Array.isArray(payload.sizes)
      ? payload.sizes.filter(Boolean)
      : normalizeListInput(String(payload.sizes)),
    colors: Array.isArray(payload.colors)
      ? payload.colors.filter(Boolean)
      : normalizeListInput(String(payload.colors)),
    stock: Number.isFinite(stockValue) ? Math.max(0, stockValue) : 0,
  };
}

export function InventoryProvider({ children }) {
  const [products, setProducts] = useState(initialProducts);

  const addProduct = (payload) => {
    const product = sanitizeProduct(payload);

    setProducts((current) => {
      const nextId = current.some((item) => item.id === product.id)
        ? `${product.id}-${current.length + 1}`
        : product.id;

      return [...current, { ...product, id: nextId }];
    });
  };

  const updateProduct = (productId, payload) => {
    setProducts((current) =>
      current.map((item) =>
        item.id === productId ? sanitizeProduct(payload, productId) : item
      )
    );
  };

  const removeProduct = (productId) => {
    setProducts((current) => current.filter((item) => item.id !== productId));
  };

  const getProductById = (productId) =>
    products.find((product) => product.id === productId) ?? products[0] ?? null;

  const value = useMemo(
    () => ({
      products,
      addProduct,
      updateProduct,
      removeProduct,
      getProductById,
    }),
    [products]
  );

  return <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>;
}

export function useInventory() {
  const value = useContext(InventoryContext);

  if (!value) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }

  return value;
}
