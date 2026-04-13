import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { initialProducts } from '../constants/products';
import { api } from '../lib/api';

const InventoryContext = createContext(null);

export function InventoryProvider({ children }) {
  const [products, setProducts] = useState(initialProducts);

  useEffect(() => {
    let active = true;

    api
      .getProducts()
      .then((data) => {
        if (active) {
          setProducts(data.products);
        }
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  const addProduct = async (payload) => {
    const data = await api.addProduct(payload);
    setProducts((current) => [data.product, ...current]);
  };

  const updateProduct = async (productId, payload) => {
    const data = await api.updateProduct(productId, payload);
    setProducts((current) =>
      current.map((item) => (item.id === productId ? data.product : item))
    );
  };

  const removeProduct = async (productId) => {
    await api.removeProduct(productId);
    setProducts((current) => current.filter((item) => item.id !== productId));
  };

  const setProductsFromCheckout = (nextProducts) => {
    setProducts(nextProducts);
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
      setProductsFromCheckout,
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
