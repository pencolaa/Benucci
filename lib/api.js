import Constants from 'expo-constants';
import { Platform } from 'react-native';

const LAN_FALLBACK_API_URL = 'http://192.168.15.8:3001';

function getDefaultApiUrl() {
  const explicitUrl = process.env.EXPO_PUBLIC_API_URL;

  if (explicitUrl) {
    return explicitUrl;
  }

  const debuggerHost =
    Constants.expoConfig?.hostUri ||
    Constants.expoGoConfig?.debuggerHost ||
    Constants.manifest2?.extra?.expoGo?.debuggerHost;

  if (debuggerHost) {
    const host = debuggerHost.split(':')[0];
    return `http://${host}:3001`;
  }

  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3001';
  }

  return LAN_FALLBACK_API_URL;
}

export const API_URL = getDefaultApiUrl();

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || 'Nao foi possivel concluir a requisicao.');
  }

  return data;
}

export const api = {
  health: () => request('/health'),
  login: (payload) => request('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  register: (payload) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  updateProfile: (userId, payload) =>
    request(`/users/${userId}`, { method: 'PUT', body: JSON.stringify(payload) }),
  getProducts: () => request('/products'),
  addProduct: (payload) => request('/products', { method: 'POST', body: JSON.stringify(payload) }),
  updateProduct: (productId, payload) =>
    request(`/products/${encodeURIComponent(productId)}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  removeProduct: (productId) =>
    request(`/products/${encodeURIComponent(productId)}`, { method: 'DELETE' }),
  getPreferences: (userId) => request(`/users/${userId}/preferences`),
  updatePreferences: (userId, payload) =>
    request(`/users/${userId}/preferences`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),
  getFavorites: (userId) => request(`/users/${userId}/favorites`),
  toggleFavorite: (userId, productId) =>
    request(`/users/${userId}/favorites`, {
      method: 'POST',
      body: JSON.stringify({ productId }),
    }),
  removeFavorite: (userId, productId) =>
    request(`/users/${userId}/favorites/${encodeURIComponent(productId)}`, { method: 'DELETE' }),
  getCart: (userId) => request(`/users/${userId}/cart`),
  addCartItem: (userId, payload) =>
    request(`/users/${userId}/cart/items`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  updateCartItem: (userId, productId, payload) =>
    request(`/users/${userId}/cart/items/${encodeURIComponent(productId)}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),
  getAddresses: (userId) => request(`/users/${userId}/addresses`),
  addAddress: (userId, payload) =>
    request(`/users/${userId}/addresses`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  updateAddress: (userId, addressId, payload) =>
    request(`/users/${userId}/addresses/${encodeURIComponent(addressId)}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  deleteAddress: (userId, addressId) =>
    request(`/users/${userId}/addresses/${encodeURIComponent(addressId)}`, {
      method: 'DELETE',
    }),
  getOrders: (userId) => request(`/users/${userId}/orders`),
  checkout: (userId, addressId) =>
    request(`/users/${userId}/checkout`, {
      method: 'POST',
      body: JSON.stringify({ addressId }),
    }),
};
