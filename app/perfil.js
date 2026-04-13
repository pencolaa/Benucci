import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import AppBottomNav from '../components/app-bottom-nav';
import { useAuth } from '../context/auth-context';

const baseMenuItems = [
  { icon: 'settings', label: 'Configuracoes' },
  { icon: 'bell', label: 'Notificacoes' },
  { icon: 'clock', label: 'Historico' },
  { icon: 'lock', label: 'Politica e Privacidade' },
  { icon: 'info', label: 'Termos e Condicoes' },
];

function MenuRow({ icon, label, onPress }) {
  return (
    <Pressable style={styles.menuRow} onPress={onPress}>
      <View style={styles.menuLeft}>
        <View style={styles.menuIconWrap}>
          <Feather name={icon} size={16} color="#68bad3" />
        </View>
        <Text style={styles.menuLabel}>{label}</Text>
      </View>

      <Feather name="chevron-right" size={20} color="#39acd0" />
    </Pressable>
  );
}

export default function PerfilScreen() {
  const router = useRouter();
  const { userName, email, isAdmin, logout } = useAuth();
  const menuItems = [
    ...baseMenuItems,
    ...(isAdmin ? [{ icon: 'shield', label: 'Painel admin' }] : []),
    { icon: 'log-out', label: 'Sair' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.panel}>
        <View style={styles.header}>
          <Text style={styles.title}>Meu Perfil</Text>

          <View style={styles.avatar}>
            <Feather name="user" size={36} color="#ffffff" />
          </View>

          <Text style={styles.name}>{userName || 'Cliente'}</Text>
          <Text style={styles.email}>{email || 'usuario@benucci.com'}</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Conta</Text>

          <View style={styles.menuList}>
            {menuItems.map((item) => (
              <MenuRow
                key={item.label}
                icon={item.icon}
                label={item.label}
                onPress={() => {
                  if (item.label === 'Painel admin') {
                    router.push('/admin');
                    return;
                  }

                  if (item.label === 'Sair') {
                    logout();
                    router.replace('/login');
                  }
                }}
              />
            ))}
          </View>
        </View>

        <AppBottomNav active="profile" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#212121',
    paddingHorizontal: 4,
    paddingTop: 8,
  },
  panel: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    overflow: 'hidden',
  },
  header: {
    alignItems: 'center',
    paddingTop: 38,
    paddingBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1c1c1c',
    marginBottom: 10,
  },
  avatar: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: '#147bcc',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#171717',
  },
  email: {
    fontSize: 10,
    color: '#727272',
    marginTop: 2,
  },
  content: {
    flex: 1,
    backgroundColor: '#d2e4ee',
    paddingHorizontal: 18,
    paddingTop: 28,
    paddingBottom: 110,
  },
  sectionTitle: {
    fontSize: 26,
    fontWeight: '400',
    color: '#1b1b1b',
    marginBottom: 18,
  },
  menuList: {
    gap: 16,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  menuIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: '#eef6fa',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: {
    fontSize: 14,
    color: '#1e1e1e',
    flexShrink: 1,
  },
});
