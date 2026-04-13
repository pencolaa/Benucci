import { useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
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

export default function CadastroScreen() {
  const router = useRouter();
  const { register } = useAuth();
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [form, setForm] = useState({
    userName: 'Erinaldo',
    email: 'erinadpereira934@gmail.com',
    password: '123456789',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleRegister() {
    if (!acceptedTerms) {
      setError('Aceite os termos de servico para continuar.');
      return;
    }

    setIsSubmitting(true);
    const result = await register(form);
    setIsSubmitting(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    setError('');
    router.replace('/dashboard');
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.card}>
        <WaveCluster position="top" />
        <WaveCluster position="bottom" />

        <Text style={styles.title}>Cadastro</Text>

        <View style={styles.content}>
          <Image
            source={require('../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />

          <View style={styles.inputWrap}>
            <TextInput
              placeholder="Nome"
              placeholderTextColor="#73777f"
              value={form.userName}
              onChangeText={(value) => setForm((current) => ({ ...current, userName: value }))}
              style={styles.input}
            />
            <Feather name={form.userName.trim() ? 'check' : 'eye-off'} size={18} color={form.userName.trim() ? '#54b97b' : '#343434'} />
          </View>
          <View style={styles.inputWrap}>
            <TextInput
              placeholder="Email"
              placeholderTextColor="#73777f"
              value={form.email}
              onChangeText={(value) => setForm((current) => ({ ...current, email: value }))}
              style={styles.input}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <Feather name={form.email.includes('@') ? 'check' : 'eye-off'} size={18} color={form.email.includes('@') ? '#54b97b' : '#343434'} />
          </View>
          <View style={styles.inputWrap}>
            <TextInput
              placeholder="Senha"
              placeholderTextColor="#73777f"
              value={form.password}
              onChangeText={(value) => setForm((current) => ({ ...current, password: value }))}
              secureTextEntry
              style={styles.input}
            />
            <Feather name={form.password.length >= 4 ? 'check' : 'eye-off'} size={18} color={form.password.length >= 4 ? '#54b97b' : '#343434'} />
          </View>

          <View style={styles.termsRow}>
            <Text style={styles.termsText}>
              Estou de acordo com o <Text style={styles.termsLink}>Termos de Servico</Text>
            </Text>

            <Pressable onPress={() => setAcceptedTerms((current) => !current)} style={styles.checkbox}>
              <Feather
                name={acceptedTerms ? 'check-square' : 'square'}
                size={20}
                color="#7a7a7a"
              />
            </Pressable>
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <Pressable style={styles.button} onPress={handleRegister} disabled={isSubmitting}>
            <Text style={styles.buttonText}>{isSubmitting ? 'Cadastrando...' : 'Cadastrar'}</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#232323',
  },
  card: {
    flex: 1,
    backgroundColor: '#efefef',
    borderRadius: 32,
    overflow: 'hidden',
  },
  title: {
    position: 'absolute',
    top: 14,
    left: 14,
    zIndex: 5,
    color: '#454545',
    fontSize: 18,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 115,
    paddingBottom: 78,
  },
  logo: {
    width: 104,
    height: 104,
    alignSelf: 'center',
    marginBottom: 28,
  },
  inputWrap: {
    minHeight: 54,
    backgroundColor: '#e6e6ea',
    borderRadius: 12,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  input: {
    flex: 1,
    color: '#222222',
    fontSize: 16,
    paddingVertical: 14,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    color: '#272727',
  },
  termsLink: {
    color: '#2d93df',
  },
  checkbox: {
    marginLeft: 8,
  },
  button: {
    height: 48,
    backgroundColor: '#17b8de',
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: '#222222',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  buttonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '700',
  },
  errorText: {
    color: '#c13e54',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 10,
  },
  waveWrap: {
    position: 'absolute',
    left: -24,
    right: -24,
    height: 190,
  },
  waveTopWrap: {
    top: -8,
  },
  waveBottomWrap: {
    bottom: -12,
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
    top: -74,
    left: -16,
    width: 360,
    height: 154,
    borderBottomLeftRadius: 220,
    borderBottomRightRadius: 180,
    transform: [{ rotate: '-8deg' }],
  },
  waveTopA: {
    top: 16,
    left: 112,
    width: 214,
    height: 72,
    borderBottomLeftRadius: 140,
    borderBottomRightRadius: 80,
    transform: [{ rotate: '-11deg' }],
  },
  waveTopB: {
    top: 34,
    left: -8,
    width: 228,
    height: 66,
    borderBottomLeftRadius: 140,
    borderBottomRightRadius: 160,
    transform: [{ rotate: '-12deg' }],
  },
  waveTopC: {
    top: 16,
    left: 176,
    width: 170,
    height: 52,
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 80,
    transform: [{ rotate: '-9deg' }],
  },
  waveTopHighlight: {
    top: 26,
    left: 222,
    width: 124,
    height: 30,
    borderBottomLeftRadius: 90,
    borderBottomRightRadius: 90,
    transform: [{ rotate: '-8deg' }],
  },
  waveBottomBase: {
    bottom: -56,
    left: -18,
    width: 376,
    height: 148,
    borderTopLeftRadius: 220,
    borderTopRightRadius: 220,
    transform: [{ rotate: '8deg' }],
  },
  waveBottomA: {
    bottom: 16,
    left: 126,
    width: 242,
    height: 70,
    borderTopLeftRadius: 150,
    borderTopRightRadius: 120,
    transform: [{ rotate: '10deg' }],
  },
  waveBottomB: {
    bottom: 2,
    left: -26,
    width: 144,
    height: 48,
    borderTopLeftRadius: 90,
    borderTopRightRadius: 110,
    transform: [{ rotate: '8deg' }],
  },
  waveBottomC: {
    bottom: 14,
    left: 98,
    width: 286,
    height: 54,
    borderTopLeftRadius: 180,
    borderTopRightRadius: 140,
    transform: [{ rotate: '9deg' }],
  },
  waveBottomHighlight: {
    bottom: 42,
    left: 4,
    width: 86,
    height: 18,
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
    transform: [{ rotate: '8deg' }],
  },
});
