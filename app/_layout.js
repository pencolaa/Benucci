import { useEffect } from 'react';
import { Platform } from 'react-native';
import { Stack } from 'expo-router';
import * as NavigationBar from 'expo-navigation-bar';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '../context/auth-context';
import { AddressesProvider } from '../context/addresses-context';
import { CartProvider } from '../context/cart-context';
import { FavoritesProvider } from '../context/favorites-context';
import { InventoryProvider } from '../context/inventory-context';
import { OrdersProvider } from '../context/orders-context';
import { PreferencesProvider, usePreferences } from '../context/preferences-context';

export default function RootLayout() {
  return (
    <AuthProvider>
      <PreferencesProvider>
        <AppProviders />
      </PreferencesProvider>
    </AuthProvider>
  );
}

function AppProviders() {
  const { theme } = usePreferences();

  useEffect(() => {
    if (Platform.OS !== 'android') {
      return;
    }

    NavigationBar.setPositionAsync('absolute');
    NavigationBar.setBackgroundColorAsync('#00000000');
    NavigationBar.setButtonStyleAsync(theme.mode === 'dark' ? 'light' : 'dark');
    NavigationBar.setBehaviorAsync('overlay-swipe');
    NavigationBar.setVisibilityAsync('hidden');
  }, [theme.mode]);

  return (
    <InventoryProvider>
      <FavoritesProvider>
        <AddressesProvider>
          <OrdersProvider>
            <CartProvider>
              <>
                <StatusBar hidden={false} style={theme.mode === 'dark' ? 'light' : 'dark'} />
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
                  <Stack.Screen name="configuracoes" />
                  <Stack.Screen name="notificacoes" />
                  <Stack.Screen name="historico" />
                  <Stack.Screen name="privacidade" />
                  <Stack.Screen name="termos" />
                  <Stack.Screen name="admin" />
                </Stack>
              </>
            </CartProvider>
          </OrdersProvider>
        </AddressesProvider>
      </FavoritesProvider>
    </InventoryProvider>
  );
}
