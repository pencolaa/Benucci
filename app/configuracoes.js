import { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import ProfileDetailScreen, {
  BulletRow,
  SectionCard,
} from '../components/profile-detail-screen';
import { useAuth } from '../context/auth-context';
import { usePreferences } from '../context/preferences-context';

function SettingRow({ icon, title, description, value, onValueChange }) {
  const { theme } = usePreferences();
  const styles = createStyles(theme);

  return (
    <View style={styles.settingRow}>
      <View style={styles.settingInfo}>
        <View style={styles.settingIconWrap}>
          <Feather name={icon} size={15} color={theme.accent} />
        </View>
        <View style={styles.settingTextWrap}>
          <Text style={styles.settingTitle}>{title}</Text>
          <Text style={styles.settingDescription}>{description}</Text>
        </View>
      </View>

      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: theme.border, true: '#8ad4e5' }}
        thumbColor={value ? theme.accent : theme.panelBackground}
      />
    </View>
  );
}

export default function ConfiguracoesScreen() {
  const { userName, email, password, updateProfile, isAdmin } = useAuth();
  const { theme, themeMode, setThemeMode, soundEnabled, biometricEnabled, updatePreference } =
    usePreferences();
  const styles = createStyles(theme);
  const [form, setForm] = useState({
    userName: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    setForm({
      userName: userName || '',
      email: email || '',
      password: password || '',
    });
  }, [email, password, userName]);

  function handleSaveProfile() {
    const result = updateProfile(form);

    if (!result.ok) {
      Alert.alert('Nao foi possivel atualizar', result.error);
      return;
    }

    Alert.alert('Perfil atualizado', 'Seus dados foram atualizados com sucesso.');
  }

  return (
    <ProfileDetailScreen
      headerLabel="Perfil"
      title="Configuracoes"
      subtitle="Ajuste preferencias da sua conta e deixe a experiencia do app com a sua cara.">
      <SectionCard
        icon="sliders"
        title="Preferencias do app"
        description="Essas configuracoes afetam a forma como voce navega e recebe retorno visual do aplicativo.">
        <SettingRow
          icon="moon"
          title="Tema escuro"
          description="Alterna as principais telas para uma paleta escura."
          value={themeMode === 'dark'}
          onValueChange={(value) => setThemeMode(value ? 'dark' : 'light')}
        />
        <SettingRow
          icon="volume-2"
          title="Sons de interacao"
          description="Reproduz pequenos sons ao adicionar produtos e concluir acoes."
          value={soundEnabled}
          onValueChange={(value) => updatePreference('soundEnabled', value)}
        />
      </SectionCard>

      <SectionCard
        icon="shield"
        title="Seguranca"
        description="Camadas extras para proteger seu acesso e acompanhar alteracoes importantes.">
        <SettingRow
          icon="smartphone"
          title="Biometria"
          description="Permite entrar no app usando biometria quando disponivel."
          value={biometricEnabled}
          onValueChange={(value) => updatePreference('biometricEnabled', value)}
        />
        <BulletRow text="Troque sua senha regularmente para manter sua conta protegida." />
        <BulletRow text="Revise seus dispositivos conectados sempre que fizer login em outro aparelho." />
      </SectionCard>

      <SectionCard
        icon="user"
        title="Conta"
        description="Atualize os dados principais exibidos no seu perfil e no dashboard.">
        <View style={styles.formField}>
          <Text style={styles.fieldLabel}>Nome</Text>
          <TextInput
            value={form.userName}
            onChangeText={(value) => setForm((current) => ({ ...current, userName: value }))}
            placeholder="Seu nome"
            placeholderTextColor={theme.textMuted}
            style={styles.input}
          />
        </View>
        <View style={styles.formField}>
          <Text style={styles.fieldLabel}>Email</Text>
          <TextInput
            value={form.email}
            onChangeText={(value) => setForm((current) => ({ ...current, email: value }))}
            placeholder="voce@exemplo.com"
            placeholderTextColor={theme.textMuted}
            autoCapitalize="none"
            keyboardType="email-address"
            editable={!isAdmin}
            style={[styles.input, isAdmin && styles.inputDisabled]}
          />
        </View>
        <View style={styles.formField}>
          <Text style={styles.fieldLabel}>Senha</Text>
          <TextInput
            value={form.password}
            onChangeText={(value) => setForm((current) => ({ ...current, password: value }))}
            placeholder="Nova senha"
            placeholderTextColor={theme.textMuted}
            secureTextEntry
            style={styles.input}
          />
        </View>

        <Pressable style={styles.actionButton} onPress={handleSaveProfile}>
          <Text style={styles.actionButtonText}>Salvar alteracoes</Text>
        </Pressable>
      </SectionCard>
    </ProfileDetailScreen>
  );
}

const createStyles = (theme) =>
  StyleSheet.create({
    settingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 10,
      marginTop: 14,
    },
    settingInfo: {
      flex: 1,
      flexDirection: 'row',
      gap: 10,
    },
    settingIconWrap: {
      width: 28,
      height: 28,
      borderRadius: 10,
      backgroundColor: theme.accentSoft,
      alignItems: 'center',
      justifyContent: 'center',
    },
    settingTextWrap: {
      flex: 1,
    },
    settingTitle: {
      color: theme.textPrimary,
      fontSize: 13,
      fontWeight: '600',
    },
    settingDescription: {
      color: theme.textSecondary,
      fontSize: 11,
      lineHeight: 16,
      marginTop: 2,
    },
    formField: {
      marginTop: 14,
    },
    fieldLabel: {
      color: theme.textPrimary,
      fontSize: 12,
      fontWeight: '700',
      marginBottom: 6,
    },
    input: {
      minHeight: 42,
      borderRadius: 12,
      backgroundColor: theme.inputBackground,
      color: theme.textPrimary,
      paddingHorizontal: 12,
      fontSize: 13,
    },
    inputDisabled: {
      opacity: 0.55,
    },
    actionButton: {
      marginTop: 14,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.accent,
      alignItems: 'center',
      justifyContent: 'center',
    },
    actionButtonText: {
      color: theme.mode === 'dark' ? theme.black : theme.white,
      fontSize: 13,
      fontWeight: '700',
    },
  });
