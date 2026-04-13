import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import AppBottomNav from '../components/app-bottom-nav';
import { useAuth } from '../context/auth-context';
import { usePreferences } from '../context/preferences-context';

const baseMenuItems = [
  { icon: 'settings', label: 'Configuracoes', route: '/configuracoes' },
  { icon: 'bell', label: 'Notificacoes', route: '/notificacoes' },
  { icon: 'clock', label: 'Historico', route: '/historico' },
  { icon: 'lock', label: 'Politica e Privacidade', route: '/privacidade' },
  { icon: 'info', label: 'Termos e Condicoes', route: '/termos' },
];

function MenuRow({ icon, label, onPress }) {
  const { theme } = usePreferences();
  const styles = createStyles(theme);

  return (
    <Pressable style={styles.menuRow} onPress={onPress}>
      <View style={styles.menuLeft}>
        <View style={styles.menuIconWrap}>
          <Feather name={icon} size={16} color={theme.accent} />
        </View>
        <Text style={styles.menuLabel}>{label}</Text>
      </View>

      <Feather name="chevron-right" size={20} color={theme.accent} />
    </Pressable>
  );
}

export default function PerfilScreen() {
  const router = useRouter();
  const { userName, email, isAdmin, logout } = useAuth();
  const { theme } = usePreferences();
  const styles = createStyles(theme);
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
            <Feather name="user" size={36} color={theme.white} />
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
                  if (item.route) {
                    router.push(item.route);
                    return;
                  }

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

const createStyles = (theme) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.outerBackground,
      paddingHorizontal: 4,
      paddingTop: 8,
    },
    panel: {
      flex: 1,
      backgroundColor: theme.panelBackground,
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
      color: theme.textPrimary,
      marginBottom: 10,
    },
    avatar: {
      width: 82,
      height: 82,
      borderRadius: 41,
      backgroundColor: theme.accentStrong,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 10,
    },
    name: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.textPrimary,
    },
    email: {
      fontSize: 10,
      color: theme.textSecondary,
      marginTop: 2,
    },
    content: {
      flex: 1,
      backgroundColor: theme.panelAltBackground,
      paddingHorizontal: 18,
      paddingTop: 28,
      paddingBottom: 110,
    },
    sectionTitle: {
      fontSize: 26,
      fontWeight: '400',
      color: theme.textPrimary,
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
      backgroundColor: theme.accentSoft,
      alignItems: 'center',
      justifyContent: 'center',
    },
    menuLabel: {
      fontSize: 14,
      color: theme.textPrimary,
      flexShrink: 1,
    },
  });
