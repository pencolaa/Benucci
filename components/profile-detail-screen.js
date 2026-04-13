import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { usePreferences } from '../context/preferences-context';
import AppBottomNav from './app-bottom-nav';

export default function ProfileDetailScreen({
  headerLabel,
  title,
  subtitle,
  children,
  footer,
}) {
  const router = useRouter();
  const { theme } = usePreferences();
  const styles = createStyles(theme);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.shell}>
        <Text style={styles.headerLabel}>{headerLabel}</Text>

        <View style={styles.panel}>
          <View style={styles.topBar}>
            <Pressable style={styles.backButton} onPress={() => router.back()}>
              <Feather name="chevron-left" size={20} color={theme.accent} />
            </Pressable>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.placeholder} />
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
            {children}
            {footer}
          </ScrollView>

          <AppBottomNav active="profile" />
        </View>
      </View>
    </SafeAreaView>
  );
}

export function SectionCard({ icon, title, description, rightContent, children }) {
  const { theme } = usePreferences();
  const styles = createStyles(theme);

  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleWrap}>
          {icon ? (
            <View style={styles.sectionIconWrap}>
              <Feather name={icon} size={16} color={theme.accent} />
            </View>
          ) : null}
          <View style={styles.sectionTextWrap}>
            <Text style={styles.sectionTitle}>{title}</Text>
            {description ? <Text style={styles.sectionDescription}>{description}</Text> : null}
          </View>
        </View>
        {rightContent}
      </View>

      {children}
    </View>
  );
}

export function BulletRow({ text }) {
  const { theme } = usePreferences();
  const styles = createStyles(theme);

  return (
    <View style={styles.bulletRow}>
      <View style={styles.bulletDot} />
      <Text style={styles.bulletText}>{text}</Text>
    </View>
  );
}

const createStyles = (theme) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.outerBackground,
    },
    shell: {
      flex: 1,
      paddingTop: 8,
    },
    headerLabel: {
      color: theme.textMuted,
      fontSize: 18,
      marginLeft: 14,
      marginBottom: 6,
    },
    panel: {
      flex: 1,
      marginHorizontal: 10,
      backgroundColor: theme.panelAltBackground,
      borderTopLeftRadius: 34,
      borderTopRightRadius: 34,
      borderBottomLeftRadius: 34,
      borderBottomRightRadius: 34,
      overflow: 'hidden',
    },
    topBar: {
      backgroundColor: theme.panelBackground,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingTop: 14,
      paddingBottom: 14,
    },
    backButton: {
      width: 28,
      height: 28,
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.textPrimary,
    },
    placeholder: {
      width: 28,
    },
    content: {
      paddingHorizontal: 14,
      paddingTop: 16,
      paddingBottom: 120,
      gap: 14,
    },
    subtitle: {
      color: theme.textSecondary,
      fontSize: 13,
      lineHeight: 18,
    },
    sectionCard: {
      backgroundColor: theme.surface,
      borderRadius: 18,
      paddingHorizontal: 14,
      paddingVertical: 14,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 10,
    },
    sectionTitleWrap: {
      flexDirection: 'row',
      flex: 1,
      gap: 10,
    },
    sectionIconWrap: {
      width: 30,
      height: 30,
      borderRadius: 10,
      backgroundColor: theme.accentSoft,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 2,
    },
    sectionTextWrap: {
      flex: 1,
    },
    sectionTitle: {
      color: theme.textPrimary,
      fontSize: 14,
      fontWeight: '700',
    },
    sectionDescription: {
      color: theme.textSecondary,
      fontSize: 12,
      lineHeight: 17,
      marginTop: 4,
    },
    bulletRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 8,
      marginTop: 10,
    },
    bulletDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: theme.accent,
      marginTop: 6,
    },
    bulletText: {
      flex: 1,
      color: theme.textSecondary,
      fontSize: 12,
      lineHeight: 18,
    },
  });
