import { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function SplashScreenPage() {
  const router = useRouter();
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fade, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      router.replace('/home');
    }, 3000);

    return () => clearTimeout(timer);
  }, [fade, router]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Animated.View style={[styles.wrapper, { opacity: fade }]}>
        <Image
          source={require('../assets/images/cards1.png')}
          style={styles.topCards}
          resizeMode="contain"
        />

        <Image
          source={require('../assets/images/cards2.png')}
          style={styles.bottomCards}
          resizeMode="contain"
        />

        <View style={styles.brandBlock}>
          <Image
            source={require('../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.brandName}>Benucci Arte</Text>
          <Text style={styles.brandSub}>Artesanato</Text>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#212121',
    padding: 0,
  },
  wrapper: {
    flex: 1,
    backgroundColor: '#efefef',
    borderRadius: 0,
    overflow: 'hidden',
    position: 'relative',
    minHeight: height,
  },
  topCards: {
    position: 'absolute',
    top: 26,
    left: 0,
    width: width,
    height: 250,
  },
  bottomCards: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: width,
    height: 250,
  },
  brandBlock: {
    position: 'absolute',
    top: '39%',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 12,
  },
  brandName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1e1e1e',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  brandSub: {
    fontSize: 16,
    color: '#5c5c5c',
    letterSpacing: 4,
    textTransform: 'uppercase',
    marginTop: 4,
  },
});
