import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';
import { usePreferences } from '../context/preferences-context';

export default function AppBottomNav({ active = 'home' }) {
  const router = useRouter();
  const { theme } = usePreferences();
  const iconColor = theme.accent;
  const activeColor = theme.accent;

  return (
    <View style={[styles.bottomBar, { backgroundColor: theme.navBackground }]}>
      <Pressable
        style={[styles.navButton, active === 'home' && { backgroundColor: theme.navActive }]}
        hitSlop={8}
        onPress={() => router.push('/dashboard')}>
        <Feather name="home" size={20} color={active === 'home' ? activeColor : iconColor} />
      </Pressable>
      <Pressable
        style={[styles.navButton, active === 'favorites' && { backgroundColor: theme.navActive }]}
        hitSlop={8}
        onPress={() => router.push('/favoritos')}>
        <Feather name="heart" size={20} color={active === 'favorites' ? activeColor : iconColor} />
      </Pressable>
      <Pressable
        style={[styles.navButton, active === 'cart' && { backgroundColor: theme.navActive }]}
        hitSlop={8}
        onPress={() => router.push('/carrinho')}>
        <Feather
          name="shopping-cart"
          size={20}
          color={active === 'cart' ? activeColor : iconColor}
        />
      </Pressable>
      <Pressable
        style={[styles.navButton, active === 'profile' && { backgroundColor: theme.navActive }]}
        hitSlop={8}
        onPress={() => router.push('/perfil')}>
        <Feather name="user" size={20} color={active === 'profile' ? activeColor : iconColor} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomBar: {
    position: 'absolute',
    left: 14,
    right: 14,
    bottom: 16,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#f7f7f7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    shadowColor: '#000000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  navButton: {
    width: 48,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
