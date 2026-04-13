import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Image, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { adminCredentials } from '../constants/products';
import { useAuth } from '../context/auth-context';

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

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    const result = login({ email, password });

    if (!result.ok) {
      setError(result.error);
      return;
    }

    setError('');
    router.replace(result.isAdmin ? '/admin' : '/dashboard');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.card}>
        <WaveCluster position="top" />
        <WaveCluster position="bottom" />

        <View style={styles.content}>
          <Image
            source={require('../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />

          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email address"
            placeholderTextColor="#a8adb6"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />

          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            placeholderTextColor="#a8adb6"
            secureTextEntry
            style={styles.input}
          />

          <View style={styles.helperCard}>
            <Text style={styles.helperTitle}>Acesso admin</Text>
            <Text style={styles.helperText}>Email: {adminCredentials.email}</Text>
            <Text style={styles.helperText}>Senha: {adminCredentials.password}</Text>
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <Pressable style={styles.forgotWrap}>
            <Text style={styles.forgotText}>Esqueceu a senha?</Text>
          </Pressable>

          <Pressable style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Logar</Text>
          </Pressable>

          <Text style={styles.signupText}>
            Nao tem uma conta?{' '}
            <Text style={styles.signupLink} onPress={() => router.push('/cadastro')}>
              Cadastrar-se
            </Text>
          </Text>
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
    borderRadius: 32,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 6,
    paddingTop: 90,
    paddingBottom: 90,
  },
  logo: {
    width: 88,
    height: 88,
    alignSelf: 'center',
    marginBottom: 22,
  },
  input: {
    height: 44,
    backgroundColor: '#e7e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 14,
    color: '#1d1d1d',
    fontSize: 13,
  },
  helperCard: {
    backgroundColor: '#e4f6fb',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#c2e5ef',
  },
  helperTitle: {
    color: '#0e7087',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 3,
  },
  helperText: {
    color: '#45616a',
    fontSize: 11,
  },
  errorText: {
    color: '#c13e54',
    fontSize: 11,
    textAlign: 'center',
    marginBottom: 8,
  },
  forgotWrap: {
    alignItems: 'center',
    marginTop: -2,
    marginBottom: 12,
  },
  forgotText: {
    color: '#676767',
    fontSize: 11,
  },
  button: {
    height: 42,
    backgroundColor: '#17b8de',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#333333',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
    marginBottom: 12,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#031018',
  },
  signupText: {
    fontSize: 11,
    color: '#1d1d1d',
    textAlign: 'center',
  },
  signupLink: {
    color: '#2586d9',
  },
  waveWrap: {
    position: 'absolute',
    left: -24,
    right: -24,
    height: 170,
  },
  waveTopWrap: {
    top: -8,
  },
  waveBottomWrap: {
    bottom: -8,
  },
  waveBase: {
    position: 'absolute',
    backgroundColor: '#18b7df',
  },
  waveLayerA: {
    position: 'absolute',
    backgroundColor: '#0b8ddd',
  },
  waveLayerB: {
    position: 'absolute',
    backgroundColor: '#33d7f5',
  },
  waveLayerC: {
    position: 'absolute',
    backgroundColor: '#195fda',
  },
  waveHighlight: {
    position: 'absolute',
    backgroundColor: '#ffffff',
  },
  waveTopBase: {
    top: -62,
    left: -12,
    width: 280,
    height: 118,
    borderBottomLeftRadius: 150,
    borderBottomRightRadius: 150,
    transform: [{ rotate: '-8deg' }],
  },
  waveTopA: {
    top: 14,
    left: 96,
    width: 170,
    height: 54,
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 60,
    transform: [{ rotate: '-10deg' }],
  },
  waveTopB: {
    top: 24,
    left: -14,
    width: 180,
    height: 50,
    borderBottomLeftRadius: 110,
    borderBottomRightRadius: 120,
    transform: [{ rotate: '-11deg' }],
  },
  waveTopC: {
    top: 12,
    left: 144,
    width: 150,
    height: 48,
    borderBottomLeftRadius: 90,
    borderBottomRightRadius: 70,
    transform: [{ rotate: '-9deg' }],
  },
  waveTopHighlight: {
    top: 20,
    left: 172,
    width: 116,
    height: 22,
    borderBottomLeftRadius: 80,
    borderBottomRightRadius: 80,
    transform: [{ rotate: '-8deg' }],
  },
  waveBottomBase: {
    bottom: -50,
    left: -26,
    width: 310,
    height: 112,
    borderTopLeftRadius: 150,
    borderTopRightRadius: 150,
    transform: [{ rotate: '8deg' }],
  },
  waveBottomA: {
    bottom: 10,
    left: 94,
    width: 190,
    height: 54,
    borderTopLeftRadius: 110,
    borderTopRightRadius: 90,
    transform: [{ rotate: '9deg' }],
  },
  waveBottomB: {
    bottom: 0,
    left: -24,
    width: 148,
    height: 44,
    borderTopLeftRadius: 90,
    borderTopRightRadius: 100,
    transform: [{ rotate: '8deg' }],
  },
  waveBottomC: {
    bottom: 8,
    left: 110,
    width: 212,
    height: 40,
    borderTopLeftRadius: 120,
    borderTopRightRadius: 110,
    transform: [{ rotate: '9deg' }],
  },
  waveBottomHighlight: {
    bottom: 30,
    left: -18,
    width: 98,
    height: 16,
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
    transform: [{ rotate: '8deg' }],
  },
});
