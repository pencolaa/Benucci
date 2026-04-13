import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

export default function AppBottomNav({ active = 'home' }) {
  const router = useRouter();

  return (
    <View style={styles.bottomBar}>
      <Pressable
        style={[styles.navButton, active === 'home' && styles.activeButton]}
        hitSlop={8}
        onPress={() => router.push('/dashboard')}>
        <Feather name="home" size={20} color={active === 'home' ? '#74bed3' : '#53bfd6'} />
      </Pressable>
      <Pressable
        style={[styles.navButton, active === 'favorites' && styles.activeButton]}
        hitSlop={8}
        onPress={() => router.push('/favoritos')}>
        <Feather
          name="heart"
          size={20}
          color={active === 'favorites' ? '#74bed3' : '#53bfd6'}
        />
      </Pressable>
      <Pressable
        style={[styles.navButton, active === 'cart' && styles.activeButton]}
        hitSlop={8}
        onPress={() => router.push('/carrinho')}>
        <Feather
          name="shopping-cart"
          size={20}
          color={active === 'cart' ? '#74bed3' : '#53bfd6'}
        />
      </Pressable>
      <Pressable
        style={[styles.navButton, active === 'profile' && styles.activeButton]}
        hitSlop={8}
        onPress={() => router.push('/perfil')}>
        <Feather name="user" size={20} color={active === 'profile' ? '#74bed3' : '#53bfd6'} />
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
  activeButton: {
    backgroundColor: '#d9dce1',
  },
});
