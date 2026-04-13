import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './auth-context';
import { api } from '../lib/api';

const AddressesContext = createContext(null);

export function AddressesProvider({ children }) {
  const { id: userId, isAuthenticated } = useAuth();
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    let active = true;

    if (!isAuthenticated || !userId) {
      setAddresses([]);
      return undefined;
    }

    api
      .getAddresses(userId)
      .then((data) => {
        if (active) {
          setAddresses(data.addresses);
        }
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, [isAuthenticated, userId]);

  const addAddress = async (payload) => {
    if (!userId) {
      return { ok: false, error: 'Faca login para salvar enderecos.' };
    }

    try {
      const data = await api.addAddress(userId, payload);
      setAddresses(data.addresses);
      return { ok: true };
    } catch (error) {
      return { ok: false, error: error.message };
    }
  };

  const updateAddress = async (addressId, payload) => {
    if (!userId) {
      return { ok: false, error: 'Faca login para editar enderecos.' };
    }

    try {
      const data = await api.updateAddress(userId, addressId, payload);
      setAddresses(data.addresses);
      return { ok: true };
    } catch (error) {
      return { ok: false, error: error.message };
    }
  };

  const deleteAddress = async (addressId) => {
    if (!userId) {
      return;
    }

    try {
      const data = await api.deleteAddress(userId, addressId);
      setAddresses(data.addresses);
    } catch (_) {}
  };

  const selectedAddress = useMemo(
    () => addresses.find((item) => item.isSelected) ?? addresses[0] ?? null,
    [addresses]
  );

  const selectAddress = async (addressId) => {
    const current = addresses.find((item) => item.id === addressId);
    if (!current) {
      return;
    }

    await updateAddress(addressId, {
      title: current.title,
      subtitle: current.subtitle,
      icon: current.icon,
      isSelected: true,
    });
  };

  const value = useMemo(
    () => ({
      addresses,
      selectedAddress,
      addAddress,
      updateAddress,
      deleteAddress,
      selectAddress,
    }),
    [addresses, selectedAddress]
  );

  return <AddressesContext.Provider value={value}>{children}</AddressesContext.Provider>;
}

export function useAddresses() {
  const value = useContext(AddressesContext);

  if (!value) {
    throw new Error('useAddresses must be used within an AddressesProvider');
  }

  return value;
}
