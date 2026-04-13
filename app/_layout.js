import { useEffect } from 'react';
import { Platform } from 'react-native';
import { Stack } from 'expo-router';
import * as NavigationBar from 'expo-navigation-bar';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '../context/auth-context';
import { CartProvider } from '../context/cart-context';
import { FavoritesProvider } from '../context/favorites-context';
import { InventoryProvider } from '../context/inventory-context';

export default function RootLayout() {
  useEffect(() => {
    if (Platform.OS !== 'android') {
      return;
    }

    NavigationBar.setPositionAsync('absolute');
    NavigationBar.setBackgroundColorAsync('#00000000');
    NavigationBar.setButtonStyleAsync('light');
    NavigationBar.setBehaviorAsync('overlay-swipe');
    NavigationBar.setVisibilityAsync('hidden');
  }, []);

  return (
    <AuthProvider>
      <InventoryProvider>
        <FavoritesProvider>
          <CartProvider>
            <>
              <StatusBar hidden />
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="home" />
                <Stack.Screen name="login" />
                <Stack.Screen name="cadastro" />
                <Stack.Screen name="dashboard" />
                <Stack.Screen name="produto" />
                <Stack.Screen name="carrinho" />
                <Stack.Screen name="endereco" />
                <Stack.Screen name="perfil" />
                <Stack.Screen name="favoritos" />
                <Stack.Screen name="admin" />
              </Stack>
            </>
          </CartProvider>
        </FavoritesProvider>
      </InventoryProvider>
    </AuthProvider>
  );
}
