import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './auth-context';
import { api } from '../lib/api';

const OrdersContext = createContext(null);

export function OrdersProvider({ children }) {
  const { id: userId, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    let active = true;

    if (!isAuthenticated || !userId) {
      setOrders([]);
      return undefined;
    }

    api
      .getOrders(userId)
      .then((data) => {
        if (active) {
          setOrders(data.orders);
        }
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, [isAuthenticated, userId]);

  const replaceOrders = (nextOrders) => {
    setOrders(nextOrders);
  };

  const value = useMemo(
    () => ({
      orders,
      replaceOrders,
    }),
    [orders]
  );

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}

export function useOrders() {
  const value = useContext(OrdersContext);

  if (!value) {
    throw new Error('useOrders must be used within an OrdersProvider');
  }

  return value;
}
