import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './auth-context';
import { api } from '../lib/api';

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const { id: userId, isAuthenticated } = useAuth();
  const [favoriteIds, setFavoriteIds] = useState([]);

  useEffect(() => {
    let active = true;

    if (!isAuthenticated || !userId) {
      setFavoriteIds([]);
      return undefined;
    }

    api
      .getFavorites(userId)
      .then((data) => {
        if (active) {
          setFavoriteIds(data.favoriteIds);
        }
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, [isAuthenticated, userId]);

  const toggleFavorite = async (productId) => {
    if (!userId) {
      return;
    }

    const nextIds = favoriteIds.includes(productId)
      ? favoriteIds.filter((id) => id !== productId)
      : [...favoriteIds, productId];

    setFavoriteIds(nextIds);

    try {
      const data = await api.toggleFavorite(userId, productId);
      setFavoriteIds(data.favoriteIds);
    } catch (_) {}
  };

  const removeFavorite = async (productId) => {
    if (!userId) {
      return;
    }

    setFavoriteIds((current) => current.filter((id) => id !== productId));

    try {
      const data = await api.removeFavorite(userId, productId);
      setFavoriteIds(data.favoriteIds);
    } catch (_) {}
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
