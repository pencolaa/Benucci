import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useInventory } from './inventory-context';

const FavoritesContext = createContext(null);

const initialFavorites = ['mandala', 'gato', 'porta-chaves', 'chaveiro'];

export function FavoritesProvider({ children }) {
  const [favoriteIds, setFavoriteIds] = useState(initialFavorites);
  const { products } = useInventory();

  useEffect(() => {
    setFavoriteIds((current) =>
      current.filter((id) => products.some((product) => product.id === id))
    );
  }, [products]);

  const toggleFavorite = (productId) => {
    setFavoriteIds((current) =>
      current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId]
    );
  };

  const removeFavorite = (productId) => {
    setFavoriteIds((current) => current.filter((id) => id !== productId));
  };

  const value = useMemo(
    () => ({
      favoriteIds,
      toggleFavorite,
      removeFavorite,
      isFavorite: (productId) => favoriteIds.includes(productId),
    }),
    [favoriteIds]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const value = useContext(FavoritesContext);

  if (!value) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }

  return value;
}
