import { useRouter } from 'expo-router';
import { Image, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

function WaveCluster({ position }) {
  const isTop = position === 'top';

  return (
    <View style={[styles.waveWrap, isTop ? styles.waveTopWrap : styles.waveBottomWrap]}>
      <View style={[styles.waveBase, isTop ? styles.waveTopBase : styles.waveBottomBase]} />
      <View style={[styles.waveLayerA, isTop ? styles.waveTopA : styles.waveBottomA]} />
      <View style={[styles.waveLayerB, isTop ? styles.waveTopB : styles.waveBottomB]} />
      <View style={[styles.waveLayerC, isTop ? styles.waveTopC : styles.waveBottomC]} />
      <View
        style={[styles.waveHighlight, isTop ? styles.waveTopHighlight : styles.waveBottomHighlight]}
      />
    </View>
  );
}

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.card}>
        <WaveCluster position="top" />
        <WaveCluster position="bottom" />

        <View style={styles.content}>
          <Text style={styles.title}>Decore sua área de conforto!!</Text>

          <Image
            source={require('../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />

          <Pressable style={styles.button} onPress={() => router.push('/login')}>
            <Text style={styles.buttonText}>Começar</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1f1f1f',
  },
  card: {
    flex: 1,
    backgroundColor: '#efefef',
    borderRadius: 42,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  title: {
    fontSize: 24,
    fontWeight: '400',
    color: '#101010',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 38,
  },
  logo: {
    width: 170,
    height: 170,
    marginBottom: 84,
  },
  button: {
    width: '100%',
    maxWidth: 345,
    backgroundColor: '#1bb8df',
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: '#222222',
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '700',
  },
  waveWrap: {
    position: 'absolute',
    left: -24,
    right: -24,
    height: 250,
  },
  waveTopWrap: {
    top: -6,
  },
  waveBottomWrap: {
    bottom: -6,
  },
  waveBase: {
    position: 'absolute',
    backgroundColor: '#18b7df',
    opacity: 0.98,
  },
  waveLayerA: {
    position: 'absolute',
    backgroundColor: '#0b8ddd',
    opacity: 0.9,
  },
  waveLayerB: {
    position: 'absolute',
    backgroundColor: '#2fd4f4',
    opacity: 0.9,
  },
  waveLayerC: {
    position: 'absolute',
    backgroundColor: '#166de0',
    opacity: 0.94,
  },
  waveHighlight: {
    position: 'absolute',
    backgroundColor: '#ffffff',
  },
  waveTopBase: {
    top: -70,
    left: -10,
    width: 470,
    height: 210,
    borderBottomLeftRadius: 220,
    borderBottomRightRadius: 220,
    transform: [{ rotate: '-8deg' }],
  },
  waveTopA: {
    top: 8,
    left: 120,
    width: 330,
    height: 110,
    borderBottomLeftRadius: 180,
    borderBottomRightRadius: 80,
    transform: [{ rotate: '-10deg' }],
  },
  waveTopB: {
    top: 38,
    left: -20,
    width: 310,
    height: 95,
    borderBottomLeftRadius: 150,
    borderBottomRightRadius: 190,
    transform: [{ rotate: '-12deg' }],
  },
  waveTopC: {
    top: 26,
    left: 205,
    width: 250,
    height: 90,
    borderBottomLeftRadius: 160,
    borderBottomRightRadius: 120,
    transform: [{ rotate: '-9deg' }],
  },
  waveTopHighlight: {
    top: 34,
    left: 236,
    width: 180,
    height: 54,
    borderBottomLeftRadius: 120,
    borderBottomRightRadius: 100,
    transform: [{ rotate: '-8deg' }],
  },
  waveBottomBase: {
    bottom: -62,
    left: -30,
    width: 480,
    height: 180,
    borderTopLeftRadius: 230,
    borderTopRightRadius: 230,
    transform: [{ rotate: '7deg' }],
  },
  waveBottomA: {
    bottom: 18,
    left: 166,
    width: 292,
    height: 92,
    borderTopLeftRadius: 180,
    borderTopRightRadius: 130,
    transform: [{ rotate: '9deg' }],
  },
  waveBottomB: {
    bottom: -4,
    left: -28,
    width: 250,
    height: 78,
    borderTopLeftRadius: 130,
    borderTopRightRadius: 170,
    transform: [{ rotate: '8deg' }],
  },
  waveBottomC: {
    bottom: 8,
    left: 132,
    width: 352,
    height: 72,
    borderTopLeftRadius: 200,
    borderTopRightRadius: 160,
    transform: [{ rotate: '9deg' }],
  },
  waveBottomHighlight: {
    bottom: 46,
    left: -18,
    width: 162,
    height: 28,
    borderTopLeftRadius: 100,
    borderTopRightRadius: 100,
    transform: [{ rotate: '8deg' }],
  },
});
