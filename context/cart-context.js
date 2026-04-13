import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useInventory } from './inventory-context';

const CartContext = createContext(null);

function parsePrice(price) {
  return Number(String(price).replace('R$', '').replace(',', '.'));
}

const initialCartItems = [
  {
    productId: 'mandala',
    quantity: 1,
    selected: true,
  },
  {
    productId: 'chaveiro',
    quantity: 1,
    selected: true,
  },
  {
    productId: 'porta-chaves',
    quantity: 1,
    selected: false,
  },
];

export function CartProvider({ children }) {
  const [items, setItems] = useState(initialCartItems);
  const { getProductById, products } = useInventory();

  useEffect(() => {
    setItems((current) =>
      current.filter((item) => products.some((product) => product.id === item.productId))
    );
  }, [products]);

  const addItem = (productId, quantity = 1) => {
    setItems((current) => {
      const existing = current.find((item) => item.productId === productId);

      if (existing) {
        return current.map((item) =>
          item.productId === productId
            ? {
                ...item,
                quantity: item.quantity + quantity,
                selected: true,
              }
            : item
        );
      }

      return [...current, { productId, quantity, selected: true }];
    });
  };

  const toggleSelected = (productId) => {
    setItems((current) =>
      current.map((item) =>
        item.productId === productId ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const updateQuantity = (productId, nextQuantity) => {
    setItems((current) =>
      current
        .map((item) =>
          item.productId === productId
            ? { ...item, quantity: Math.max(0, nextQuantity) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const value = useMemo(() => {
    const selectedItems = items.filter((item) => item.selected);
    const selectedCount = selectedItems.reduce((total, item) => total + item.quantity, 0);
    const totalPrice = selectedItems.reduce((total, item) => {
      const product = getProductById(item.productId);
      return total + parsePrice(product.price) * item.quantity;
    }, 0);

    return {
      items,
      addItem,
      toggleSelected,
      updateQuantity,
      selectedCount,
      totalPrice,
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const value = useContext(CartContext);

  if (!value) {
    throw new Error('useCart must be used within a CartProvider');
  }

  return value;
}
