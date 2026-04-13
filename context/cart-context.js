import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './auth-context';
import { useInventory } from './inventory-context';
import { api } from '../lib/api';

const CartContext = createContext(null);

function parsePrice(price) {
  return Number(String(price).replace('R$', '').replace(',', '.'));
}

export function CartProvider({ children }) {
  const { id: userId, isAuthenticated } = useAuth();
  const { getProductById } = useInventory();
  const [items, setItems] = useState([]);

  useEffect(() => {
    let active = true;

    if (!isAuthenticated || !userId) {
      setItems([]);
      return undefined;
    }

    api
      .getCart(userId)
      .then((data) => {
        if (active) {
          setItems(data.items);
        }
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, [isAuthenticated, userId]);

  const addItem = async (productId, quantity = 1) => {
    if (!userId) {
      return;
    }

    setItems((current) => {
      const existing = current.find((item) => item.productId === productId);

      if (existing) {
        return current.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + quantity, selected: true }
            : item
        );
      }

      return [...current, { productId, quantity, selected: true }];
    });

    try {
      const data = await api.addCartItem(userId, { productId, quantity });
      setItems(data.items);
    } catch (_) {}
  };

  const toggleSelected = async (productId) => {
    const currentItem = items.find((item) => item.productId === productId);

    if (!userId || !currentItem) {
      return;
    }

    const nextSelected = !currentItem.selected;
    setItems((current) =>
      current.map((item) =>
        item.productId === productId ? { ...item, selected: nextSelected } : item
      )
    );

    try {
      const data = await api.updateCartItem(userId, productId, { selected: nextSelected });
      setItems(data.items);
    } catch (_) {}
  };

  const updateQuantity = async (productId, nextQuantity) => {
    if (!userId) {
      return;
    }

    setItems((current) =>
      current
        .map((item) =>
          item.productId === productId
            ? { ...item, quantity: Math.max(0, nextQuantity) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );

    try {
      const data = await api.updateCartItem(userId, productId, { quantity: nextQuantity });
      setItems(data.items);
    } catch (_) {}
  };

  const replaceItems = (nextItems) => {
    setItems(nextItems);
  };

  const value = useMemo(() => {
    const selectedItems = items.filter((item) => item.selected);
    const selectedCount = selectedItems.reduce((total, item) => total + item.quantity, 0);
    const totalPrice = selectedItems.reduce((total, item) => {
      const product = getProductById(item.productId);
      return product ? total + parsePrice(product.price) * item.quantity : total;
    }, 0);

    return {
      items,
      addItem,
      toggleSelected,
      updateQuantity,
      replaceItems,
      selectedCount,
      totalPrice,
    };
  }, [getProductById, items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const value = useContext(CartContext);

  if (!value) {
    throw new Error('useCart must be used within a CartProvider');
  }

  return value;
}
